import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../services/API';
import useCurrentUser from './useCurrentUser';

const log = (...params) => {
  console.log('\x1b[33m[ DropiesAround Socket ]\x1b[0m', ...params);
};

const useDropiesAroundSocket = () => {

  const socketRef = useRef();

  const { user } = useCurrentUser();

  const [dropiesAround, setDropiesAround] = useState([]);

  useEffect(() => {
    socketRef.current = io('http://192.168.1.11:4000', {
      transports: ['websocket'],
      extraHeaders: {
        ...API.getHeaders(),
      },
    });

    socketRef.current.on('connect', () => {
      log('Dropies around socket connected');
    });

    socketRef.current.on('all_dropies_around', (dropies) => {
      console.log(dropies);
      const pute = dropies.map((dropy) => {
        return {
          ...dropy,
          isUserDropy: dropy.emitterId === user.id,
        };
      });
      setDropiesAround(pute ?? []);
    });

    // socketRef.current.on('dropy_created', (dropies) => {
    // });

    // socketRef.current.on('dropy_retreived', (dropies) => {
    // });

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
