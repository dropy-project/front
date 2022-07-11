import crypto from 'crypto-js';
import { SECRET_KEY } from '@env';

export const encryptMessage = (text) => {
  return crypto.AES.encrypt(JSON.stringify({ text }), SECRET_KEY).toString();
};

export const decryptMessage = (text) => {
  const info2 = crypto.AES.decrypt(text, SECRET_KEY).toString(crypto.enc.Utf8);
  return JSON.parse(info2).text;
};
