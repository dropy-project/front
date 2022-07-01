import { getUniqueId } from 'react-native-device-info';

import Axios from 'axios';
import Storage from '../utils/storage';

const SERVER_BASE_URL = 'https://api.dropy-app.com';

const axios = Axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 5000,
});

const getHeaders = () => {
  return axios.defaults.headers.common;
};

const register = async (displayName) => {
  const uid = getUniqueId();
  const response = await axios.post('/register', {
    uid,
    displayName,
  });
  return response.data;
};

const login = async () => {
  const uid = getUniqueId();
  const response = await axios.post('/login', {
    uid,
  });

  const  { authTokenData, refreshTokenData, user } = response.data;
  axios.defaults.headers.common['Authorization'] = authTokenData.token;

  await Storage.setItem('@auth_tokens', { authTokenData, refreshTokenData });

  return user;
};

const createDropy = async (latitude, longitude) => {
  const response = await axios.post('/dropy/add', {
    latitude,
    longitude,
  });
  return response.data;
};

const postDropyMediaFromPath = async (dropyId, mediaPath, mediaType) => {
  // eslint-disable-next-line no-undef
  var data = new FormData();
  data.append(mediaType, {
    uri: mediaPath,
    name: `${mediaType}-${dropyId}`,
    type: 'image/jpeg',
  });

  const response = await axios.post(`/dropy/add/${dropyId}/media`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response;
};

const postDropyMediaData = async (dropyId, mediaData, mediaType) => {
  // eslint-disable-next-line no-undef
  var data = new FormData();
  data.append(mediaType, mediaData);

  const response = await axios.post(`/dropy/add/${dropyId}/media`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response;
};

const getDropiesAround = async (latitude, longitude) => {
  const result = await axios.post('/dropy/findAround', {
    latitude,
    longitude,
  });
  return result;
};

const retrieveDropy = async (dropyId) => {
  const result = await axios.post('/dropy/retrieve', {
    dropyId,
  });
  return result;
};

const postUserDeviceToken = (deviceToken) => {
  const result = axios.post('/user/updateDeviceToken', {
    deviceToken,
  });
  return result;
};

const userBackgroundGeolocationPingUrl = () => {
  return `${SERVER_BASE_URL}/user/backgroundGeolocationPing`;
};

const getDropyMedia = async (dropyId) => {
  const result = await axios.get(`/dropy/${dropyId}/media`);
  return result;
};

const getDropy = async (dropyId) => {
  const result = await axios.get(`/dropy/${dropyId}`);
  return result;
};

const API = {
  getHeaders,
  register,
  login,
  createDropy,
  postDropyMediaData,
  postDropyMediaFromPath,
  getDropiesAround,
  retrieveDropy,
  userBackgroundGeolocationPingUrl,
  getDropyMedia,
  getDropy,
  postUserDeviceToken,
};

export default API;
