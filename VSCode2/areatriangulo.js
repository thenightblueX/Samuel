const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function main() {
  const cateto1 = Number((await perguntar("Digite o primeiro cateto: ")).replace(",", "."));
  const cateto2 = Number((await perguntar("Digite o segundo cateto: ")).replace(",", "."));

  if (isNaN(cateto1) || isNaN(cateto2) || cateto1 <= 0 || cateto2 <= 0) {
    console.log("Valores inválidos. Digite números maiores que zero.");
  } else {
    const area = (cateto1 * cateto2) / 2;
    console.log(`A área do triângulo retângulo é ${area.toFixed(2)}`);
  }

  rl.close();
}

main();