function getSumNum(a, b) {
    const customPromise = new Promise((resolve, reject) => {
      const sum = a + b;
      if(sum <= 5){ resolve(sum)
      } else { reject(new Error('Oops!.. Number must be less than 5'))
      }
    })
    return customPromise
}

var sum = getSumNum(1, 3)
sum.then(data => {
  console.log("initial data: " + data)
  value = data + 1 
  console.log("received data: " + value)
})
.catch(err => {
  console.log(err)
})
console.log("After the sum")
var sum = getSumNum(3, 3)
sum.then(data => {
  console.log("initial data: " + data)
  value = data + 1 
  console.log("received data: " + value)
})
.catch(err => {
  console.log(err.message)
})
console.log("After the sum 2")