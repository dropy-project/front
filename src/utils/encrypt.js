import crypto from 'crypto-js';
import Config from 'react-native-config';

export const encryptMessage = (text) => {
  if (text == null)
    return null;
  return crypto.AES.encrypt(text, Config.SECRET_ENCRYPTION_KEY).toString();
};

export const decryptMessage = (text) => {
  if (text == null)
    return null;
  return crypto.AES.decrypt(text, Config.SECRET_ENCRYPTION_KEY).toString(crypto.enc.Utf8);
};
