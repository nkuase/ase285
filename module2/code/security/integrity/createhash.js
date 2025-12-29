const {creatHash, createHash} = require('crypto')
function hash(input) {
    return createHash('sha256').update(input).digest('hex'); // never use md5
}

let password = 'hello';
const hash1 = hash(password);
console.log(hash1)

const hash2 = hash(password);
console.log(hash2)

const hash3 = hash(password + "2")
console.log(hash3)

console.log(hash1 == hash2)
console.log(hash2 == hash3) // small change in the password, big change in the hashed results