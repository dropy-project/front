import Axios from 'axios';
import Storage from '../utils/storage';
import AppInfo from '../../app.json';

const DOMAIN_PREFIX = AppInfo.productionMode ? '' : 'preprod-';
const API_BASE_URL = AppInfo.customAPI ?? `https://${DOMAIN_PREFIX}api.dropy-app.com`;

const AXIOS_PARAMS = {
  baseURL: API_BASE_URL,
  timeout: 5000,
};

let axios = Axios.create(AXIOS_PARAMS);

const getHeaders = () => {
  return axios.defaults.headers.common;
};

const register = async (displayName, email, password, newsLetter) => {
  const response = await axios.post('/register', {
    displayName,
    email,
    password,
    newsLetter,
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post('/login', {
    email,
    password,
  });

  const  { accessToken, refreshToken, expires, profile: user } = response.data;

  axios = Axios.create(AXIOS_PARAMS);
  axios.defaults.headers.common['Authorization'] = accessToken;

  await Storage.setItem('@auth_tokens', { accessToken, refreshToken, expires });

  return user;
};

const refreshTokenUrl = () => {
  return `${API_BASE_URL}/refresh`;
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

const serverVersionIsCompatible = async () => {
  try {
    const result = await axios.get(`/version/${AppInfo.requiredServerVersion}`);
    return result.status === 200;
  } catch (error) {
    console.error('Checking server version error : ', error?.response ?? error);
    return error.response.status !== 418;
  }
};

const getProfile = async (userId) => {
  const result = await axios.get(`/user/profile/${userId}`);
  return result;
};

const postProfileInfos = async (about, pronouns, displayName) => {
  const result = await axios.post('/user/profile', {
    about,
    pronouns,
    displayName,
  });
  return result;
};

const postProfilePicture = async (filePath) => {
  // eslint-disable-next-line no-undef
  var data = new FormData();
  data.append('profile', {
    uri: filePath,
    name: `${filePath}`,
    type: 'image/jpeg',
  });

  const response = await axios.post('/user/profile/picture', data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response;
};

const deleteProfilePicture = async () => {
  const result = await axios.delete('/user/profile/picture');
  return result;
};

const reportUser = async (userId, dropyId) => {
  const result = await axios.post(`/user/report/${userId}`, {
    dropyId,
  });
  return result;
};

const blockUser = async (userId) => {
  const result = await axios.post(`/user/block/${userId}`);
  return result;
};

const getUserDropies = async () => {
  const result = await axios.get('/dropy/userEmitted');
  return result;
};

const getUserRetrievedDropies = async () => {
  const result = await axios.get('/dropy/userRetrieved');
  return result;
};

const deleteUserDropy = async (dropyId) => {
  const result = await axios.delete(`/dropy/${dropyId}`);
  return result;
};

const getBlockedUsers = async () => {
  const result = await axios.get('/user/blocked');
  return result;
};

const unblockUser = async (userId) => {
  const result = await axios.post(`/user/unblock/${userId}`);
  return result;
};

const API = {
  getHeaders,
  register,
  login,
  refreshTokenUrl,
  userBackgroundGeolocationPingUrl,
  getDropyMedia,
  getDropy,
  postUserDeviceToken,
  getConversations,
  serverVersionIsCompatible,
  postProfileInfos,
  getProfile,
  postProfilePicture,
  reportUser,
  blockUser,
  deleteProfilePicture,
  getUserDropies,
  deleteUserDropy,
  getBlockedUsers,
  unblockUser,
  getUserRetrievedDropies,
};

export default API;
