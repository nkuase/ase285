const add = (a, b) => {
    return a + b;
};
const sub = (a, b) => {
    return a - b;
};

// Don't do this  
module.exports = {}
exports = {add, sub}