const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

/// Cipher

const message = 'I like ASE 285 students!';
const key = randomBytes(32); // these key/iv should be shared. 
const iv = randomBytes(16);

const infoToShare = {key:key.toString('hex'), iv:iv.toString('hex')}

const cipher = createCipheriv('aes256', key, iv);
console.log(cipher) 

/// Encrypt
const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
console.log(`Encrypted: ${encryptedMessage}`);

/// Decrypt
const key2 = Buffer.from(infoToShare.key, 'hex')
const iv2 = Buffer.from(infoToShare.iv, 'hex')
const decipher = createDecipheriv('aes256', key2, iv2);
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');
console.log(`Deciphered: ${decryptedMessage.toString('utf-8')}`);