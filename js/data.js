
const CLASS_IMAGES = {
    neutro: "imagens/imagensperso/neutro.png",
    defensor: "imagens/imagensperso/defensor.jpg",
    assassino: "imagens/imagensperso/assasino.png",     
    energetico: "imagens/imagensperso/energetico.jpg",   
    arqueiro: "imagens/imagensperso/arqueirpo.png",   
    vampiro: "imagens/imagensperso/vampiro.jpg"
};


let gameState = {
    rodada: 1,
    mortosNormais: 0,
    mortosTotais: 0,
    inimigosParaAmbiente: 0,
    ambienteAtual: 0, // 0: Neutro, 1: Floresta, 2: Glacial, 3: Pantano, 4: Vulcao
    bossAtivo: false,
    tipoContraAtaque: 0, // 0: Nenhum, 1: Normal, 2: Especial (Duplo)
    
    
    danchama: 2,
    redconge: 2,
    danven: 5,
    dansang: 3,
    rodormin: 4,
    vampiroPassiva: false,

    
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
    { id: 8, nome: "8. Sangramento", icone: "🩸", custo: 8, desc: "Aplica sangramento por 7 rodadas (Ativa passiva do Vampiro!).", cor: "text-rose-400" }
];

const CATALOGO_ITENS = [
    { id: 1, nome: "Óculos de Aventureiro", desc: "+2 Bônus de Ataque", efeito: (p) => p.atkpla += 2 },
    { id: 2, nome: "Colete à Prova de Balas", desc: "+2 Bônus de Defesa", efeito: (p) => p.defpla += 2 },
    { id: 3, nome: "Dado Estranho", desc: "+1 no Lado do Dado de Dano", efeito: (p) => p.tipdan += 1 },
    { id: 4, nome: "Pedra de Amolar", desc: "+2 Dano Adicional", efeito: (p) => p.danpla += 2 },
    { id: 5, nome: "Laser de Mira", desc: "-1 na Margem do Crítico", efeito: (p) => p.critico -= 1 },
    { id: 6, nome: "Faca de Arremesso", desc: "+3 Dano, -2 Bônus Ataque", efeito: (p) => { p.danpla += 3; p.atkpla -= 2; } },
    { id: 7, nome: "Red Bull Vencido", desc: "+4 Energia Atual", efeito: (p) => p.energiaatual += 4 },
    { id: 8, nome: "Bituca de Cigarro", desc: "+1 Dano do Feitiço Chamas", efeito: () => gameState.danchama += 1 },
    { id: 9, nome: "Catuaba", desc: "+8 HP, +4 Max HP, -1 Atk", efeito: (p) => { p.vidamaxpla += 4; curarPlayer(8); p.atkpla -= 1; } },
    { id: 10, nome: "Olho de Aranha", desc: "+1 Dano de Veneno", efeito: () => gameState.danven += 1 },
    { id: 11, nome: "Analgésico", desc: "+1 Resistência a Dano (RD)", efeito: (p) => p.rd += 1 },
    { id: 12, nome: "Máscara para Dormir", desc: "+1 Turno de Duração do Sono", efeito: () => gameState.rodormin += 1 },
    { id: 13, nome: "Picolé do Amor", desc: "+1 Redução de Defesa em Gelos", efeito: () => gameState.redconge += 1 },
    { id: 14, nome: "Labubu", desc: "+2 Atk, +2 Max Energia, -3 HP", efeito: (p) => { p.atkpla += 2; p.energiamax += 2; p.vidaatualpla -= 3; } },
    { id: 15, nome: "Dente Falso de Vampiro", desc: "+1 Dano de Sangramento", efeito: () => gameState.dansang += 1 }
];

const BESTIARIO_INIMIGOS = [
    { nome: "Goblin", img: "imagens/imagensini/goblin.png", vidabase: 25, atkbase: 3, defbase: 10, danobase: 2 },
    { nome: "Esqueleto", img: "imagens/imagensini/esqueleto.png", vidabase: 22, atkbase: 4, defbase: 11, danobase: 3 },
    { nome: "Orc", img: "imagens/imagensini/orc.png", vidabase: 35, atkbase: 4, defbase: 12, danobase: 3 },
    { nome: "Zumbi", img: "imagens/imagensini/zumbi.png", vidabase: 30, atkbase: 2, defbase: 9, danobase: 2 },
    { nome: "Aranha Gigante", img: "imagens/imagensini/aranha.png", vidabase: 20, atkbase: 5, defbase: 11, danobase: 2 },
    { nome: "Ladino", img: "imagens/imagensini/ladino.png", vidabase: 22, atkbase: 5, defbase: 12, danobase: 3 },
    { nome: "Lobo", img: "imagens/imagensini/lobo.png", vidabase: 24, atkbase: 4, defbase: 10, danobase: 2 },
    { nome: "Cogumelo Mutante", img: "imagens/imagensini/cogumelo.png", vidabase: 28, atkbase: 3, defbase: 10, danobase: 2 },
    { nome: "Elemental de Fogo", img: "imagens/imagensini/elemental.png", vidabase: 26, atkbase: 5, defbase: 11, danobase: 4 },
    { nome: "Ent", img: "imagens/imagensini/ent.png", vidabase: 40, atkbase: 3, defbase: 14, danobase: 3 },
    { nome: "Golem de Gelo", img: "imagens/imagensini/golem.png", vidabase: 45, atkbase: 2, defbase: 15, danobase: 3 },
    { nome: "Serpente", img: "imagens/imagensini/serpente.png", vidabase: 18, atkbase: 6, defbase: 10, danobase: 3 },
    { nome: "Yeti", img: "imagens/imagensini/yeti.png", vidabase: 38, atkbase: 4, defbase: 13, danobase: 4 },
    { nome: "Dragão Jovem", img: "imagens/imagensini/dragão.png", vidabase: 35, atkbase: 5, defbase: 13, danobase: 4 }
];

const BESTIARIO_BOSSES = [
    { nome: "SENHOR DAS SOMBRAS", img: "imagens/imagensini/senhor das sombras.png", vidabase: 60, atkbase: 6, defbase: 14, danobase: 5 },
    { nome: "REI GOBLIN", img: "imagens/imagensini/reigoblin.png", vidabase: 50, atkbase: 5, defbase: 13, danobase: 4 },
    { nome: "LICH SUPREMO", img: "imagens/imagensini/lichsupremo.png", vidabase: 55, atkbase: 7, defbase: 12, danobase: 6 },
    { nome: "DRAGÃO ANCIÃO", img: "imagens/imagensini/dragãoanciao.png", vidabase: 80, atkbase: 8, defbase: 15, danobase: 7 }
];
