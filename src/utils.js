


export const rand = (floor, ceil) => {
    if (!ceil) return Math.floor(Math.random() * floor)
    return Math.floor(Math.random() * (ceil - floor)) + floor + 1
}

const tester = (ceil, floor) => {
    let resArr = []

    for (let i=0; i < 1000; i++) {
        resArr.push(rand(ceil, floor))
    }
    return [Math.min(...resArr), Math.max(...resArr)]

}