const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 1) Contar de 1 a 300
function contar() {
  for (let i = 1; i <= 300; i++) {
    console.log(i);
  }
}

// 2) Ímpares até 300
function impares() {
  for (let i = 1; i <= 300; i += 2) {
    console.log(i);
  }
}

// 3) Pares até 300
function pares() {
  for (let i = 2; i <= 300; i += 2) {
    console.log(i);
  }
}

// 4) Caixa registradora
function caixa(voltar) {
  let total = 0;

  function perguntar() {
    rl.question("Nome do produto (ou 'fim' pra fechar): ", (nome) => {
      if (nome.toLowerCase() === "fim") {
        console.log("-------------------");
        console.log(`TOTAL: R$ ${total.toFixed(2)}`);
        voltar();
        return;
      }

      rl.question("Preço: R$ ", (preco) => {
        const valor = parseFloat(preco.replace(",", "."));

        if (isNaN(valor)) {
          console.log("Preço inválido, tenta de novo!");
        } else {
          total += valor;
          console.log(`Adicionado: ${nome} (R$ ${valor.toFixed(2)})`);
        }

        perguntar();
      });
    });
  }

  perguntar();
}

// 5) Tabuada à escolha
function tabuada(voltar) {
  rl.question("Qual tabuada você quer? ", (resposta) => {
    const numero = parseInt(resposta);

    if (isNaN(numero)) {
      console.log("Isso não é um número, tenta de novo!");
    } else {
      console.log(`\nTabuada do ${numero}`);
      console.log("---------------");
      for (let i = 1; i <= 10; i++) {
        console.log(`${numero} x ${i} = ${numero * i}`);
      }
    }

    voltar();
  });
}

// MENU
function menu() {
  console.log("\n========== MENU ==========");
  console.log("1 - Contar de 1 a 300");
  console.log("2 - Números ímpares até 300");
  console.log("3 - Números pares até 300");
  console.log("4 - Caixa registradora");
  console.log("5 - Tabuada");
  console.log("0 - Sair");
  console.log("==========================");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao.trim()) {
      case "1":
        contar();
        menu();
        break;
      case "2":
        impares();
        menu();
        break;
      case "3":
        pares();
        menu();
        break;
      case "4":
        caixa(menu);
        break;
      case "5":
        tabuada(menu);
        break;
      case "0":
        console.log("Até mais!");
        rl.close();
        break;
      default:
        console.log("Opção inválida, escolhe de 0 a 5!");
        menu();
    }
  });
}

menu();