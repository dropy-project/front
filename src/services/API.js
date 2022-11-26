import Axios from 'axios';
import Storage from '../utils/storage';
import AppInfo from '../../app.json';

const DOMAIN_PREFIX = AppInfo.productionMode ? '' : 'preprod-';
const API_BASE_URL = `https://${DOMAIN_PREFIX}api.dropy-app.com`;

const AXIOS_PARAMS = {
  baseURL: API_BASE_URL,
  timeout: 5000,
};

let axios = Axios.create(AXIOS_PARAMS);

const getHeaders = () => axios.defaults.headers.common;

const loadCustomUrl = async () => {
  const customUrls = await Storage.getItem('@custom_urls');
  if (customUrls != null) {
    console.log('Using custom urls', customUrls);
    axios.defaults.baseURL = customUrls.api ?? API_BASE_URL;
  }
};

const register = async (displayName, email, password, newsLetter) => {
  const response = await axios.post('/register', {
    displayName,
    email,
    password,
    newsLetter,
  });

  const { accessToken, refreshToken, expires, profile: user } = response.data;

  axios = Axios.create(AXIOS_PARAMS);
  axios.defaults.headers.common.Authorization = accessToken;

  await Storage.setItem('@auth_tokens', { accessToken, refreshToken, expires });

  return user;
};

const login = async (email, password) => {
  const response = await axios.post('/login', {
    email,
    password,
  });

  const { accessToken, refreshToken, expires, profile: user } = response.data;

  axios = Axios.create(AXIOS_PARAMS);
  loadCustomUrl();
  axios.defaults.headers.common.Authorization = accessToken;

  await Storage.setItem('@auth_tokens', { accessToken, refreshToken, expires });

  return user;
};

const refreshTokenUrl = () => `${API_BASE_URL}/refresh`;

const postUserDeviceToken = (deviceToken) => {
  const result = axios.post('/user/updateDeviceToken', {
    deviceToken,
  });
  return result;
};

const userBackgroundGeolocationPingUrl = () => `${API_BASE_URL}/user/backgroundGeolocationPing`;

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
    if (error?.response?.status === 418)
      return false;

    throw error;
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
  const data = new FormData();
  data.append('profile', {
    uri: filePath,
    name: `${filePath}`,
    type: 'image/jpeg',
  });

  const response = await axios.post('/user/profile/picture', data, {
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

const refreshToken = async (token) => {
  const response = await axios.post('/refresh', {
    refreshToken: token,
  });

  const { accessToken, refreshToken, expires } = response.data;

  axios = Axios.create(AXIOS_PARAMS);
  axios.defaults.headers.common.Authorization = accessToken;

  await Storage.setItem('@auth_tokens', { accessToken, refreshToken, expires });

  return response;
};

const getUserProfile = async () => {
  const response = await axios.get('/user/profile');
  return response;
};

const logout = async () => {
  axios = Axios.create(AXIOS_PARAMS);
  loadCustomUrl();
  const removedItem = await Storage.removeItem('@auth_tokens');
  return removedItem;
};

const getNotificationsSettings = async () => {
  const response = await axios.get('/user/notificationsSettings');
  return response;
};

const postNotificationsSettings = async (notificationsSettings) => {
  const response = await axios.post('/user/notificationsSettings', notificationsSettings);
  return response;
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
  refreshToken,
  getUserProfile,
  logout,
  getNotificationsSettings,
  postNotificationsSettings,
  loadCustomUrl,
};

export default API;
