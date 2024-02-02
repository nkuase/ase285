const getHen = () => 
    new Promise((resolve, reject) => {
        setTimeout(() => resolve('Hen'), 100);
    })
const getEgg = (hen) => 
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(`${hen} -> Egg`), 100);
    })
const getCook = (egg) => 
    new Promise ((resolve, reject) => {
        setTimeout (() => resolve(`${egg} -> Cook`), 100);
    })

getHen().then(getEgg).then(getCook).then(console.log);