export default function Num(n) {
    return String(n).split("").reverse().map((char, i) => {
        return i !== 0 && i % 3 === 0 ? char + "," : char;
    }).reverse().join("");
}