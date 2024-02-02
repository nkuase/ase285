async function getSumNum(a, b) {
    const sum = a + b;
    if (sum <= 5) return sum;
    else throw new Error('Oops!.. Number must be less than 5')
}

async function f(a, b) {
    try {
        var sum = await getSumNum(a, b)
        console.log("initial data: " + sum)
        value = sum + 1 
        console.log("received data: " + value)    
    } catch (err) {
        console.log(err.message)
    }
}    
f(1, 3)
console.log("After the sum")
f(3, 3) 
console.log("After the sum 2")