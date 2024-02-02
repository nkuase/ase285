const add = (a, b) => {
    return a + b;
};

export const mul = (a, b) => {
    let result = 0;
    for (let i = 0; i < b; i++) {
        result = add(result, a)
    }
    return result
}
