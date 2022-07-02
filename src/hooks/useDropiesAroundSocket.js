import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../services/API';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';

const log = (...params) => {
  console.log('\x1b[33m[ DropiesAround Socket ]\x1b[0m', ...params);
};

const useDropiesAroundSocket = () => {

  const socketRef = useRef();

  const { user } = useCurrentUser();

  const [dropiesAround, setDropiesAround] = useState([]);

  useEffect(() => {
    socketRef.current = io(Socket.dropySocketUrl(), {
      transports: ['websocket'],
      extraHeaders: {
        ...API.getHeaders(),
      },
    });

    socketRef.current.on('connect', () => {
      log('Dropies around socket connected');
    });

    socketRef.current.on('all_dropies_around', (response) => {
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

    socketRef.current.on('connect_error', (err) => {
      log(`connect_error due to ${err.message}`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const createDropy = (latitude, longitude) => {
    return new Promise((resolve) => {
      socketRef.current.emit('dropy_created', { latitude, longitude }, resolve);
    });
  };

  const retreiveDropy = (dropyId) => {
    console.log('retreiveDropy', dropyId);
    return new Promise((resolve) => {
      socketRef.current.emit('dropy_retreived', { dropyId }, resolve);
    });
  };

  return { dropiesAround, createDropy, retreiveDropy };
};

export default useDropiesAroundSocket;
