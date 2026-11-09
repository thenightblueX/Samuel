const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const VALOR_HORA = 51.9;

rl.question("Quantas horas você trabalhou? ", (resposta) => {
  const horas = Number(resposta.replace(",", "."));

  if (isNaN(horas) || horas < 0) {
    console.log("Número de horas inválido. Tente de novo.");
  } else {
    const salario = horas * VALOR_HORA;
    console.log(
      `Salário: ${salario.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`
    );
  }

  rl.close();
});