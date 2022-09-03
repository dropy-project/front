import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';
import { useInitializedGeolocation } from './useGeolocation';

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();
  const { userCoordinates, initialized: geolocationInitialized } = useInitializedGeolocation();

  const [dropiesAround, setDropiesAround] = useState([]);

  useEffect(() => {
    if (geolocationInitialized === false) return;
    if (Socket.dropySocket == null) return;

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

  useEffect(() => {
    Socket.dropySocket.emit('zones_update', { zones: userCoordinates.geoHashs }, (response) => {

      if(response.error != null) {
        console.error('Error updating zones', response.error);
        return;
      }

      const dropies = response.data.slice(0, 30).map((dropy) =>  ({
        ...dropy,
        isUserDropy: dropy.emitterId === user.id,
      }));

      setDropiesAround(dropies ?? []);
    });
  }, [userCoordinates.geoHashs[0]]);

  const createDropy = (latitude, longitude, mediaType, content) => {
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_created', { latitude, longitude, mediaType, content }, resolve);
    });
  };

  const retrieveDropy = (dropyId) => {
    setDropiesAround(olds => olds.filter(dropy => dropy.id !== dropyId));
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_retrieved', { dropyId }, resolve);
    });
  };

  return { dropiesAround, createDropy, retrieveDropy };
};

export default useDropiesAroundSocket;
