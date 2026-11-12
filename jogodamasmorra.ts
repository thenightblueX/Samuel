import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = (texto: string): Promise<string> =>
  new Promise((resolve) => rl.question(texto, resolve));

// ---------- utilitários ----------
const aleatorio = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const sortear = <T>(lista: T[]): T => lista[aleatorio(0, lista.length - 1)];
const embaralhar = <T>(lista: T[]): T[] => [...lista].sort(() => Math.random() - 0.5);
const linha = (): void => console.log("--------------------------------------");
const barra = (atual: number, max: number, tam = 10): string => {
  const cheio = Math.round((atual / max) * tam);
  return "█".repeat(cheio) + "░".repeat(tam - cheio);
};

// ---------- personagens ----------
class Personagem {
  vida: number;
  vidaMaxima: number;
  atordoado = 0;

  constructor(public nome: string, vida: number, public ataque: number, public defesa: number) {
    this.vida = vida;
    this.vidaMaxima = vida;
  }

  estaVivo(): boolean {
    return this.vida > 0;
  }
  ataqueTotal(): number {
    return this.ataque;
  }
  defesaTotal(): number {
    return this.defesa;
  }
  receberDano(dano: number): void {
    this.vida = Math.max(0, this.vida - dano);
  }
  curar(qtd: number): number {
    const antes = this.vida;
    this.vida = Math.min(this.vidaMaxima, this.vida + qtd);
    return this.vida - antes;
  }
  atacar(alvo: Personagem): void {
    let dano = Math.max(1, this.ataqueTotal() + aleatorio(0, 4) - alvo.defesaTotal());
    const critico = Math.random() < 0.1; // 10% de chance de crítico
    if (critico) dano *= 2;
    alvo.receberDano(dano);
    console.log(`${critico ? "🎯 CRÍTICO! " : "⚔️ "}${this.nome} atacou ${alvo.nome} e causou ${dano} de dano!`);
  }
}

interface Habilidade {
  nome: string;
  custo: number;
  descricao: string;
  usar: (h: Heroi, alvo: Inimigo) => void;
}

interface ClasseInfo {
  nome: string;
  emoji: string;
  descricao: string;
  vida: number;
  mana: number;
  ataque: number;
  defesa: number;
  habilidades: Habilidade[];
}

class Heroi extends Personagem {
  mana: number;
  manaMaxima: number;
  nivel = 1;
  xp = 0;
  xpProximo = 30;
  ouro = 25;
  bonusAtaque = 0;
  defendendo = false;
  inventario: Record<string, number> = { "Poção de Vida": 2, "Poção de Mana": 1 };

  constructor(nome: string, public classe: ClasseInfo) {
    super(nome, classe.vida, classe.ataque, classe.defesa);
    this.mana = classe.mana;
    this.manaMaxima = classe.mana;
  }

  ataqueTotal(): number {
    return this.ataque + this.bonusAtaque;
  }
  defesaTotal(): number {
    return this.defesa + (this.defendendo ? 4 : 0);
  }
  recuperarMana(qtd: number): number {
    const antes = this.mana;
    this.mana = Math.min(this.manaMaxima, this.mana + qtd);
    return this.mana - antes;
  }
  ganharXp(qtd: number): void {
    this.xp += qtd;
    while (this.xp >= this.xpProximo) {
      this.xp -= this.xpProximo;
      this.nivel++;
      this.xpProximo = Math.floor(this.xpProximo * 1.5);
      this.vidaMaxima += 12;
      this.manaMaxima += 5;
      this.ataque += 2;
      if (this.nivel % 2 === 0) this.defesa += 1;
      this.curar(25);
      this.mana = this.manaMaxima;
      console.log(`🎉 LEVEL UP! ${this.nome} chegou ao nível ${this.nivel}! (+12 vida, +5 mana, +2 ataque)`);
    }
  }
  mostrarStatus(): void {
    console.log(`${this.classe.emoji} ${this.nome} (Nv ${this.nivel}) ❤️ ${barra(this.vida, this.vidaMaxima)} ${this.vida}/${this.vidaMaxima}`);
    console.log(`   🔷 ${this.mana}/${this.manaMaxima} | 🗡️ ${this.ataqueTotal()} 🛡️ ${this.defesaTotal()} | 💰 ${this.ouro} | XP ${this.xp}/${this.xpProximo}`);
  }
}

