// ./encrypt_demo.js
const {
  createCipheriv,
  randomBytes,
  createDecipheriv
} = require('crypto');

// The message to encrypt
const message = 'I like ASE 285 students!';

// Generate a random 32-byte key (for AES-256)
const key = randomBytes(32);

// Generate a random 16-byte IV (Initialization Vector)
const iv = randomBytes(16);

// Create the cipher (AES-256 in CBC mode)
const cipher = createCipheriv('aes-256-cbc', key, iv);

// Encrypt the message
let encrypted = cipher.update(message, 'utf8', 'hex');
encrypted += cipher.final('hex');

console.log('Encrypted:', encrypted);
console.log('Key:', key.toString('hex'));
console.log('IV:', iv.toString('hex'));

// Decrypt to check
const decipher = createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted:', decrypted);