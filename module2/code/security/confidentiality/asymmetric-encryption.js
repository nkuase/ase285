const { publicEncrypt, privateDecrypt } = require('crypto');
const { privateKey, publicKey } = require('./keypair');

console.log(publicKey) 
console.log(privateKey)

const secretMessage = 'ASE 285 students are superb!'
const encryptedData = publicEncrypt(
    publicKey,
    Buffer.from(secretMessage)
  );

console.log("Encrypted data: ")
console.log(encryptedData.toString('hex'))
const decryptedData = privateDecrypt(
    privateKey,
    encryptedData
);
console.log("Decrypted data: ")
console.log(decryptedData.toString('utf-8'));
