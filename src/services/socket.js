import { io } from 'socket.io-client';
import API from './API';

// eslint-disable-next-line no-undef
const DOMAIN_PREFIX = __DEV__ ? 'preprod-' : '';
const SOCKET_BASE_URL = `https://${DOMAIN_PREFIX}socket.dropy-app.com`;

const initSockets = () => {
  Socket.dropySocket = io(`${SOCKET_BASE_URL}/dropy`, {
    transports: ['websocket'],
    extraHeaders: {
      ...API.getHeaders(),
    },
  });

  Socket.chatSocket = io(`${SOCKET_BASE_URL}/chat`, {
    transports: ['websocket'],
    extraHeaders: {
      ...API.getHeaders(),
    },
  });

  Socket.dropySocket.on('connect_error', err => {
    console.error(`Dropy socket connect_error due to ${err.message}`);
  });

  Socket.chatSocket.on('connect_error', err => {
    console.error(`Chat socket connect_error due to ${err.message}`);
  });
};

const destroySockets = () => {
  Socket.dropySocket?.disconnect();
  Socket.chatSocket?.disconnect();

  Socket.dropySocket = null;
  Socket.chatSocket = null;
};

const Socket = {
  initSockets,
  destroySockets,
  dropySocket: null,
  chatSocket: null,
};

export default Socket;

