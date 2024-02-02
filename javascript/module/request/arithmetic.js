const add = (a, b) => {
    return a + b;
};
const mul = (a, b) => {
    let result = 0;
    for (let i = 0; i < b; i++) {
        result = add(result, a)
    }
    return result
}
  
// This exports a property named mul to the module.exports object. 
module.exports.mul = mul; 
//  exports: { mul: [Function: mul] },

// This syntax directly assigns the value of mul to module.exports.
// module.exports = mul;
//   exports: [Function: mul],
//console.log(module)