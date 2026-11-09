const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const DESCONTO = 0.15;

rl.question("Nome do cliente: ", (nome) => {
  rl.question("Valor total da compra (R$): ", (resposta) => {
    const total = Number(resposta.replace(",", "."));

    if (!nome.trim() || isNaN(total) || total < 0) {
      console.log("Dados inválidos. Tente de novo.");
    } else {
      const totalComDesconto = total * (1 - DESCONTO);
      const formatar = (valor) =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      console.log(`\nCliente: ${nome.trim()}`);
      console.log(`Total sem desconto: ${formatar(total)}`);
      console.log(`Total com 15% de desconto: ${formatar(totalComDesconto)}`);
    }

    rl.close();
  });
});