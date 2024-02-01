async function getSumNum(a, b) {
    const customPromise = new Promise((resolve, reject) => {
      const sum = a + b;
      if(sum <= 5){ resolve(sum)
      } else { reject(new Error('Oops!.. Number must be less than 5'))
      }
    })
    return customPromise
}

async function f(a, b) {
    try {
        var sum = await getSumNum(a, b)
        console.log("initial data: " + data)
        value = data + 1 
        console.log("received data: " + value)    
    } catch (err) {
        console.log(err.message)
    }
}    
f(1, 3)
console.log("After the sum")
f(3, 3) 
console.log("After the sum 2")