// Async/Await Demo (No Top-Level `await` Warning)

// sleep util: returns a Promise that resolves after `ms` ms
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo of sequential vs parallel waits
async function demo() {
  console.log('--- Sequential ---');
  console.time('seq');
  await sleep(1000);
  await sleep(1000);
  console.timeEnd('seq'); // ~2000ms

  console.log('--- Parallel ---');
  console.time('par');

  // Start both timers at once, then await both
  const a = sleep(1000);
  const b = sleep(1000);
  await a;
  await b;
  // The same idea with Promise.all: await Promise.all([a, b]);

  console.timeEnd('par'); // ~1000ms
}

// Wrap everything in an async IIFE to avoid top-level `await`
(async function main() {
  // 1) Run the timing demo
  await demo();

  // 2) Example with Promises
  const iceCream = new Promise((resolve) => {
    setTimeout(() => resolve('🍨 Here is your ice cream!'), 1000);
  });
  console.log(await iceCream); // one print

  const iceCream2 = new Promise((resolve) => {
    setTimeout(() => resolve('🍨 Here is your ice cream! (again)'), 1000);
  });
  console.log(await iceCream2); // second print
})().catch((err) => {
  console.error('Unhandled error:', err);
});