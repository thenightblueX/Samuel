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

  for (let i = 0; i < 15; i++) {
    const numero = Number((await perguntar(`Digite o número ${i + 1} de 15: `)).replace(",", "."));

    if (isNaN(numero)) {
      console.log("Isso não é um número válido. Tente de novo.");
      i--;
      continue;
    }

    vetor.push(numero);
  }

  console.log(`\nVetor: [${vetor.join(", ")}]`);

  const posicoes = [];
  vetor.forEach((valor, indice) => {
    if (valor % 10 === 0) {
      posicoes.push(indice);
    }
  });

  if (posicoes.length > 0) {
    console.log("\nMúltiplos de 10 encontrados:");
    posicoes.forEach((indice) => {
      console.log(`Valor ${vetor[indice]} na posição ${indice} (índice) ou ${indice + 1}ª posição`);
    });
  } else {
    console.log("\nNenhum múltiplo de 10 foi digitado.");
  }

  rl.close();
}

main();