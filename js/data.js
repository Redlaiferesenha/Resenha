const CLASS_IMAGES = {
    neutro: "imagens/imagensperso/neutro.png",
    defensor: "imagens/imagensperso/defensor.jpg",
    assassino: "imagens/imagensperso/assasino.png",     
    energetico: "imagens/imagensperso/energetico.jpg",   
    arqueiro: "imagens/imagensperso/arqueirpo.png",   
    vampiro: "imagens/imagensperso/vampiro.jpg"
};

const AMBIENTE_IMAGES = {
    0: "imagens/imagensfundo/neutro.png",
    1: "imagens/imagensfundo/floresta.png",
    2: "imagens/imagensfundo/glacial.png",
    3: "imagens/imagensfundo/pantano.png",
    4: "imagens/imagensfundo/vulcao.png"
};

const CATALOGO_ITENS = [
    { id: 1, nome: "Óculos de Aventureiro", img: "imagens/imagensitem/oculosaventureiro.png", desc: "+2 Bônus de Ataque", efeito: (p) => p.atkpla += 2 },
    { id: 2, nome: "Colete à Prova de Balas", img: "imagens/imagensitem/colete.jpg", desc: "+2 Bônus de Defesa", efeito: (p) => p.defpla += 2 },
    { id: 3, nome: "Dado Estranho", img: "imagens/imagensitem/dadoestranho.png", desc: "+1 no Lado do Dado de Dano", efeito: (p) => p.tipdan += 1 },
    { id: 4, nome: "Pedra de Amolar", img: "imagens/imagensitem/pedramolar.png", desc: "+2 Dano Adicional", efeito: (p) => p.danpla += 2 },
    { id: 5, nome: "Laser de Mira", img: "imagens/imagensitem/lasermira.png", desc: "-1 na Margem do Crítico", efeito: (p) => { p.critico = Math.max(0, p.critico - 1); } },
    { id: 6, nome: "Faca de Arremesso", img: "imagens/imagensitem/facarremeso.png", desc: "+3 Dano, -2 Bônus Ataque", efeito: (p) => { p.danpla += 3; p.atkpla -= 2; } },
    { id: 7, nome: "Red Bull Vencido", img: "imagens/imagensitem/redbull.png", desc: "+4 Energia Atual", efeito: (p) => p.energiaatual += 4 },
    { id: 8, nome: "Bituca de Cigarro", img: "imagens/imagensitem/bituca.png", desc: "+1 Dano do Feitiço Chamas", efeito: () => gameState.danchama += 1 },
    { id: 9, nome: "Catuaba", img: "imagens/imagensitem/catuaba.png", desc: "+8 HP, +4 Max HP, -1 Atk", efeito: (p) => { p.vidamaxpla += 4; curarPlayer(8); p.atkpla -= 1; } },
    { id: 10, nome: "Olho de Aranha", img: "imagens/imagensitem/olharanha.png", desc: "+1 Dano de Veneno", efeito: () => gameState.danven += 1 },
    { id: 11, nome: "Analgésico", img: "imagens/imagensitem/analgesico.png", desc: "+1 Resistência a Dano (RD)", efeito: (p) => p.rd += 1 },
    { id: 12, nome: "Máscara para Dormir", img: "imagens/imagensitem/mascaradormir.png", desc: "+1 Turno de Duração do Sono", efeito: () => gameState.rodormin += 1 },
    { id: 13, nome: "Picolé do Amor", img: "imagens/imagensitem/picoleamor.png", desc: "+1 Redução de Defesa quando congelado", efeito: () => gameState.redconge += 1 },
    { id: 14, nome: "Labubu", img: "imagens/imagensitem/labubu.png", desc: "+2 Atk, +2 Max Energia, -3 HP", efeito: (p) => { p.atkpla += 2; p.energiamax += 2; p.vidaatualpla -= 3; } },
    { id: 15, nome: "Dente Falso de Vampiro", img: "imagens/imagensitem/dentefalso.png", desc: "+1 Dano de Sangramento", efeito: () => gameState.dansang += 1 },
    { id: 16, nome: "Pré Treino", img: "imagens/imagensitem/pretreino.jpg", desc: "+3 Max Energia, +1 Energia Atual", efeito: (p) => { p.energiamax += 3; p.energiaatual += 1; } }
];

