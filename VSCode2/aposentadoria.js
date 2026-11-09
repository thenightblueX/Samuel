const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a idade da pessoa: ", (resposta) => {
  const idade = Number(resposta);

  if (!Number.isInteger(idade) || idade < 0 || idade > 130) {
    console.log("Idade inválida. Tente de novo.");
  } else if (idade >= 60) {
    console.log("Aposentado");
  } else {
    console.log("Trabalho Formal");
  }

  rl.close();
});