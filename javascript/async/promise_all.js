function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple() {
  await delay(1000);
  return 'Apple'; 
}
async function getBanana() {
  await delay(1000);
  return 'Banana';
}

async function pickFruits() {
  const apple = getApple();
  const banana = getBanana();
  const fruits = await Promise.all([apple, banana]);
  return fruits.join(' + ');
}
pickFruits().then(console.log);