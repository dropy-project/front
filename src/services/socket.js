
const SOCKET_BASE_URL = 'http://localhost:4000';
// const SOCKET_BASE_URL = 'https://socket.dropy-app.com';

const dropySocketUrl = () => {
  return `${SOCKET_BASE_URL}/dropy`;
};

const chatSocketUrl = () => {
  return `${SOCKET_BASE_URL}/chat`;
};

const Socket = {
  dropySocketUrl,
  chatSocketUrl,
};

export default Socket;
