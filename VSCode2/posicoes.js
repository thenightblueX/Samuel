const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function main() {
  const vetor = [];

  for (let i = 0; i < 10; i++) {
    const numero = Number(await perguntar(`Digite o número inteiro ${i + 1} de 10: `));

    if (!Number.isInteger(numero)) {
      console.log("Isso não é um número inteiro. Tente de novo.");
      i--;
      continue;
    }

    vetor.push(numero);
  }

  console.log(`\nVetor: [${vetor.join(", ")}]`);

  const pares = [];
  vetor.forEach((valor, indice) => {
    if (valor % 2 === 0) {
      pares.push({ valor, indice });
    }
  });

  if (pares.length > 0) {
    console.log("\nNúmeros pares encontrados:");
    pares.forEach(({ valor, indice }) => {
      console.log(`Valor ${valor} na posição ${indice} (índice) ou ${indice + 1}ª posição`);
    });
  } else {
    console.log("\nNenhum número par foi digitado.");
  }

  rl.close();
}

main();