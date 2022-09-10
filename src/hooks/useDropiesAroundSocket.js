import { useEffect, useState } from 'react';
import { coordinatesDistance } from '../utils/coordinates';
import useCurrentUser from './useCurrentUser';
import { useInitializedGeolocation } from './useGeolocation';
import useSocket from './useSocket';

const REACH_DISTANCE_METERS = 100;
const EMIT_LIMIT_DISTANCE_METERS = 25;

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();
  const { userCoordinates, initialized: geolocationInitialized } = useInitializedGeolocation();

  const { dropySocket } = useSocket();

  const [dropiesAround, setDropiesAround] = useState([]);
  const [canEmitDropy, setCanEmitDropy] = useState(true);

  useEffect(() => {
    if (geolocationInitialized === false) return;
    if (dropySocket == null) return;

    dropySocket.on('dropy_created', (response) => {
      if (response.error != null) {
        console.error('Error getting created dropy', response.error);
        return;
      }
      const newDropy = response.data;
      console.log('New dropy emitter ', newDropy.emitterId);

      setDropiesAround(olds => {
        const newDropies = [...olds, processDropy(newDropy, user, userCoordinates)];

        const restrictedRange = newDropies.some((dropy) => dropy.isInEmitRestrictedRange);
        setCanEmitDropy(!restrictedRange);

        return newDropies;
      });
    });

    dropySocket.on('dropy_retrieved', (response) => {
      if (response.error != null) {
        console.error('Error getting retrieved dropy', response.error);
        return;
      }

      setDropiesAround(olds => {
        const newDropies = olds.filter(dropy => dropy.id !== response.data);

        const restrictedRange = newDropies.some((dropy) => dropy.isInEmitRestrictedRange);
        setCanEmitDropy(!restrictedRange);

        return newDropies;
      });
    });

    return () => {
      dropySocket.off('connect');
      dropySocket.off('dropy_created');
      dropySocket.off('dropy_retrieved');
    };
  }, [geolocationInitialized]);

  useEffect(() => {
    if(userCoordinates?.geoHashs == null) return;
    dropySocket.emit('zones_update', { zones: userCoordinates.geoHashs }, (response) => {

      if(response.error != null) {
        console.error('Error updating zones', response.error);
        return;
      }

      const newDropies = response.data.map((dropy) =>  {
        return processDropy(dropy, user, userCoordinates);
      });

      const restrictedRange = newDropies.some((dropy) => dropy.isInEmitRestrictedRange);
      setCanEmitDropy(!restrictedRange);

      setDropiesAround(newDropies ?? []);
    });
  }, [userCoordinates?.geoHashs[0]]);

  useEffect(() => {
    if (userCoordinates == null) return;
    checkForDropiesInRange();
  }, [userCoordinates]);

  const checkForDropiesInRange = async () => {
    const updatedDropies = dropiesAround.map((dropy) => {
      return processDropy(dropy, user, userCoordinates);
    });

    const restrictedRange = updatedDropies.some((dropy) => dropy.isInEmitRestrictedRange);
    setCanEmitDropy(!restrictedRange);

    const requireStateUpdate = updatedDropies.some((dropy) => dropy.reachable !== dropy.reachable);
    if(requireStateUpdate)
      setDropiesAround(updatedDropies);
  };

  const createDropy = (latitude, longitude, mediaType, content) => {
    setCanEmitDropy(false);
    return new Promise((resolve) => {
      dropySocket.emit('dropy_created', { latitude, longitude, mediaType, content }, resolve);
    });
  };

  const retrieveDropy = (dropyId) => {
    setDropiesAround(olds => olds.filter(dropy => dropy.id !== dropyId));
    return new Promise((resolve) => {
      dropySocket.emit('dropy_retrieved', { dropyId }, resolve);
    });
  };

  const processDropy = (rawDropy, user, userCoordinates) => {
    const dropyCoordinates = {
      latitude: rawDropy.latitude,
      longitude: rawDropy.longitude,
    };

    const distanceFromUser = coordinatesDistance(userCoordinates, dropyCoordinates);
    const reachable = distanceFromUser < REACH_DISTANCE_METERS;
    const isInEmitRestrictedRange = distanceFromUser < EMIT_LIMIT_DISTANCE_METERS;
    const isUserDropy = rawDropy.emitterId === user.id;
    return { ...rawDropy, isUserDropy, reachable, isInEmitRestrictedRange };
  };

  return { dropiesAround, createDropy, retrieveDropy, canEmitDropy };
};

export default useDropiesAroundSocket;