interface ModeloInimigo {
  nome: string;
  emoji: string;
  vida: number;
  ataque: number;
  defesa: number;
  xp: number;
  ouro: number;
  fala: string;
  chanceEspecial: number;
  especial: (self: Inimigo, h: Heroi) => void;
}

class Inimigo extends Personagem {
  constructor(public modelo: ModeloInimigo, vida: number, ataque: number, defesa: number) {
    super(modelo.nome, vida, ataque, defesa);
  }
  agir(h: Heroi): void {
    if (this.atordoado > 0) {
      this.atordoado--;
      console.log(`😵 ${this.nome} está atordoado e perdeu o turno!`);
      return;
    }
    if (Math.random() < this.modelo.chanceEspecial) this.modelo.especial(this, h);
    else this.atacar(h);
  }
}

// ---------- classes de herói ----------
const dano = (h: Heroi, alvo: Inimigo, mult: number, ignoraDefesa = false): number => {
  const def = ignoraDefesa ? 0 : alvo.defesaTotal();
  const d = Math.max(1, Math.floor(h.ataqueTotal() * mult) + aleatorio(0, 4) - def);
  alvo.receberDano(d);
  return d;
};

const CLASSES: ClasseInfo[] = [
  {
    nome: "Guerreiro", emoji: "🛡️", descricao: "Muita vida e defesa, bate forte",
    vida: 120, mana: 20, ataque: 15, defesa: 5,
    habilidades: [
      { nome: "Golpe Poderoso", custo: 8, descricao: "Dano 1.8x do ataque",
        usar: (h, a) => console.log(`💥 ${h.nome} deu um Golpe Poderoso e causou ${dano(h, a, 1.8)} de dano!`) },
      { nome: "Grito de Guerra", custo: 10, descricao: "+4 de ataque até o fim da luta",
        usar: (h) => { h.bonusAtaque += 4; console.log(`📣 ${h.nome} gritou tão alto que o ataque subiu +4!`); } },
    ],
  },
  {
    nome: "Mago", emoji: "🧙", descricao: "Frágil, mas com muita mana e magias",
    vida: 80, mana: 60, ataque: 11, defesa: 2,
    habilidades: [
      { nome: "Bola de Fogo", custo: 10, descricao: "Dano 1.6x que ignora defesa",
        usar: (h, a) => console.log(`🔥 Bola de Fogo! ${a.nome} tomou ${dano(h, a, 1.6, true)} de dano!`) },
      { nome: "Cura Mágica", custo: 12, descricao: "Recupera 35 de vida",
        usar: (h) => console.log(`✨ ${h.nome} se curou e recuperou ${h.curar(35)} de vida!`) },
    ],
  },
  {
    nome: "Arqueiro", emoji: "🏹", descricao: "Equilibrado, ataques rápidos e atordoantes",
    vida: 95, mana: 35, ataque: 14, defesa: 3,
    habilidades: [
      { nome: "Tiro Duplo", custo: 8, descricao: "Dois disparos de 0.8x",
        usar: (h, a) => {
          const d1 = dano(h, a, 0.8);
          const d2 = dano(h, a, 0.8);
          console.log(`🏹 Tiro Duplo! ${d1} + ${d2} de dano em ${a.nome}!`);
        } },
      { nome: "Flecha Atordoante", custo: 10, descricao: "Dano normal e inimigo perde 1 turno",
        usar: (h, a) => {
          const d = dano(h, a, 1);
          a.atordoado = 1;
          console.log(`💫 ${a.nome} tomou ${d} de dano e ficou tonto!`);
        } },
    ],
  },
];

// ---------- itens e loja ----------
interface Item {
  preco: number;
  descricao: string;
  usar: (h: Heroi, alvo: Inimigo) => void;
}

