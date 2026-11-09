const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Qual a idade do candidato? ", (respostaIdade) => {
  const idade = Number(respostaIdade);

  if (!Number.isInteger(idade) || idade < 0 || idade > 130) {
    console.log("Idade inválida. Tente de novo.");
    rl.close();
    return;
  }

  rl.question("Está cursando o ensino médio? (SIM/NAO): ", (respostaEnsino) => {
    const cursandoEnsinoMedio = respostaEnsino.trim().toUpperCase() === "SIM";
    const menorDeIdade = idade < 18;

    if (cursandoEnsinoMedio && menorDeIdade) {
      console.log("Aprovado para próxima fase");
    } else {
      console.log("Não atende aos critérios");
    }

    rl.close();
  });
});