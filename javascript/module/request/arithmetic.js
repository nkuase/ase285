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
  
module.exports = mul; 