const ITENS: Record<string, Item> = {
  "Poção de Vida": { preco: 15, descricao: "Cura 40 de vida",
    usar: (h) => console.log(`🧪 ${h.nome} bebeu a poção e recuperou ${h.curar(40)} de vida!`) },
  "Poção de Mana": { preco: 12, descricao: "Restaura 25 de mana",
    usar: (h) => console.log(`🔷 ${h.nome} recuperou ${h.recuperarMana(25)} de mana!`) },
  "Queijo Coalho Mágico": { preco: 10, descricao: "Cura 15 de vida e 10 de mana",
    usar: (h) => console.log(`🧀 Delícia! +${h.curar(15)} de vida e +${h.recuperarMana(10)} de mana!`) },
  "Bomba de Confete": { preco: 22, descricao: "25 de dano e atordoa o inimigo",
    usar: (h, a) => {
      a.receberDano(25);
      a.atordoado = 1;
      console.log(`🎊 BOOM de confete! ${a.nome} tomou 25 de dano e ficou deslumbrado!`);
    } },
};

interface Produto {
  nome: string;
  preco: number;
  desc: string;
  aplicar: (h: Heroi) => void;
}

const PRODUTOS: Produto[] = [
  ...Object.entries(ITENS).map(([nome, it]) => ({
    nome, preco: it.preco, desc: it.descricao,
    aplicar: (h: Heroi) => { h.inventario[nome] = (h.inventario[nome] || 0) + 1; },
  })),
  { nome: "Afiar a arma", preco: 35, desc: "+2 de ataque (permanente)", aplicar: (h) => { h.ataque += 2; } },
  { nome: "Armadura de tampa de panela", preco: 35, desc: "+1 de defesa (permanente)", aplicar: (h) => { h.defesa += 1; } },
  { nome: "Cantil de vida", preco: 30, desc: "+15 de vida máxima (permanente)", aplicar: (h) => { h.vidaMaxima += 15; h.vida += 15; } },
];

async function loja(h: Heroi): Promise<void> {
  console.log("\n🏪 Você achou a Lojinha do Seu Zé Sem Troco!");
  while (true) {
    linha();
    console.log(`💰 Seu ouro: ${h.ouro}`);
    PRODUTOS.forEach((p, i) => console.log(`${i + 1}) ${p.nome} - ${p.preco}💰 (${p.desc})`));
    console.log("0) Sair da loja");
    const n = parseInt((await perguntar("Comprar: ")).trim(), 10);
    if (n === 0) return;
    if (isNaN(n) || n < 1 || n > PRODUTOS.length) {
      console.log("Opção inválida.");
      continue;
    }
    const p = PRODUTOS[n - 1];
    if (h.ouro < p.preco) {
      console.log("💸 Seu Zé: 'Sem dinheiro, sem troco, sem produto!'");
      continue;
    }
    h.ouro -= p.preco;
    p.aplicar(h);
    console.log(`✅ Você comprou: ${p.nome}!`);
  }
}

// ---------- inimigos malucos ----------
const golpe = (h: Heroi, d: number, texto: string): void => {
  h.receberDano(d);
  console.log(`${texto} (${d} de dano)`);
};

const COMUNS: ModeloInimigo[] = [
  { nome: "Galinha Gigante Furiosa", emoji: "🐔", vida: 30, ataque: 11, defesa: 1, xp: 14, ouro: 10,
    fala: "CÓÓÓ-CÓ-CÓÓÓ!", chanceEspecial: 0.3,
    especial: (s, h) => {
      for (let i = 0; i < 3; i++)
        golpe(h, Math.max(1, Math.floor(s.ataque / 2) + aleatorio(0, 2) - h.defesaTotal()), "🐔 Bicada!");
    } },
  { nome: "Goblin Contador", emoji: "🧾", vida: 35, ataque: 12, defesa: 2, xp: 16, ouro: 14,
    fala: "Você está com o CPF regular?", chanceEspecial: 0.3,
    especial: (_s, h) => {
      const roubo = Math.min(h.ouro, aleatorio(5, 12));
      h.ouro -= roubo;
      console.log(`🧾 Goblin Contador cobrou imposto e levou ${roubo} de ouro!`);
    } },
  { nome: "Cuscuz Zumbi", emoji: "🧟", vida: 45, ataque: 13, defesa: 3, xp: 18, ouro: 12,
    fala: "Cuuuuscuuuuz...", chanceEspecial: 0.25,
    especial: (s, h) => {
      h.atordoado = 1;
      console.log(`🧟 ${s.nome} grudou em você! Você vai perder o próximo turno!`);
    } },
  { nome: "Caranguejo Capoeirista", emoji: "🦀", vida: 40, ataque: 15, defesa: 3, xp: 20, ouro: 16,
    fala: "Ginga, ginga, ginga!", chanceEspecial: 0.25,
    especial: (s, h) => {
      s.atacar(h);
      h.atordoado = 1;
      console.log("🦀 Rasteira de capoeira! Você caiu e perde o próximo turno!");
    } },
  { nome: "Pombo Ninja", emoji: "🐦", vida: 50, ataque: 16, defesa: 4, xp: 26, ouro: 20,
    fala: "...(some e aparece atrás de você)", chanceEspecial: 0.3,
    especial: (s, h) => golpe(h, s.ataque + aleatorio(0, 4), "💩 Cocô Ácido! Ignora armadura!") },
  { nome: "Vendedor de Seguro Imortal", emoji: "📋", vida: 55, ataque: 15, defesa: 5, xp: 28, ouro: 22,
    fala: "Só 5 minutinhos do seu tempo!", chanceEspecial: 0.35,
    especial: (_s, h) => {
      const perdida = Math.min(h.mana, 10);
      h.mana -= perdida;
      console.log(`📋 Papo Chato! Você ficou tão entediado que perdeu ${perdida} de mana!`);
    } },
];

