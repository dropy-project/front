import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';
import useTravelDistanceCallback from './useTravelDistanceCallback';
import { useInitializedGeolocation } from './useGeolocation';

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();
  const { userCoordinates, initialized: geolocationInitialized } = useInitializedGeolocation();

  const [dropiesAround, setDropiesAround] = useState([]);

  useTravelDistanceCallback(updateAllDropiesAround, 100);

  useEffect(() => {
    if (geolocationInitialized === false) return;
    if (Socket.dropySocket == null) return;

    updateAllDropiesAround();
    Socket.dropySocket.on('connect', updateAllDropiesAround);

    Socket.dropySocket.on('dropy_created', (response) => {

      if (response.error != null) {
        console.error('Error getting created dropy', response.error);
        return;
      }
      const newDropy = response.data;
      console.log('New dropy emitter ', newDropy.emitterId);

      newDropy.isUserDropy = newDropy.emitterId === user.id;
      setDropiesAround(olds => [...olds, response.data]);
    });

    Socket.dropySocket.on('dropy_retrieved', (response) => {
      if (response.error != null) {
        console.error('Error getting retrieved dropy', response.error);
        return;
      }
      setDropiesAround(olds => olds.filter(dropy => dropy.id !== response.data));
    });

    return () => {
      Socket.dropySocket.off('connect');
      Socket.dropySocket.off('dropy_created');
      Socket.dropySocket.off('dropy_retrieved');
    };
  }, [geolocationInitialized]);

  function updateAllDropiesAround() {
    if (Socket.dropySocket == null) return;
    if (Socket.dropySocket.connected === false) return;
    if(userCoordinates == null) return;

    Socket.dropySocket.emit('all_dropies_around', {
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
    }, (response) => {
      if(response.error != null) {
        console.error('Error getting dropies around', response.error);
        return;
      }
      const dropies = response.data.slice(0, 30).map((dropy) =>  ({
        ...dropy,
        isUserDropy: dropy.emitterId === user.id,
      }));
      setDropiesAround(dropies ?? []);
    });
  }

  const createDropy = (latitude, longitude) => {
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_created', { latitude, longitude }, resolve);
    });
  };

  const retrieveDropy = (dropyId) => {
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_retrieved', { dropyId }, resolve);
    });
  };

  return { dropiesAround, createDropy, retrieveDropy };
};

export default useDropiesAroundSocket;
