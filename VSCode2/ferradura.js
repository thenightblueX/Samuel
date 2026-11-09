const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const FERRADURAS_POR_CAVALO = 4;

rl.question("Quantos cavalos foram comprados? ", (resposta) => {
  const cavalos = Number(resposta);

  if (!Number.isInteger(cavalos) || cavalos < 0) {
    console.log("Quantidade inválida. Digite um número inteiro positivo.");
  } else {
    const ferraduras = cavalos * FERRADURAS_POR_CAVALO;
    console.log(`Para equipar ${cavalos} cavalo(s), são necessárias ${ferraduras} ferradura(s).`);
  }

  rl.close();
});