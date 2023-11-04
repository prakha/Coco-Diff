export const getNumberParsedString = (number) =>{
    return Number(number) % 1 === 0  ? number : number.toFixed(2)
}