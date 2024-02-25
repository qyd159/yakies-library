import * as crypto from 'crypto';
// import cryptoRandomString from 'crypto-random-string';

export default function (args) {
  console.log('secretKey: ', crypto.randomBytes(32).toString('base64'));
  console.log('iv: ', crypto.randomBytes(16).toString('base64'));
}
