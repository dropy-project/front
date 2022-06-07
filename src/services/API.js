import { Platform } from 'react-native';
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
    uri: Platform.OS === 'android' ? mediaPath : mediaPath.replace('file://', ''),
    name: `${mediaType}-${dropyId}`,
  });

  const response = await axios.post(`/dropy/add/${dropyId}/media`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data; ',
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
        'Content-Type': 'multipart/form-data; ',
      },
    }
  );
  return response;
};

const getDropiesAround = async (userId, latitude, longitude) => {
  const result = await axios.post('/dropy/findAround', {
    latitude,
    longitude,
    userId,
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

const API = {
  getHeaders,
  register,
  login,
  createDropy,
  postDropyMediaData,
  postDropyMediaFromPath,
  getDropiesAround,
  retrieveDropy,
};

export default API;
