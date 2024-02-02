const add = (a, b) => {
    return a + b;
};
const sub = (a, b) => {
    return a - b;
};
  
module.exports.add = add
module.exports.sub = sub

// This is the same as above
//module.exports = {add, sub}
//console.log(module)