const CATALOGO_ITENS_BOSS = [
    { id: 1, nome: "Máscara de Lobo", img: "imagens/imagensitem/mascaralobo.png", desc: "+4 Max HP, +4 Atk, -2 Def (Cura 4 HP)", efeito: (p) => { p.vidamaxpla += 4; curarPlayer(4); p.atkpla += 4; p.defpla -= 2; } },
    { id: 2, nome: "Livro Endiabrado", img: "imagens/imagensitem/livroendiabrado.png", desc: "+3 Atk, +3 Dano. Perca 25% do HP atual", efeito: (p) => { p.atkpla += 3; p.danpla += 3; p.vidaatualpla = Math.floor(p.vidaatualpla * 0.75); } },
    { id: 3, nome: "Pote Guloso", img: "imagens/imagensitem/poteguloso.png", desc: "Permite pegar 2 itens no próximo inimigo derrotado (Consumível)", efeito: (p) => { gameState.potegulosoAtivo = true; } },
    { id: 4, nome: "Aura do Monstro", img: "imagens/imagensitem/auradomosntro.png", desc: "Quando zerar o HP, revive com 100% de HP (Consumível)", efeito: (p) => { gameState.auraMonstroAtiva = true; } },
    { id: 5, nome: "Calvície Vampírica", img: "imagens/imagensitem/calvice.png", desc: "Roubo de vida permanente (60% do dano) mas perde 50% HP Max", efeito: (p) => { p.vidamaxpla = Math.floor(p.vidamaxpla * 0.5); if (p.vidaatualpla > p.vidamaxpla) p.vidaatualpla = p.vidamaxpla; gameState.calviceVampiricaAtiva = true; } },
    { id: 6, nome: "Escudo Sorridente", img: "imagens/imagensitem/escudosorridente.png", desc: "+5 Defesa, +3 Redução de Dano (RD), -3 Atk", efeito: (p) => { p.defpla += 5; p.rd += 3; p.atkpla -= 3; } },
    { id: 7, nome: "Definitivamente não é Césio", img: "imagens/imagensitem/definitivamentenãoCésio.jpg", desc: "+10 Energia Max, +1 em todos os efeitos de habilidades, Perca 25% HP Max", efeito: (p) => { p.energiamax += 10; p.energiaatual += 10; p.vidamaxpla = Math.floor(p.vidamaxpla * 0.75); if (p.vidaatualpla > p.vidamaxpla) p.vidaatualpla = p.vidamaxpla; gameState.habAtkBonus += 1; gameState.habDanoBonus += 1; gameState.habCuraValor += 1; gameState.danchama += 1; gameState.redconge += 1; gameState.danven += 1; gameState.dansang += 1; gameState.rodormin += 1; gameState.redareia += 1; gameState.drenarBonus += 1; gameState.drenarDado += 1; } },
    { id: 8, nome: "Ensinamentos do mago da era antiga", img: "imagens/imagensitem/magodaeraantiga.png", desc: "+3 em todos os efeitos de habilidades, perde 9 de Energia Max", efeito: (p) => { p.energiamax -= 9; if (p.energiaatual > p.energiamax) p.energiaatual = p.energiamax; gameState.habAtkBonus += 3; gameState.habDanoBonus += 3; gameState.habCuraValor += 3; gameState.danchama += 3; gameState.redconge += 3; gameState.danven += 3; gameState.dansang += 3; gameState.rodormin += 3; gameState.redareia += 3; gameState.drenarBonus += 3; gameState.drenarDado += 3; } }
];

let gameState = {
    rodada: 1,
    mortosNormais: 0,
    mortosTotais: 0,
    inimigosParaAmbiente: 0,
    ambienteAtual: 0, 
    bossAtivo: false,
    tipoContraAtaque: 0, 

    habAtkBonus: 2,   
    habDanoBonus: 1,  
    habCuraValor: 6,  
    
    danchama: 2,
    redconge: 2,
    danven: 5,
    dansang: 3,
    dursang: 7,
    dansang: 3,
    dursang: 7,
    redareia: 5,
    durareia: 3,
    drenarBonus: 0,
    drenarDado: 4,
    rodormin: 4,
    rodormin: 4,
    vampiroPassiva: false,
    saquesRestantes: 1,
    potegulosoAtivo: false,
    poteGulosoConsumir: false,
    auraMonstroAtiva: false,
    calviceVampiricaAtiva: false,

    player: {
        classeNome: "Neutro",
        classeId: 1,
        vidamaxpla: 30,
        vidaatualpla: 30,
        atkpla: 3,
        danpla: 2,
        defpla: 14,
        tipdan: 4,
        critico: 20,
        energiamax: 12,
        energiaatual: 12,
        rd: 0
    },

    inimigo: {
        nome: "Goblin Nível 1",
        imagem: "imagens/imagensini/goblin.png",
        vidamaxini: 25,
        vidatualini: 25,
        atkini: 2,
        danini: 2,
        defini: 12,
        tipdanini: 4,
        status: []
    },

    boss: {
        nome: "SENHOR DAS SOMBRAS",
        vidamax: 50,
        vidatual: 50,
        atkboss: 5,
        danoss: 3,
        defboss: 15,
        tipdanboss: 5,
        status: []
    }
};

