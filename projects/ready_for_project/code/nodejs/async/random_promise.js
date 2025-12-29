const iceCream = new Promise((resolve, reject) => {
  const coldEnough = Math.random() > 0.5; // randomly succeed or fail
  if (coldEnough)
    resolve("Here is your ice cream!");
  else
    reject("The freezer broke!");
});

async function getIceCream() {
  try {
    const value = await iceCream; // waits until resolved
    console.log(value); // prints the resolved string
  } catch (error) {
    console.error(error); // handles rejection (error)
  }
}

getIceCream();