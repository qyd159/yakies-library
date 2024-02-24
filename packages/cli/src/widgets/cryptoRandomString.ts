import * as crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';

export default function (args) {
  console.log('secretKey: ', cryptoRandomString({ length: 32, type: 'base64' }));
  console.log('iv: ', crypto.randomBytes(16).toString('base64'));
}