const LISTA_HABILIDADES = [
    { id: 1, nome: "1. Ataque Aprimorado", icone: "⚔️", custo: 3, desc: "Bônus de +2 no teste d20 e +1 de dano no golpe.", cor: "text-purple-300" },
    { id: 2, nome: "2. Contra-Ataque Especial", icone: "🛡️", custo: 4, desc: "Caso o inimigo erre o ataque nesta rodada, ataca 2 vezes em resposta!", cor: "text-purple-300" },
    { id: 3, nome: "3. Cura", icone: "💚", custo: 4, desc: "Restaura 6 pontos de vida imediatamente.", cor: "text-emerald-400" },
    { id: 4, nome: "4. Chamas", icone: "🔥", custo: 8, desc: "Aplica queimadura contínua (Dano por rodada) e reduz defesa do alvo em 1.", cor: "text-orange-400" },
    { id: 5, nome: "5. Congelamento", icone: "❄️", custo: 6, desc: "Reduz drasticamente a defesa do inimigo.", cor: "text-sky-400" },
    { id: 6, nome: "6. Envenenamento", icone: "🧪", custo: 7, desc: "Causa dano por 4 rodadas consecutivas.", cor: "text-lime-400" },
    { id: 7, nome: "7. Sono", icone: "💤", custo: 10, desc: "Faz o inimigo dormir por rodadas aleatórias (impede ataques).", cor: "text-indigo-400" },
    { id: 8, nome: "8. Sangramento", icone: "🩸", custo: 8, desc: "Aplica sangramento por 7 rodadas (Ativa passiva do Vampiro!).", cor: "text-rose-400" },
    { id: 9, nome: "9. Areia nos Olhos", icone: "🏜️", custo: 7, desc: "Reduz o bônus de ataque do inimigo em 5 por 3 rodadas.", cor: "text-yellow-400" },
    { id: 10, nome: "10. Drenar Essência", icone: "🔮", custo: 6, desc: "Acerta garantido, causando dano mágico e curando 50% do dano.", cor: "text-fuchsia-400" }
];

const BESTIARIO_INIMIGOS = [
    { nome: "Goblin", img: "imagens/imagensini/goblin.png", vidabase: 25, atkbase: 3, defbase: 10, danobase: 5 },
    { nome: "Esqueleto", img: "imagens/imagensini/esqueleto.png", vidabase: 22, atkbase: 4, defbase: 11, danobase: 5 },
    { nome: "Orc", img: "imagens/imagensini/orc.png", vidabase: 35, atkbase: 4, defbase: 12, danobase: 6 },
    { nome: "Zumbi", img: "imagens/imagensini/zumbi.png", vidabase: 30, atkbase: 2, defbase: 9, danobase: 4 },
    { nome: "Aranha Gigante", img: "imagens/imagensini/aranha.png", vidabase: 20, atkbase: 5, defbase: 11, danobase: 6 },
    { nome: "Ladino", img: "imagens/imagensini/ladino.png", vidabase: 22, atkbase: 5, defbase: 12, danobase: 6 },
    { nome: "Lobo", img: "imagens/imagensini/lobo.png", vidabase: 24, atkbase: 4, defbase: 10, danobase: 5 },
    { nome: "Cogumelo Mutante", img: "imagens/imagensini/cogumelo.png", vidabase: 28, atkbase: 3, defbase: 10, danobase: 4 },
    { nome: "Elemental de Fogo", img: "imagens/imagensini/elemental.png", vidabase: 26, atkbase: 5, defbase: 11, danobase: 7 },
    { nome: "Ent", img: "imagens/imagensini/ent.png", vidabase: 40, atkbase: 3, defbase: 14, danobase: 5 },
    { nome: "Golem de Gelo", img: "imagens/imagensini/golem.png", vidabase: 45, atkbase: 2, defbase: 15, danobase: 5 },
    { nome: "Serpente", img: "imagens/imagensini/serpente.png", vidabase: 18, atkbase: 6, defbase: 10, danobase: 6 },
    { nome: "Yeti", img: "imagens/imagensini/yeti.png", vidabase: 38, atkbase: 4, defbase: 13, danobase: 7 },
    { nome: "Dragão Jovem", img: "imagens/imagensini/dragão.png", vidabase: 35, atkbase: 5, defbase: 13, danobase: 8 }
];

const BESTIARIO_BOSSES = [
    { nome: "SENHOR DAS SOMBRAS", img: "imagens/imagensini/senhor das sombras.png", vidabase: 60, atkbase: 6, defbase: 14, danobase: 10 },
    { nome: "REI GOBLIN", img: "imagens/imagensini/reigoblin.png", vidabase: 50, atkbase: 5, defbase: 13, danobase: 9 },
    { nome: "LICH SUPREMO", img: "imagens/imagensini/lichsupremo.png", vidabase: 55, atkbase: 7, defbase: 12, danobase: 12 },
    { nome: "DRAGÃO ANCIÃO", img: "imagens/imagensini/dragãoanciao.png", vidabase: 80, atkbase: 8, defbase: 10, danobase: 15 }
];
