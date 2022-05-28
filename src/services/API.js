import { getUniqueId } from 'react-native-device-info';
import Axios from 'axios';
import { Platform } from 'react-native';

const SERVER_BASE_URL = 'http://38.242.199.26:3000';
// const SERVER_BASE_URL = 'http://localhost:3000';

const axios = Axios.create({
  baseURL: SERVER_BASE_URL
});

// axios.interceptors.request.use(
//   function (config) {
//     console.log(config.method, config.url, config.params || config.data || {}, config.headers);
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   function (response) {
//     console.log(response.data);
//     return response;
//   },
//   function (error) {
//     console.log(error.response?.data || error);
//     return Promise.reject(error);
//   }
// );

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
  const token = response.headers['set-cookie'];
  console.log(`Received token : ${token}`);
  axios.defaults.headers.common['Authorization'] = token;
};

const getUser = async () => {
  const uid = getUniqueId();

  const response = await axios.get(`/user/${uid}`);
  return response.data;
};

const createDropy = async (userId, latitude, longitude) => {
  const response = await axios.post('/dropy/add', {
    emitterId: userId,
    latitude,
    longitude
  });
  return response.data;
};

const postDropyMediaFromPath = async (dropyId, mediaPath, mediaType) => {
  // eslint-disable-next-line no-undef
  var data = new FormData();
  data.append(mediaType, {
    uri: Platform.OS === 'android' ? mediaPath : mediaPath.replace('file://', ''),
    name: `${mediaType}-${dropyId}`
  });

  const response = await axios.post(`/dropy/add/${dropyId}/media`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data; '
      }
    }
  );
  return response;
};

const getDropiesAround = async (userId, latitude, longitude) => {
  const result = await axios.post('/dropy/findAround', {
    latitude,
    longitude,
    userId
  });
  return result;
};

const API = {
  register,
  login,
  getUser,
  createDropy,
  postDropyMediaFromPath,
  getDropiesAround
};

export default API;
