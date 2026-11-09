const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const LATA_LITROS = 0.35;
const GARRAFA_PEQUENA_LITROS = 0.6;
const GARRAFA_GRANDE_LITROS = 2;

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function lerQuantidade(texto) {
  const valor = Number(await perguntar(texto));
  return Number.isInteger(valor) && valor >= 0 ? valor : null;
}

async function main() {
  const latas = await lerQuantidade("Quantas latas de 350 ml? ");
  const garrafasPequenas = await lerQuantidade("Quantas garrafas de 600 ml? ");
  const garrafasGrandes = await lerQuantidade("Quantas garrafas de 2 litros? ");

  if (latas === null || garrafasPequenas === null || garrafasGrandes === null) {
    console.log("Quantidade inválida. Digite números inteiros positivos.");
  } else {
    const totalLitros =
      latas * LATA_LITROS +
      garrafasPequenas * GARRAFA_PEQUENA_LITROS +
      garrafasGrandes * GARRAFA_GRANDE_LITROS;

    console.log(`\nO comerciante comprou ${totalLitros.toFixed(2)} litros de refrigerante.`);
  }

  rl.close();
}

main();