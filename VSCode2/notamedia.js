const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MEDIA_MINIMA = 7;

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function main() {
  const notas = [];

  for (let i = 1; i <= 3; i++) {
    const resposta = await perguntar(`Digite a nota ${i}: `);
    const nota = Number(resposta.replace(",", "."));

    if (isNaN(nota) || nota < 0 || nota > 10) {
      console.log("Nota inválida. Digite um valor entre 0 e 10.");
      rl.close();
      return;
    }

    notas.push(nota);
  }

  const media = notas.reduce((soma, nota) => soma + nota, 0) / notas.length;

  console.log(`\nMédia: ${media.toFixed(2)}`);
  console.log(media >= MEDIA_MINIMA ? "Situação: Aprovado ✅" : "Situação: Reprovado ❌");

  rl.close();
}

main();