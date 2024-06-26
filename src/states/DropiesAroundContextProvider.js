import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import useSocket from '../hooks/useSocket';
import { coordinatesDistance } from '../utils/coordinates';
import { UserContext } from './UserContextProvider';
import { GeolocationContext } from './GeolocationContextProvider';

const REACH_DISTANCE_METERS = 100;
const EMIT_LIMIT_DISTANCE_METERS = 60;

export const DropiesAroundContext = createContext(null);

const DropiesAroundContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const { userCoordinates } = useContext(GeolocationContext);
  const { dropySocket } = useSocket();

  const [dropiesAround, setDropiesAround] = useState([]);
  const [canEmitDropy, setCanEmitDropy] = useState(true);

  const processDropy = useCallback((rawDropy) => {
    const dropyCoordinates = {
      latitude: rawDropy.latitude,
      longitude: rawDropy.longitude,
    };

    let distanceFromUser;
    if (userCoordinates == null) {
      distanceFromUser = 0;
      console.warn('Processing dropy without global user coordinates');
    } else
      distanceFromUser = coordinatesDistance(userCoordinates, dropyCoordinates);

    const reachable = distanceFromUser < REACH_DISTANCE_METERS;
    const isUserDropy = rawDropy.emitterId === user?.id;
    const isInEmitRestrictedRange = distanceFromUser < EMIT_LIMIT_DISTANCE_METERS && isUserDropy;
    return { ...rawDropy, isUserDropy, reachable, isInEmitRestrictedRange };
  }, [user, userCoordinates]);

  useEffect(() => {
    if (dropySocket == null) {
      setDropiesAround([]);
      return;
    }

    dropySocket.on('dropy_created', (response) => {
      if (response.error != null) {
        console.error('Error getting created dropy', response.error);
        return;
      }
      setDropiesAround((olds) => {
        const newDropies = [...olds, processDropy(response.data)];
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

      setDropiesAround((olds) => {
        const newDropies = olds.filter((dropy) => dropy.id !== response.data);

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
  }, [dropySocket, processDropy]);

  useEffect(() => {
    if (userCoordinates?.geoHashs == null)
      return;
    if (dropySocket == null)
      return;

    dropySocket.emit('zones_update', { zones: userCoordinates.geoHashs }, (response) => {
      if (response.error != null) {
        console.error('Error updating zones', response.error);
        return;
      }

      const newDropies = response.data.map((dropy) => processDropy(dropy));

      const restrictedRange = newDropies.some((dropy) => dropy.isInEmitRestrictedRange);
      setCanEmitDropy(!restrictedRange);

      setDropiesAround(newDropies ?? []);
    });
  }, [
    userCoordinates?.geoHashs,
    user,
    dropySocket,
    dropySocket?.connected,
    processDropy
  ]);

  useEffect(() => {
    if (userCoordinates == null)
      return;

    const checkForDropiesInRange = async () => {
      const updatedDropies = dropiesAround.map((dropy) => processDropy(dropy));

      const restrictedRange = updatedDropies.some((dropy) => dropy.isInEmitRestrictedRange);
      setCanEmitDropy(!restrictedRange);

      const requireStateUpdate = updatedDropies.some((dropy, index) => dropy.reachable !== dropiesAround[index].reachable);
      if (requireStateUpdate)
        setDropiesAround(updatedDropies);
    };

    checkForDropiesInRange();
  }, [dropiesAround, processDropy, userCoordinates]);

  const createDropy = useCallback((latitude, longitude, mediaType, content) => {
    setCanEmitDropy(false);
    return new Promise((resolve) => {
      dropySocket.emit('dropy_created', { latitude, longitude, mediaType, content }, resolve);
    });
  }, [dropySocket]);

  const retrieveDropy = useCallback((dropyId) => new Promise((resolve) => {
    dropySocket.emit('dropy_retrieved', { dropyId }, (response) => {
      if (response.error == null)
        setDropiesAround((olds) => olds.filter((dropy) => dropy.id !== dropyId));

      resolve(response);
    });
  }), [dropySocket]);

  const value = useMemo(() => ({
    dropiesAround,
    createDropy,
    retrieveDropy,
    canEmitDropy,
  }), [dropiesAround, createDropy, retrieveDropy, canEmitDropy]);

  return (
    <DropiesAroundContext.Provider value={value}>
      {children}
    </DropiesAroundContext.Provider>
  );
};

export default DropiesAroundContextProvider;