const ELITES: ModeloInimigo[] = [
  { nome: "Ogro do Trânsito", emoji: "🚦", vida: 90, ataque: 20, defesa: 5, xp: 45, ouro: 45,
    fala: "Fechou o cruzamento, é meu!", chanceEspecial: 0.3,
    especial: (s, h) => { s.atacar(h); if (h.estaVivo()) s.atacar(h); } },
  { nome: "Mago do Wi-Fi Lento", emoji: "📶", vida: 80, ataque: 22, defesa: 4, xp: 50, ouro: 50,
    fala: "Carregando... 99%... 99%...", chanceEspecial: 0.3,
    especial: (_s, h) => {
      h.atordoado = 1;
      golpe(h, 8, "📶 TRAVOU! A tela congelou e você perde o próximo turno!");
    } },
];

const CHEFAO: ModeloInimigo = {
  nome: "Dragão do Boleto Atrasado", emoji: "🐲", vida: 170, ataque: 24, defesa: 7, xp: 0, ouro: 0,
  fala: "Seus juros vencem HOJE!", chanceEspecial: 0.4,
  especial: (s, h) => {
    s.ataque += 3;
    console.log("🐲 Juros Compostos! O ataque do Dragão subiu +3!");
    s.atacar(h);
  },
};

function criarInimigo(m: ModeloInimigo, etapa: number): Inimigo {
  const mult = 1 + 0.12 * (etapa - 1);
  return new Inimigo(m, Math.round(m.vida * mult), Math.round(m.ataque * mult), m.defesa + Math.floor((etapa - 1) / 2));
}

// ---------- batalha ----------
type Resultado = "vitoria" | "derrota" | "fuga";

async function usarHabilidade(h: Heroi, alvo: Inimigo): Promise<boolean> {
  h.classe.habilidades.forEach((s, i) => console.log(`${i + 1}) ${s.nome} (${s.custo} mana) - ${s.descricao}`));
  console.log("0) Voltar");
  const e = parseInt((await perguntar("Habilidade: ")).trim(), 10);
  if (isNaN(e) || e < 1 || e > h.classe.habilidades.length) return false;
  const hab = h.classe.habilidades[e - 1];
  if (h.mana < hab.custo) {
    console.log("🔷 Mana insuficiente!");
    return false;
  }
  h.mana -= hab.custo;
  hab.usar(h, alvo);
  return true;
}

async function escolherItem(h: Heroi, alvo: Inimigo): Promise<boolean> {
  const nomes = Object.keys(h.inventario).filter((n) => h.inventario[n] > 0);
  if (nomes.length === 0) {
    console.log("🎒 Sua mochila está vazia!");
    return false;
  }
  nomes.forEach((n, i) => console.log(`${i + 1}) ${n} x${h.inventario[n]} - ${ITENS[n].descricao}`));
  console.log("0) Voltar");
  const e = parseInt((await perguntar("Item: ")).trim(), 10);
  if (isNaN(e) || e < 1 || e > nomes.length) return false;
  const nome = nomes[e - 1];
  h.inventario[nome]--;
  ITENS[nome].usar(h, alvo);
  return true;
}

