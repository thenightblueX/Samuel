const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Qual tabuada você quer? ", (resposta) => {
  const numero = parseInt(resposta);

  if (isNaN(numero)) {
    console.log("Isso não é um número, tenta de novo!");
  } else {
    console.log(`\nTabuada do ${numero}`);
    console.log("---------------");
    for (let i = 1; i <= 10; i++) {
      console.log(`${numero} x ${i} = ${numero * i}`);
    }
  }

  rl.close();
});