import { Manager } from 'socket.io-client';
import AppInfo from '../../app.json';
import API from './API';

const DOMAIN_PREFIX = AppInfo.productionMode ? '' : 'preprod-';
const SOCKET_BASE_URL = AppInfo.customSocket ?? `https://${DOMAIN_PREFIX}socket.dropy-app.com`;

const initSockets = () => {
  Socket.manager = new Manager(SOCKET_BASE_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    extraHeaders: {
      ...API.getHeaders(),
    },
  });

  Socket.dropySocket = Socket.manager.socket('/dropy');
  Socket.chatSocket = Socket.manager.socket('/chat');
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
  manager: null,
  dropySocket: null,
  chatSocket: null,
};

export default Socket;