async function batalha(h: Heroi, inimigo: Inimigo, podeFugir = true): Promise<Resultado> {
  console.log(`\n${inimigo.modelo.emoji} ${inimigo.nome} apareceu! "${inimigo.modelo.fala}"`);
  let fugiu = false;

  while (h.estaVivo() && inimigo.estaVivo()) {
    linha();
    h.mostrarStatus();
    console.log(`${inimigo.modelo.emoji} ${inimigo.nome} ❤️ ${barra(inimigo.vida, inimigo.vidaMaxima)} ${inimigo.vida}/${inimigo.vidaMaxima} | 🗡️ ${inimigo.ataque} 🛡️ ${inimigo.defesa}`);
    linha();
    h.defendendo = false;

    if (h.atordoado > 0) {
      h.atordoado--;
      console.log(`😵 ${h.nome} está atordoado e perdeu o turno!`);
    } else {
      console.log("1) Atacar  2) Habilidade  3) Item  4) Defender" + (podeFugir ? "  5) Fugir" : ""));
      const escolha = (await perguntar("> ")).trim();
      let agiu = true;
      if (escolha === "1") h.atacar(inimigo);
      else if (escolha === "2") agiu = await usarHabilidade(h, inimigo);
      else if (escolha === "3") agiu = await escolherItem(h, inimigo);
      else if (escolha === "4") {
        h.defendendo = true;
        console.log(`🛡️ ${h.nome} se protegeu! (+4 de defesa neste turno)`);
      } else if (escolha === "5" && podeFugir) {
        if (Math.random() < 0.4) {
          console.log("🏃 Você fugiu correndo!");
          fugiu = true;
          break;
        }
        console.log("😬 Não conseguiu fugir!");
      } else {
        console.log("Opção inválida.");
        agiu = false;
      }
      if (!agiu) continue;
    }

    if (!inimigo.estaVivo()) break;
    inimigo.agir(h);
    h.recuperarMana(3);
  }

  h.bonusAtaque = 0;
  h.defendendo = false;
  h.atordoado = 0;

  if (fugiu) return "fuga";
  if (!h.estaVivo()) return "derrota";

  console.log(`\n💀 ${inimigo.nome} foi derrotado!`);
  h.ouro += inimigo.modelo.ouro;
  console.log(`💰 +${inimigo.modelo.ouro} de ouro | ✨ +${inimigo.modelo.xp} de XP`);
  h.ganharXp(inimigo.modelo.xp);
  if (inimigo.modelo.xp > 0 && Math.random() < 0.3) {
    const drop = sortear(Object.keys(ITENS));
    h.inventario[drop] = (h.inventario[drop] || 0) + 1;
    console.log(`🎁 O inimigo deixou cair: ${drop}!`);
  }
  return "vitoria";
}

// ---------- mapa e eventos ----------
type TipoNo = "batalha" | "elite" | "loja" | "descanso" | "evento";
const ETAPAS = 5;

const NOMES_NO: Record<TipoNo, string> = {
  batalha: "⚔️ Caminho da Briga (batalha)",
  elite: "💀 Trilha do Perigo (inimigo forte, mais recompensa)",
  loja: "🏪 Lojinha misteriosa",
  descanso: "🏕️ Acampamento (recupera vida e mana)",
  evento: "❓ Caminho estranho (evento aleatório)",
};

function gerarOpcoes(etapa: number): TipoNo[] {
  if (etapa === ETAPAS) return ["loja", "descanso", "elite"]; // última parada antes do chefão
  const todos: TipoNo[] = ["batalha", "elite", "loja", "descanso", "evento"];
  const pool = etapa === 1 ? todos.filter((t) => t !== "elite") : todos;
  const opcoes = embaralhar(pool).slice(0, 3);
  if (etapa === 1 && !opcoes.includes("batalha")) opcoes[0] = "batalha";
  return opcoes;
}

