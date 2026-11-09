const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const DESCONTO = 0.2;
const VALOR_MINIMO = 500;

const formatar = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

rl.question("Valor total da compra (R$): ", (resposta) => {
  const total = Number(resposta.replace(",", "."));

  if (isNaN(total) || total < 0) {
    console.log("Valor inválido. Tente de novo.");
    rl.close();
    return;
  }

  rl.question("O cliente tem cartão fidelidade? (SIM/NAO): ", (cartao) => {
    const temCartao = cartao.trim().toUpperCase() === "SIM";

    if (temCartao || total > VALOR_MINIMO) {
      const totalComDesconto = total * (1 - DESCONTO);
      console.log(`\nDesconto de 20% aplicado!`);
      console.log(`Total sem desconto: ${formatar(total)}`);
      console.log(`Total com desconto: ${formatar(totalComDesconto)}`);
    } else {
      console.log(`\nSem desconto.`);
      console.log(`Total: ${formatar(total)}`);
    }

    rl.close();
  });
});