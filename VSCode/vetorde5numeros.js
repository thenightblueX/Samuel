const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const vetor = [];

function lerNumero(posicao) {
  if (posicao === 5) {
    console.log("\nValores digitados:");
    for (let i = 0; i < vetor.length; i++) {
      console.log(`Posição ${i}: ${vetor[i]}`);
    }
    rl.close();
    return;
  }

  rl.question(`Digite o ${posicao + 1}º número inteiro: `, (resposta) => {
    const numero = parseInt(resposta);

    if (isNaN(numero)) {
      console.log("Isso não é um número inteiro, tenta de novo!");
      lerNumero(posicao); // repete a mesma posição
      return;
    }

    vetor[posicao] = numero;
    lerNumero(posicao + 1);
  });
}

lerNumero(0);