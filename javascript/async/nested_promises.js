const getHen = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('Hen'), 100);
    });
};
const getEgg = (hen) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`${hen} -> Egg`), 100);
    });
};
const getCook = (egg) => {
    return new Promise ((resolve, reject) => {
        setTimeout (() => resolve(`${egg} -> Cook`), 100);
    })
};    
getHen()
.then(hen => getEgg(hen))
.then(egg => getCook(egg))
.then(meal => console.log(meal));