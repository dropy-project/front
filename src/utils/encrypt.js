import crypto from 'crypto-js';
import Config from 'react-native-config';

export const encryptMessage = (text) => {
  console.log(Config.SECRET_KEY);
  return crypto.AES.encrypt(text, Config.SECRET_KEY).toString();
};

export const decryptMessage = (text) => {
  return crypto.AES.decrypt(text, Config.SECRET_KEY ).toString(crypto.enc.Utf8);
};
