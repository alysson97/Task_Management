// implementar uma função que recebe um array de números e retorne: 
// - a soma dos números pares
// - a média dos números ímpares
// - ignore os inválidos (não números)

// exemplo de entrada: [1, 2, 3,  4, 5, 'a', null]

const exampleInput = [1, 2, 3, 4, 5, 'a', null];
const result = processNumbers(exampleInput);
console.log(result); // { sum: 6, averageOdds: 3 }

function processNumbers(numbers: any[]): { sum: number, averageOdds: number } {
    let sum = 0;
    let oddCount = 0;
    let oddSum = 0;
    let evenSum = 0;
    for (const num of numbers) {
        if (typeof num !== 'number') continue;
            sum += num;
            if (num % 2 !== 0) {
              oddSum += num;
              oddCount++;
            } else
              evenSum += num;
    }
    const averageOdds = oddCount > 0 ? oddSum / oddCount : 0;
    return { sum: evenSum, averageOdds };
}