async function evento(h: Heroi): Promise<void> {
  const e = aleatorio(1, 3);
  if (e === 1) {
    console.log("\n📦 Um baú falante diz: 'Me abre aí, vai!'");
    if (Math.random() < 0.5) {
      const o = aleatorio(15, 35);
      h.ouro += o;
      console.log(`💰 Tinha ${o} de ouro lá dentro!`);
    } else {
      const d = Math.min(aleatorio(8, 15), h.vida - 1);
      h.receberDano(d);
      console.log(`👅 Era um Mímico mal-humorado! Ele te mordeu (${d} de dano).`);
    }
  } else if (e === 2) {
    console.log("\n🍇 Você achou uma fonte de açaí na tigela!");
    console.log(`Recuperou ${h.curar(30)} de vida e ${h.recuperarMana(20)} de mana.`);
  } else {
    console.log("\n🧙‍♂️ Um gnomo apostador aparece: 'Aposta 15 de ouro? Cara ou coroa, 50% de chance!'");
    if (h.ouro < 15) {
      console.log("Você está sem grana, e o gnomo vai embora rindo.");
      return;
    }
    const r = (await perguntar("Apostar? (s/n): ")).trim().toLowerCase();
    if (r !== "s") return;
    if (Math.random() < 0.5) {
      h.ouro += 30;
      console.log("🎉 Você ganhou! +30 de ouro!");
    } else {
      h.ouro -= 15;
      console.log("😭 Perdeu! O gnomo levou 15 de ouro.");
    }
  }
}

// retorna false se o herói morreu
async function executarNo(h: Heroi, tipo: TipoNo, etapa: number): Promise<boolean> {
  if (tipo === "batalha" || tipo === "elite") {
    const pool = tipo === "elite" ? ELITES : etapa <= 2 ? COMUNS.slice(0, 4) : COMUNS;
    const r = await batalha(h, criarInimigo(sortear(pool), etapa));
    return r !== "derrota";
  }
  if (tipo === "loja") await loja(h);
  else if (tipo === "evento") await evento(h);
  else {
    const v = h.curar(Math.floor(h.vidaMaxima * 0.4));
    const m = h.recuperarMana(Math.floor(h.manaMaxima * 0.5));
    console.log(`\n🏕️ Você descansou na fogueira: +${v} de vida e +${m} de mana.`);
  }
  return true;
}

// ---------- jogo ----------
async function main(): Promise<void> {
  console.log("=== 🏰 BATALHA NA MASMORRA MALUCA 🏰 ===\n");
  const nome = (await perguntar("Nome do seu herói: ")).trim() || "Herói";

  console.log("\nEscolha sua classe:");
  CLASSES.forEach((c, i) => console.log(`${i + 1}) ${c.emoji} ${c.nome} - ${c.descricao}`));
  let classe: ClasseInfo | null = null;
  while (!classe) {
    const n = parseInt((await perguntar("> ")).trim(), 10);
    if (n >= 1 && n <= CLASSES.length) classe = CLASSES[n - 1];
    else console.log("Opção inválida.");
  }
  const heroi = new Heroi(nome, classe);

  for (let etapa = 1; etapa <= ETAPAS; etapa++) {
    console.log(`\n🗺️ ETAPA ${etapa}/${ETAPAS} - escolha seu caminho:`);
    heroi.mostrarStatus();
    const opcoes = gerarOpcoes(etapa);
    opcoes.forEach((o, i) => console.log(`${i + 1}) ${NOMES_NO[o]}`));

    let escolhido: TipoNo | null = null;
    while (!escolhido) {
      const n = parseInt((await perguntar("> ")).trim(), 10);
      if (n >= 1 && n <= opcoes.length) escolhido = opcoes[n - 1];
      else console.log("Opção inválida.");
    }

    if (!(await executarNo(heroi, escolhido, etapa))) {
      console.log(`\n☠️ ${heroi.nome} caiu na etapa ${etapa} com ${heroi.ouro} de ouro. Fim de jogo.`);
      rl.close();
      return;
    }
  }

  console.log("\n🔥 Você chegou ao covil do CHEFÃO FINAL!");
  heroi.mostrarStatus();
  const r = await batalha(heroi, criarInimigo(CHEFAO, 1), false);
  if (r === "vitoria") {
    console.log(`\n🏆 VITÓRIA! ${heroi.nome} (Nv ${heroi.nivel}) quitou o boleto e salvou o reino!`);
    console.log(`💰 Ouro final: ${heroi.ouro}`);
  } else {
    console.log("\n☠️ O Dragão do Boleto te cobrou até o último centavo... Fim de jogo.");
  }
  rl.close();
}

main();