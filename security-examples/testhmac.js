// HMAC (Keyed-hash Message Authentication Code) is a keyed hash of data - like a hash with a password. 
// To create a HMAC you need to have the key, therefore allowing you to verify both the authenticity and originator of the data. 
// Using a different key produces a different output.
// Think of HMAC as a hash with a password or key
// Only someone with the key can create an authentic hash

const { createHmac } = require('crypto');

const password1 = 'hello!';
const password2= 'hello! again';
const message = 'hello wrold'

// We need to generate the same hash only when we know the password
// Server can be sure the hmac hash is correct only when the sender has the correct password 
const hmac1 = createHmac('sha256', password1).update(message).digest('hex');
const hmac2 = createHmac('sha256', password2).update(message).digest('hex');

console.log(hmac1)
console.log(hmac2)