import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(texto: string): Promise<string> {
  return new Promise((resolve) => rl.question(texto, resolve));
}

// PASSO 1: personagem principal do jogo = o Herói (e os inimigos que ele enfrenta)

// PASSO 2: classe Personagem com construtor
class Personagem {
  nome: string;
  vida: number;
  vidaMaxima: number;
  ataque: number;
  defesa: number;
  pocoes: number;

  constructor(
    nome: string,
    vida: number,
    ataque: number,
    defesa: number,
    pocoes: number = 0
  ) {
    this.nome = nome;
    this.vida = vida;
    this.vidaMaxima = vida;
    this.ataque = ataque;
    this.defesa = defesa;
    this.pocoes = pocoes;
  }

  // PASSO 3: funções do personagem transformadas em métodos
  estaVivo(): boolean {
    return this.vida > 0;
  }

  receberDano(dano: number): void {
    this.vida = Math.max(0, this.vida - dano);
  }

  atacar(alvo: Personagem): void {
    const variacao = Math.floor(Math.random() * 5); // 0 a 4 de bônus
    const dano = Math.max(1, this.ataque + variacao - alvo.defesa);
    alvo.receberDano(dano);
    console.log(`⚔️  ${this.nome} atacou ${alvo.nome} e causou ${dano} de dano!`);
  }

  usarPocao(): boolean {
    if (this.pocoes <= 0) {
      console.log(`❌ ${this.nome} não tem mais poções!`);
      return false;
    }
    const cura = 30;
    this.pocoes--;
    this.vida = Math.min(this.vidaMaxima, this.vida + cura);
    console.log(`🧪 ${this.nome} usou uma poção e recuperou até ${cura} de vida! (restam ${this.pocoes})`);
    return true;
  }

  mostrarStatus(): void {
    console.log(`${this.nome} | ❤️  ${this.vida}/${this.vidaMaxima} | 🗡️  ${this.ataque} | 🛡️  ${this.defesa}`);
  }
}

// PASSO 4: objetos literais substituídos por instâncias da classe
const heroi = new Personagem("Herói", 100, 15, 4, 3);

const inimigos: Personagem[] = [
  new Personagem("Goblin", 40, 10, 2),
  new Personagem("Orc", 60, 14, 4),
  new Personagem("Dragão", 90, 20, 6),
];

// PASSO 5: jogo funcionando
async function main(): Promise<void> {
  console.log("=== BATALHA NA MASMORRA ===\n");

  for (const inimigo of inimigos) {
    console.log(`\n👹 Um ${inimigo.nome} apareceu!`);

    while (heroi.estaVivo() && inimigo.estaVivo()) {
      console.log("\n--------------------------");
      heroi.mostrarStatus();
      inimigo.mostrarStatus();
      console.log("--------------------------");

      const escolha = (await perguntar("1) Atacar  2) Usar poção: ")).trim();

      if (escolha === "1") {
        heroi.atacar(inimigo);
      } else if (escolha === "2") {
        if (!heroi.usarPocao()) continue; // sem poção, escolhe de novo
      } else {
        console.log("Opção inválida.");
        continue;
      }

      if (inimigo.estaVivo()) {
        inimigo.atacar(heroi);
      } else {
        console.log(`\n💀 ${inimigo.nome} foi derrotado!`);
      }
    }

    if (!heroi.estaVivo()) {
      console.log("\n☠️  Você foi derrotado... Fim de jogo.");
      rl.close();
      return;
    }
  }

  console.log("\n🏆 Você derrotou todos os inimigos! VITÓRIA!");
  rl.close();
}

main();