const getHen = async () => 'Hen'
const getEgg = async (hen) => {throw new Error(`Error! ${hen} -> Egg`)}
const getCook = async (egg) => `${egg} -> Cook`    

async function f() {
    try {
        var hen = await getHen()
        var egg = await getEgg(hen)
        var cook = await getCook(egg)
        console.log(cook) 
    } catch (err) {
        console.log(`Something's wrong: ${err.message}`)
    } finally {
        console.log("Done")
    }
}    
f()
