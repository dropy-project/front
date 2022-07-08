import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();

  const [dropiesAround, setDropiesAround] = useState([]);

  useEffect(() => {
    Socket.dropySocket.on('all_dropies_around', (response) => {
      if(response.error != null) {
        console.error('Error getting dropies around', response.error);
        return;
      }

      const dropies = response.data.map((dropy) => {
        return {
          ...dropy,
          isUserDropy: dropy.emitterId === user.id,
        };
      });
      setDropiesAround(dropies ?? []);
    });

    return () => {
      Socket.dropySocket.off('all_dropies_around');
    };
  }, []);

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
