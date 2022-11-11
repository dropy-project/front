import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));

const getItem = async (key) => JSON.parse(await AsyncStorage.getItem(key));

const removeItem = (key) => AsyncStorage.removeItem(key);

const Storage = {
  setItem,
  getItem,
  removeItem,
};

export default Storage;
