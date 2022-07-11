import CryptoJS from 'crypto-js';

export function encryptMessage(text) {
  return CryptoJS.AES.encrypt(text, 'secret key 123').toString();
}

export function decryptMessage(text) {
  return CryptoJS.AES.decrypt(text, 'secret key 123').toString(CryptoJS.enc.Utf8);
}
