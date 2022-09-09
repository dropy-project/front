import { useEffect, useState } from 'react';
import { coordinatesDistance } from '../utils/coordinates';
import useCurrentUser from './useCurrentUser';
import { useInitializedGeolocation } from './useGeolocation';
import useSocket from './useSocket';

const REACH_DISTANCE_METERS = 100;

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();
  const { userCoordinates, initialized: geolocationInitialized } = useInitializedGeolocation();

  const { dropySocket } = useSocket();

  const [dropiesAround, setDropiesAround] = useState([]);

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

      newDropy.isUserDropy = newDropy.emitterId === user.id;

      const dropyPosition = {
        latitude: newDropy.latitude,
        longitude: newDropy.longitude,
      };

      const isInRange = coordinatesDistance(userCoordinates, dropyPosition) < REACH_DISTANCE_METERS;
      setDropiesAround(olds => [
        ...olds,
        response.data,
        isInRange
      ]);
    });

    dropySocket.on('dropy_retrieved', (response) => {
      if (response.error != null) {
        console.error('Error getting retrieved dropy', response.error);
        return;
      }
      setDropiesAround(olds => olds.filter(dropy => dropy.id !== response.data));
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

      const dropies = response.data.slice(0, 30).map((dropy) =>  {
        const dropyPosition = {
          latitude: dropy.latitude,
          longitude: dropy.longitude,
        };

        const isInRange = coordinatesDistance(userCoordinates, dropyPosition) < REACH_DISTANCE_METERS;
        return {
          ...dropy,
          isUserDropy: dropy.emitterId === user.id,
          isInRange,
        };
      });

      setDropiesAround(dropies ?? []);
    });
  }, [userCoordinates?.geoHashs[0]]);

  useEffect(() => {
    if (userCoordinates == null) return;
    checkForDropiesInRange();
  }, [userCoordinates]);

  const checkForDropiesInRange = async () => {
    setDropiesAround(old => old.map(dropy => {
      const dropyPosition = {
        latitude: dropy.latitude,
        longitude: dropy.longitude,
      };
      const distance = coordinatesDistance(userCoordinates, dropyPosition);
      return {
        ...dropy,
        isInRange: distance < REACH_DISTANCE_METERS,
      };
    }));
  };

  const createDropy = (latitude, longitude, mediaType, content) => {
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

  return { dropiesAround, createDropy, retrieveDropy };
};

export default useDropiesAroundSocket;
