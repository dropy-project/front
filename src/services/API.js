import { getUniqueId } from 'react-native-device-info';

import Axios from 'axios';

const SERVER_BASE_URL = 'https://api.dropy-app.com';

const axios = Axios.create({
  baseURL: SERVER_BASE_URL,
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
  const token = response.headers['set-cookie'];
  axios.defaults.headers.common['Authorization'] = token;
  return response.data;
};

const createDropy = async (userId, latitude, longitude) => {
  const response = await axios.post('/dropy/add', {
    emitterId: userId,
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

const getDropiesAround = async (userId, latitude, longitude) => {
  const result = await axios.post('/dropy/findAround', {
    userId,
    latitude,
    longitude,
  });
  return result;
};

const retrieveDropy = async (retrieverId, dropyId) => {
  const result = await axios.post('/dropy/retrieve', {
    retrieverId,
    dropyId,
  });
  return result;
};

const userBackgroundGeolocationPingUrl = (userId) => {
  return `${SERVER_BASE_URL}/user/${userId}/backgroundGeolocationPing`;
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
};

export default API;
