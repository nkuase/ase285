async function getSumNum(a, b) {
    const sum = a + b;
    if (sum <= 5) return sum;
    else throw new Error('Oops!.. Number must be less than 5')
}
(async () => {
    try {
        var sum = await getSumNum(2, 1)
        console.log("initial data: " + sum)
        value = sum + 1 
        console.log("received data: " + value)    
    } catch (err) {
        console.log(err.message)
    }
})();

// We must append ';' after the console.log() 
// because the opening parenthesis ( of the function call 
// can be interpreted as a continuation of the previous line.
console.log('After the sum');

(async () => {
    try {
        var sum = await getSumNum(3, 3)
        console.log("initial data: " + sum)
        value = sum + 1 
        console.log("received data: " + value)    
    } catch (err) {
        console.log(err.message)
    }
})();  
console.log("After the sum 2")