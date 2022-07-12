import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();

  const [dropiesAround, setDropiesAround] = useState([]);

  useEffect(() => {
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

    Socket.dropySocket.on('dropy_retreived', (response) => {
      if (response.error != null) {
        console.error('Error getting retreived dropy', response.error);
        return;
      }

      setDropiesAround(olds => olds.filter(dropy => dropy.id !== response.data));
    });

    return () => {
      Socket.dropySocket.off('connect');
      Socket.dropySocket.off('dropy_created');
      Socket.dropySocket.off('dropy_retreived');
    };
  }, []);

  const updateAllDropiesAround = () => {
    if (Socket.dropySocket == null) return;
    if (Socket.dropySocket.connected === false) return;
    Socket.dropySocket.emit('all_dropies_around', (response) => {
      if(response.error != null) {
        console.error('Error getting dropies around', response.error);
        return;
      }
      const dropies = response.data.map((dropy) =>  ({
        ...dropy,
        isUserDropy: dropy.emitterId === user.id,
      }));
      setDropiesAround(dropies ?? []);
    });
  };

  const createDropy = (latitude, longitude) => {
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_created', { latitude, longitude }, resolve);
    });
  };

  const retreiveDropy = (dropyId) => {
    return new Promise((resolve) => {
      Socket.dropySocket.emit('dropy_retreived', { dropyId }, resolve);
    });
  };

  return { dropiesAround, createDropy, retreiveDropy };
};

export default useDropiesAroundSocket;
