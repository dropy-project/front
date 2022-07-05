import { getUniqueId } from 'react-native-device-info';

import Axios from 'axios';
import Storage from '../utils/storage';

const API_BASE_URL = 'http://localhost:3000';
// const API_BASE_URL = 'https://api.dropy-app.com';

const axios = Axios.create({
  baseURL: API_BASE_URL,
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

const postUserDeviceToken = (deviceToken) => {
  const result = axios.post('/user/updateDeviceToken', {
    deviceToken,
  });
  return result;
};

const userBackgroundGeolocationPingUrl = () => {
  return `${API_BASE_URL}/user/backgroundGeolocationPing`;
};

const dropyMediaUrl = (dropyId) => {
  return `${API_BASE_URL}/dropy/${dropyId}/media`;
};

const getDropyMedia = async (dropyId) => {
  const result = await axios.get(`/dropy/${dropyId}/media`);
  return result;
};

const getDropy = async (dropyId) => {
  const result = await axios.get(`/dropy/${dropyId}`);
  return result;
};

const getConversations = async () => {
  const result = await axios.get('/user/conversations');
  return result;
};

const API = {
  getHeaders,
  register,
  login,
  postDropyMediaData,
  postDropyMediaFromPath,
  userBackgroundGeolocationPingUrl,
  getDropyMedia,
  getDropy,
  postUserDeviceToken,
  getConversations,
  dropyMediaUrl,
};

export default API;
