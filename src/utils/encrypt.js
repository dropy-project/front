import crypto from 'crypto-js';

export const encryptMessage = (text) => {
  return crypto.AES.encrypt(text, 'bite').toString();
};

export const decryptMessage = (text) => {
  return crypto.AES.decrypt(text, 'bite').toString(crypto.enc.Utf8);
};
