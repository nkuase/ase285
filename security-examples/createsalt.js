const { scryptSync, randomBytes } = require('crypto');

function signup(email, password) {
    const salt = randomBytes(16).toString('hex'); // randomly generate the salt string
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');
    // console.log(hashedPassword) 
    const user = { email: `${email}`, password: `${salt}:${hashedPassword}` } // we need to store the salt also
    console.log(user)
    users.push(user); // users is a [] and JavaScript hoisting makes it available here 

    return user
}

function login(email, password) {
    const user = users.find(v => v.email === email);
    const [salt, pw] = user.password.split(':');
    // Make the hashedBuffer (not a hex string) because we need a buffer to use timingSafeEqual
    const hashedBuffer = scryptSync(password, salt, 64).toString('hex')// use the salt to make hash from the given password
    return hashedBuffer === pw; 
}

const users = [];
const user = signup('foo@bar.com', 'pa$$word');

console.log(user)
const result = login('foo@bar.com', 'password')
console.log(result)

console.log(login('foo@bar.com', 'pa$$word'))
console.log(users) 