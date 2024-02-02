function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getHen = async () => {
    await delay(100)
    return 'Hen'
}
const getEgg = async (hen) => {
    await delay(100)
    return `${hen} -> Egg`
}
const getCook = async (egg) => {
    delay(100)
    return `${egg} -> Cook`
}

async function f() {
    try {
        var hen = await getHen()
        var egg = await getEgg(hen)
        var cook = await getCook(egg)
        console.log(cook)
    } catch (err) {
        console.log(err.message)
    } finally {
        console.log("Done")
    }
}    
f()
