
const CLASS_IMAGES = {
    neutro: "imagens/neutro.png",
    defensor: "imagens/defensor.jpg",
    assassino: "imagens/assasino.png",
    energetico: "imagens/energético.jpg",
    arqueiro: "imagens/arqueirpo.png",
    vampiro: "imagens/vampiro.jpg"
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
