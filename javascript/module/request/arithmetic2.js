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
// This syntax directly assigns the value of mul to module.exports.
module.exports = mul;
//   exports: [Function: mul],
// console.log(module)