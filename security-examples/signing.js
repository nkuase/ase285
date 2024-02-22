const { createSign, createVerify, generateKeyPairSync } = require('crypto');
const { privateKey, publicKey } = require('./keypair');

const data = 'I need to sign this document.';

/// SIGN

const signer = createSign('rsa-sha256');

signer.update(data);

const siguature = signer.sign(privateKey, 'hex');
console.log(siguature);

/// VERIFY
let verifier = createVerify('rsa-sha256');
const compromised = data + '???'
verifier.update(compromised);
const isVerified1 = verifier.verify(publicKey, siguature, 'hex');
console.log(isVerified1);

verifier = createVerify('rsa-sha256');
const non_compromised = data
verifier.update(non_compromised);
const isVerified2 = verifier.verify(publicKey, siguature, 'hex');
console.log(isVerified2);