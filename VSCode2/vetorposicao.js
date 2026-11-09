const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const vetor = [10, 25, 3, 47, 18, 62, 5, 33, 91, 8];

rl.question("Digite o número que deseja procurar: ", (resposta) => {
  const numero = Number(resposta.replace(",", "."));

  if (isNaN(numero)) {
    console.log("Isso não é um número válido. Tente de novo.");
    rl.close();
    return;
  }

  console.log(`Vetor: [${vetor.join(", ")}]`);

  const posicao = vetor.indexOf(numero);

  if (posicao !== -1) {
    console.log(`O número ${numero} existe no vetor, na posição ${posicao} (índice) ou ${posicao + 1}ª posição.`);
  } else {
    console.log(`O número ${numero} não existe no vetor.`);
  }

  rl.close();
});