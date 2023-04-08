const {  publicEncrypt, privateDecrypt } = require('crypto');
const { publicKey, privateKey } = require('./keypair');

console.log(publicKey) //?
const secretMessage = 'ASE 285 students are superb!'
const encryptedData = publicEncrypt(
    publicKey,
    Buffer.from(secretMessage)
  );

console.log(encryptedData.toString('hex'))
const decryptedData = privateDecrypt(
    privateKey,
    encryptedData
);

console.log(decryptedData.toString('utf-8'));