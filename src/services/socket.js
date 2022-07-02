
const SOCKET_BASE_URL = 'https://socket.dropy-app.com';

const dropySocketUrl = () => {
  return `${SOCKET_BASE_URL}/dropy`;
};

const Socket = {
  dropySocketUrl,
};

export default Socket;
