import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../states/SocketContextProvider';
import useCurrentUser from './useCurrentUser';

const log = (...params) => {
  console.log('\x1b[33m[ DropiesAround Socket ]\x1b[0m', ...params);
};

const useDropiesAroundSocket = () => {

  const { user } = useCurrentUser();

  const [dropiesAround, setDropiesAround] = useState([]);

  const { dropySocket } = useContext(SocketContext);

  useEffect(() => {
    dropySocket.on('all_dropies_around', (response) => {
      if(response.error != null) {
        log('Error getting dropies around', response.error);
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
      dropySocket.off('all_dropies_around');
    };
  }, []);

  const createDropy = (latitude, longitude) => {
    return new Promise((resolve) => {
      dropySocket.emit('dropy_created', { latitude, longitude }, resolve);
    });
  };

  const retreiveDropy = (dropyId) => {
    console.log('retreiveDropy', dropyId);
    return new Promise((resolve) => {
      dropySocket.emit('dropy_retreived', { dropyId }, resolve);
    });
  };

  return { dropiesAround, createDropy, retreiveDropy };
};

export default useDropiesAroundSocket;
