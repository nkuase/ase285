const {  publicEncrypt, privateDecrypt } = require('crypto');

// Encryption
const publicKey = require('./keypair').publicKey;

console.log(publicKey) //?
const secretMessage = 'ASE 285 students are superb!'
const encryptedData = publicEncrypt(
    publicKey,
    Buffer.from(secretMessage)
  );

console.log(encryptedData.toString('hex'))

// Decrytion
const privateKey = require('./keypair').privateKey;
const decryptedData = privateDecrypt(
    privateKey,
    encryptedData
);

console.log(decryptedData.toString('utf-8'));