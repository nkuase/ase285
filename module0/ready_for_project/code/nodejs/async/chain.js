function makeDough() {
  return new Promise((resolve) => {
    console.log("Mixing flour, sugar, and butter...");
    setTimeout(() => resolve("dough"), 1000);
  });
}

function bakeCookies(dough) {
  return new Promise((resolve) => {
    console.log(`Baking cookies with ${dough}...`);
    setTimeout(() => resolve("cookies"), 1000);
  });
}

function eatCookies(cookies) {
  return new Promise((resolve) => {
    console.log(`Eating ${cookies}!`);
    setTimeout(() => resolve("Yum!"), 500);
  });
}

function cry(error) {
  console.error("Oh no!", error);
}

// chain the promises like Lego blocks
makeDough()
  .then(bakeCookies)
  .then(eatCookies)
  .then((result) => console.log("✅ Finished:", result))
  .catch(cry);
