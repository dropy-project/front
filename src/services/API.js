import { getUniqueId } from 'react-native-device-info';
import Axios from 'axios';

const SERVER_BASE_URL = 'http://localhost:3000';

const axios = Axios.create({
  baseURL: SERVER_BASE_URL
});

const register = async (displayName) => {
  const uid = getUniqueId();
  const response = await axios.post('/register', {
    uid,
    displayName
  });
  return response.data;
};

const login = async () => {
  const uid = getUniqueId();
  const response = await axios.post('/login', {
    uid
  });
  axios.defaults.headers.common['Authorization'] = response.headers['set-cookie'];
};

const getUser = async () => {
  const uid = getUniqueId();
  const response = await axios.get(`/users/${uid}`);
  return response.data;
};

const API = {
  register,
  login,
  getUser
};

export default API;
