import crypto from 'crypto-js';
import Config from 'react-native-config';

export const encryptMessage = (text) => {
  return crypto.AES.encrypt(text, Config.SECRET_ENCRYPTION_KEY).toString();
};

export const decryptMessage = (text) => {
  return crypto.AES.decrypt(text, Config.SECRET_ENCRYPTION_KEY).toString(crypto.enc.Utf8);
};
