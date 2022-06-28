import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value));
};

const getItem = async (key) => {
  return JSON.parse(await AsyncStorage.getItem(key));
};

const removeItem = (key) => {
  return AsyncStorage.removeItem(key);
};

const Storage = {
  setItem,
  getItem,
  removeItem,
};

export default Storage;
