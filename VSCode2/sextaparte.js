const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite um número real: ", (resposta) => {
  const numero = Number(resposta.replace(",", "."));

  if (isNaN(numero)) {
    console.log("Isso não é um número válido. Tente de novo.");
  } else {
    const sextaParte = numero / 6;
    console.log(`A sexta parte de ${numero} é ${sextaParte.toFixed(2)}`);
  }

  rl.close();
});