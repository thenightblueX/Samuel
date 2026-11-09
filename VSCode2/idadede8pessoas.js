const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function main() {
  const idades = [];

  for (let i = 0; i < 8; i++) {
    const idade = Number(await perguntar(`Digite a idade da pessoa ${i + 1} de 8: `));

    if (!Number.isInteger(idade) || idade < 0 || idade > 130) {
      console.log("Idade inválida. Tente de novo.");
      i--;
      continue;
    }

    idades.push(idade);
  }

  console.log(`\nIdades: [${idades.join(", ")}]`);

  // a) Média de idade
  const media = idades.reduce((soma, idade) => soma + idade, 0) / idades.length;
  console.log(`\na) Média de idade: ${media.toFixed(2)} anos`);

  // b) Posições com mais de 25 anos
  console.log("\nb) Pessoas com mais de 25 anos:");
  const maioresQue25 = [];
  idades.forEach((idade, indice) => {
    if (idade > 25) {
      maioresQue25.push(indice);
      console.log(`   ${idade} anos na posição ${indice} (índice) ou ${indice + 1}ª posição`);
    }
  });
  if (maioresQue25.length === 0) {
    console.log("   Ninguém com mais de 25 anos.");
  }

  // c) Maior idade
  const maiorIdade = Math.max(...idades);
  console.log(`\nc) Maior idade digitada: ${maiorIdade} anos`);

  // d) Posições da maior idade
  console.log("\nd) Posições da maior idade:");
  idades.forEach((idade, indice) => {
    if (idade === maiorIdade) {
      console.log(`   Posição ${indice} (índice) ou ${indice + 1}ª posição`);
    }
  });

  rl.close();
}

main()