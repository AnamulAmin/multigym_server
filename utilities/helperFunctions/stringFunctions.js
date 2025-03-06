// string function to repeat character
// Usage: repeatStringCharacter('a', 5) => 'aaaaa'
export const repeatStringCharacter = (char, times) => {
    let str = '';
    for (let i = 0; i < times; i++) {
        str += char;
    }
    return str;
}