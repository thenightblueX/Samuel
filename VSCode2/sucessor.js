const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite um número inteiro: ", (resposta) => {
  const numero = Number(resposta);

  if (!Number.isInteger(numero)) {
    console.log("Isso não é um número inteiro. Tente de novo.");
  } else {
    console.log(`Número: ${numero}`);
    console.log(`Antecessor: ${numero - 1}`);
    console.log(`Sucessor: ${numero + 1}`);
  }

  rl.close();
});