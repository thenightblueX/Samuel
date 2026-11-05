const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const OPCOES = { 1: "pedra", 2: "papel", 3: "tesoura" };
const VENCE = { pedra: "tesoura", tesoura: "papel", papel: "pedra" };
const placar = { jogador: 0, computador: 0, empate: 0 };

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function jogarRodada() {
  console.log("\n1 - Pedra\n2 - Papel\n3 - Tesoura");
  let escolha = (await perguntar("Sua jogada: ")).trim();
  while (!OPCOES[escolha]) {
    escolha = (await perguntar("Inválido! Digite 1, 2 ou 3: ")).trim();
  }

  const jogador = OPCOES[escolha];
  const lista = Object.values(OPCOES);
  const computador = lista[Math.floor(Math.random() * lista.length)];
  console.log(`\nVocê: ${jogador} | Computador: ${computador}`);

  if (jogador === computador) {
    console.log("Empate! 🤝");
    placar.empate++;
  } else if (VENCE[jogador] === computador) {
    console.log("Você ganhou! 🎉");
    placar.jogador++;
  } else {
    console.log("O computador ganhou! 🤖");
    placar.computador++;
  }
  console.log(`Placar -> Você: ${placar.jogador} | PC: ${placar.computador} | Empates: ${placar.empate}`);
}

async function main() {
  console.log("=== PEDRA, PAPEL E TESOURA ===");
  let continuar = "s";
  while (continuar === "s") {
    await jogarRodada();
    continuar = (await perguntar("\nJogar de novo? (s/n): ")).trim().toLowerCase();
  }
  console.log("Valeu por jogar! 👋");
  rl.close();
}

main();