const produtos = [
  { nome: "Arroz", preco: 12.5 },
  { nome: "Feijão", preco: 8.9 },
  { nome: "Biscoito", preco: 3.75 },
];

let total = 0;

for (let i = 0; i < produtos.length; i++) {
  console.log(`${produtos[i].nome}: R$ ${produtos[i].preco.toFixed(2)}`);
  total += produtos[i].preco;
}

console.log("-------------------");
console.log(`TOTAL: R$ ${total.toFixed(2)}`);