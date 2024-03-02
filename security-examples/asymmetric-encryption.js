const {  publicEncrypt, privateDecrypt } = require('crypto');

// Encryption
const publicKey = require('./keypair').publicKey;

console.log(publicKey) //?
const secretMessage = 'ASE 285 students are superb!'
const encryptedData = publicEncrypt(
    publicKey,
    Buffer.from(secretMessage)
  );



// Decrytion
const privateKey = require('./keypair').privateKey;
console.log(privateKey) //?
console.log(encryptedData)
const decryptedData = privateDecrypt(
    privateKey,
    encryptedData
);

console.log(decryptedData.toString('utf-8'));