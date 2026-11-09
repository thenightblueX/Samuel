const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Em que ano você nasceu? ", (resposta) => {
  const anoNascimento = parseInt(resposta);
  const anoAtual = new Date().getFullYear();

  if (isNaN(anoNascimento) || anoNascimento > anoAtual || anoNascimento < 1900) {
    console.log("Ano inválido. Tente de novo.");
  } else {
    const idade = anoAtual - anoNascimento;
    console.log(`Você tem aproximadamente ${idade} anos.`);
  }

  rl.close();
});