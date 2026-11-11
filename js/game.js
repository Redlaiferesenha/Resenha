let currentUser = "";
let dadosPlacarOnline = [];

function deslogar() {
    localStorage.removeItem('usuarioLogado');
    currentUser = "";

    document.getElementById('telaSelecaoClasse').classList.add('hidden');
    document.getElementById('telaLogin').classList.remove('hidden');

    const inputU = document.getElementById('inputUser');
    const inputP = document.getElementById('inputPass');
    if (inputU) inputU.value = '';
    if (inputP) inputP.value = '';
}
const firebaseConfig = {
    apiKey: "AIzaSyDodcLJZkIAyrIvNWmWsgLjdeR0zgYOlRQ",
    authDomain: "joguin-resenha.firebaseapp.com",
    projectId: "joguin-resenha",
    storageBucket: "joguin-resenha.firebasestorage.app",
    messagingSenderId: "209192133693",
    appId: "1:209192133693:web:e77d9c08341522556a7654",
    measurementId: "G-NZS4NP1ZH1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
window.addEventListener('DOMContentLoaded', () => {
    if (typeof CLASS_IMAGES !== 'undefined') {
        if (document.getElementById('img-neutro')) document.getElementById('img-neutro').src = CLASS_IMAGES.neutro;
        if (document.getElementById('img-defensor')) document.getElementById('img-defensor').src = CLASS_IMAGES.defensor;
        if (document.getElementById('img-assassino')) document.getElementById('img-assassino').src = CLASS_IMAGES.assassino;
        if (document.getElementById('img-energetico')) document.getElementById('img-energetico').src = CLASS_IMAGES.energetico;
        if (document.getElementById('img-arqueiro')) document.getElementById('img-arqueiro').src = CLASS_IMAGES.arqueiro;
        if (document.getElementById('img-vampiro')) document.getElementById('img-vampiro').src = CLASS_IMAGES.vampiro;
    }

    let usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
        currentUser = usuarioSalvo;
        document.getElementById('telaLogin').classList.add('hidden');
        document.getElementById('telaSelecaoClasse').classList.remove('hidden');
    }
});

function formatarModificador(val) {
    return val >= 0 ? `+${val}` : `${val}`;
}

const AudioSys = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playHit() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    playSpell() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    },
    playCrit() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
};

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * 0.8 + 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
            this.reset();
            this.y = canvas.height;
        }
    }
    draw() {
        let color = "rgba(245, 158, 11, ";
        if (gameState.ambienteAtual === 1) color = "rgba(34, 197, 94, ";
        if (gameState.ambienteAtual === 2) color = "rgba(56, 189, 248, ";
        if (gameState.ambienteAtual === 3) color = "rgba(163, 230, 53, ";
        if (gameState.ambienteAtual === 0) color = "rgba(148, 163, 184, ";

        ctx.fillStyle = color + this.alpha + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 45; i++) particles.push(new Particle());

function animateBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateBg);
}
animateBg();

function selecionarClasse(op) {
    gameState.player.classeId = op;
    switch(op) {
        case 1:
            gameState.player = { classeNome: "Neutro", classeId: 1, vidamaxpla: 30, vidaatualpla: 30, atkpla: 3, danpla: 2, defpla: 14, tipdan: 4, critico: 20, energiamax: 12, energiaatual: 12, rd: 0, itensInventario: [] };
            break;
        case 2:
            gameState.player = { classeNome: "Defensor", classeId: 2, vidamaxpla: 35, vidaatualpla: 35, atkpla: 2, danpla: 2, defpla: 16, tipdan: 4, critico: 20, energiamax: 12, energiaatual: 12, rd: 2, itensInventario: [] };
            break;
        case 3:
            gameState.player = { classeNome: "Assassino", classeId: 3, vidamaxpla: 24, vidaatualpla: 24, atkpla: 4, danpla: 3, defpla: 14, tipdan: 4, critico: 20, energiamax: 14, energiaatual: 14, rd: 0, itensInventario: [] };
            break;
        case 4:
            gameState.player = { classeNome: "Energético", classeId: 4, vidamaxpla: 23, vidaatualpla: 23, atkpla: 3, danpla: 2, defpla: 12, tipdan: 4, critico: 20, energiamax: 17, energiaatual: 17, rd: 0, itensInventario: [] };
            gameState.danchama += 1;
            gameState.redconge += 1;
            gameState.danven += 1;
            gameState.rodormin += 1;
            gameState.dansang += 1;
            break;
        case 5:
            gameState.player = { classeNome: "Arqueiro", classeId: 5, vidamaxpla: 24, vidaatualpla: 24, atkpla: 3, danpla: 4, defpla: 16, tipdan: 6, critico: 20, energiamax: 12, energiaatual: 12, rd: 0, itensInventario: [] };
            gameState.danchama += 1;
            gameState.redconge += 1;
            gameState.danven += 1;
            break;
        case 6:
            gameState.player = { classeNome: "Vampiro", classeId: 6, vidamaxpla: 30, vidaatualpla: 30, atkpla: 3, danpla: 2, defpla: 14, tipdan: 4, critico: 20, energiamax: 16, energiaatual: 16, rd: 0, itensInventario: [] };
            gameState.vampiroPassiva = true;
            break;
    }

    document.getElementById('telaSelecaoClasse').classList.add('hidden');
    document.getElementById('telaCombate').classList.remove('hidden');
    document.getElementById('headerAmbiente').classList.remove('hidden');

    const imgKeyMap = { 1: 'neutro', 2: 'defensor', 3: 'assassino', 4: 'energetico', 5: 'arqueiro', 6: 'vampiro' };
    document.getElementById('playerAvatarImg').src = CLASS_IMAGES[imgKeyMap[op]];

    logMsg(`Você entrou na masmorra como <b class="text-amber-400">${gameState.player.classeNome}</b>!`, 'system');
    
    gerarNovoAmbiente();
    document.getElementById('telaSelecaoClasse').classList.add('hidden');
    document.getElementById('telaJogo').classList.remove('hidden');
    atualizarTela();
}

function logMsg(msg, tipo = 'normal') {
    const logContainer = document.getElementById('combatLog');
    const div = document.createElement('div');
    
    let color = "text-slate-300";
    if (tipo === 'system') color = "text-amber-400 font-bold";
    if (tipo === 'player') color = "text-emerald-400";
    if (tipo === 'enemy') color = "text-rose-400";
    if (tipo === 'crit') color = "text-yellow-300 font-bold glow-amber";
    if (tipo === 'spell') color = "text-purple-300";
    if (tipo === 'status') color = "text-cyan-300";

    div.className = `${color} leading-relaxed`;
    div.innerHTML = `<span class="text-slate-500 text-[10px]">[R${gameState.rodada}]</span> ${msg}`;
    logContainer.appendChild(div);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function limparLog() {
    document.getElementById('combatLog').innerHTML = '';
}

function aplicarEfeitoAmbiente(amb, player, ini, boss, isBoss, apenasInimigo = false) {
    const target = isBoss ? boss : ini;
    switch(amb) {
        case 1: 
            if (!apenasInimigo) player.defpla += 2;
            if(isBoss) target.atkboss -= 2; else target.atkini -= 2;
            break;
        case 2: 
            if (!apenasInimigo) {
                player.energiamax -= 2;
                if (player.energiaatual > player.energiamax) player.energiaatual = player.energiamax;
                gameState.redconge += 1;
            }
            if(isBoss) target.defboss -= 2; else target.defini -= 2;
            break;
        case 3: 
            if (!apenasInimigo) player.atkpla -= 2;
            if(isBoss) { target.atkboss -= 2; target.defboss += 1; } 
            else { target.atkini -= 2; target.defini += 1; }
            break;
        case 4: 
            if (!apenasInimigo) {
                player.atkpla += 3;
                gameState.danchama += 2;
            }
            if(isBoss) target.atkboss += 3; else target.atkini += 3;
            break;
    }
}

function removerEfeitoAmbiente(amb, player, ini, boss, isBoss) {
    const target = isBoss ? boss : ini;
    switch(amb) {
        case 1:
            player.defpla -= 2;
            if(isBoss) target.atkboss += 2; else target.atkini += 2;
            break;
        case 2:
            player.energiamax += 2;
            if(isBoss) target.defboss += 2; else target.defini += 2;
            gameState.redconge -= 1;
            break;
        case 3:
            player.atkpla += 2;
            if(isBoss) { target.atkboss += 2; target.defboss -= 1; } 
            else { target.atkini += 2; target.defini -= 1; }
            break;
        case 4:
            player.atkpla -= 3;
            if(isBoss) target.atkboss -= 3; else target.atkini -= 3;
            gameState.danchama -= 2;
            break;
    }
}

function gerarNovoAmbiente() {
    const ambAnterior = gameState.ambienteAtual;
    let novoAmb;
    do { novoAmb = Math.floor(Math.random() * 5); } while (novoAmb === ambAnterior);

    removerEfeitoAmbiente(ambAnterior, gameState.player, gameState.inimigo, gameState.boss, gameState.bossAtivo);
    gameState.ambienteAtual = novoAmb;
    aplicarEfeitoAmbiente(novoAmb, gameState.player, gameState.inimigo, gameState.boss, gameState.bossAtivo);

    const nomes = ["Neutro", "Floresta 🌲", "Glacial ❄️", "Pântano ☣️", "Vulcão 🔥"];
    const descs = [
        "Nenhum efeito alterado neste ambiente.",
        "+2 Defesa para Player e -2 Ataque para Inimigos.",
        "-2 Energia Máx Player, -2 Defesa Inimigo, +1 Efeito Congelamento.",
        "-2 Ataque para ambos, +1 Defesa para Inimigos.",
        "+3 Ataque para ambos, +2 Dano de Chamas."
    ];
    const icones = ["🏛️", "🌲", "❄️", "☣️", "🔥"];

    document.getElementById('ambienteNome').innerText = `Ambiente: ${nomes[novoAmb]}`;
    document.getElementById('ambienteDesc').innerText = descs[novoAmb];
    document.getElementById('ambienteIcone').innerText = icones[novoAmb];
    const bgElem = document.getElementById('bgAmbiente');
    if (bgElem && AMBIENTE_IMAGES[novoAmb]) {
        bgElem.style.backgroundImage = `url('${AMBIENTE_IMAGES[novoAmb]}')`;
    }
    logMsg(`🌎 <b>O AMBIENTE MUDOU:</b> ${nomes[novoAmb]} - ${descs[novoAmb]}`, 'system');
}

function curarPlayer(valor) {
    gameState.player.vidaatualpla += valor;
    if (gameState.player.vidaatualpla > gameState.player.vidamaxpla) {
        gameState.player.vidaatualpla = gameState.player.vidamaxpla;
    }
}

function temStatus(statusArray, tipo) {
    return statusArray.some(s => s.tipo === tipo);
}

function processarStatus(target) {
    if (!target.status) return;

    for (let i = target.status.length - 1; i >= 0; i--) {
        let s = target.status[i];

        if (s.tipo === 'Chamas' || s.tipo === 'Envenenado' || s.tipo === 'Sangramento') {
            if (target.vidatualini !== undefined) {
                target.vidatualini -= s.danoPorRodada;
                if (target.vidatualini < 0) target.vidatualini = 0;
            } else {
                target.vidatual -= s.danoPorRodada;
                if (target.vidatual < 0) target.vidatual = 0;
            }
            logMsg(`🔥 [Efeito Status] ${target.nome} sofreu ${s.danoPorRodada} de dano por ${s.tipo}!`, 'status');
        }

        if (s.duracao > 0) s.duracao--;

        if (s.duracao === 0) {
            if (gameState.bossAtivo) gameState.boss.defboss += s.reducaoDef;
            else gameState.inimigo.defini += s.reducaoDef;
            
            logMsg(`✨ O efeito de <b>${s.tipo}</b> em ${target.nome} expirou.`, 'system');
            target.status.splice(i, 1);
        }
    }
}

function limparStatus(target, isBoss) {
    if (!target.status) return;
    target.status.forEach(s => {
        if(isBoss) gameState.boss.defboss += s.reducaoDef;
        else gameState.inimigo.defini += s.reducaoDef;
    });
    target.status = [];
}

function verificarVitoriaInimigo() {
    // Helper local para aplicar o Pote Guloso
    const aplicarPoteGuloso = () => {
        gameState.saquesRestantes = gameState.potegulosoAtivo ? 2 : 1;
        if (gameState.potegulosoAtivo) {
            gameState.potegulosoAtivo = false;
            const idx = gameState.player.itensInventario.findIndex(i => i.nome === "Pote Guloso");
            if (idx > -1) gameState.player.itensInventario.splice(idx, 1);
        }
    };

    if (gameState.bossAtivo) {
        if (gameState.boss.vidatual <= 0) {
            logMsg(`🏆 <b>VOCÊ DERROTOU O BOSS ${gameState.boss.nome}!</b>`, 'crit');
            gameState.bossAtivo = false;
            gameState.mortosTotais++;
            
            aplicarPoteGuloso();
            dropItemBoss();
            
            gameState.inimigosParaAmbiente++;
            if (gameState.inimigosParaAmbiente >= 2) {
                gameState.inimigosParaAmbiente = 0;
                gerarNovoAmbiente();
            }

            spawnNovoInimigo();
            atualizarTela();
            return true;
        }
    } else {
        if (gameState.inimigo.vidatualini <= 0) {
            logMsg(`☠️ Você derrotou ${gameState.inimigo.nome}!`, 'player');
            gameState.mortosTotais++;
            gameState.mortosNormais++;
            
            gameState.inimigosParaAmbiente++;
            if (gameState.inimigosParaAmbiente >= 2) {
                gameState.inimigosParaAmbiente = 0;
                gerarNovoAmbiente();
            }

            aplicarPoteGuloso();
            abrirModalLoot();

            if (gameState.mortosNormais > 0 && gameState.mortosNormais % 4 === 0) {
                gameState.bossAtivo = true;
                
                const bossModelo = BESTIARIO_BOSSES[Math.floor(Math.random() * BESTIARIO_BOSSES.length)];
                let mortosParaBoss = Math.max(0, gameState.mortosNormais - 4); 
                const esc = 1 + (mortosParaBoss * 0.08);
                
                const danoBrutoBoss = bossModelo.danobase * esc;
                let bonusBoss = Math.floor(danoBrutoBoss * 0.3) + 1;
                let dadoBoss = Math.floor(danoBrutoBoss * 0.7) + 2;
                
                if (dadoBoss <= bonusBoss) {
                    dadoBoss = bonusBoss + 2;
                }

                gameState.boss = {
                    nome: bossModelo.nome,
                    imagem: bossModelo.img,
                    vidamax: Math.floor(bossModelo.vidabase * esc),
                    vidatual: Math.floor(bossModelo.vidabase * esc),
                    atkboss: Math.floor(bossModelo.atkbase * esc),
                    defboss: bossModelo.defbase,
                    danoss: bonusBoss, 
                    tipdanboss: dadoBoss, 
                    status: []
                };

                aplicarEfeitoAmbiente(gameState.ambienteAtual, gameState.player, gameState.inimigo, gameState.boss, true);
                limparLog();
                logMsg(`⚠️ <b>${gameState.boss.nome} APARECEU!</b>`, 'crit');
            } else {
                spawnNovoInimigo();
            }
            atualizarTela();
            return true;
        }
    }
    return false;
}

function spawnNovoInimigo() {
    limparLog();

    const modelo = BESTIARIO_INIMIGOS[Math.floor(Math.random() * BESTIARIO_INIMIGOS.length)];
    const multiplicador = 1 + (gameState.mortosTotais * 0.05);
    const danoBrutoIni = modelo.danobase + (gameState.mortosTotais * 0.3);
    
    let bonusIni = Math.floor(danoBrutoIni * 0.3) + 1;
    let dadoIni = Math.floor(danoBrutoIni * 0.7) + 2;
    
    if (dadoIni <= bonusIni) {
        dadoIni = bonusIni + 2;
    }

    gameState.inimigo = {
        nome: `${modelo.nome} (Nível ${gameState.mortosTotais + 1})`,
        imagem: modelo.img,
        vidamaxini: Math.floor(modelo.vidabase * multiplicador),
        vidatualini: Math.floor(modelo.vidabase * multiplicador),
        atkini: Math.floor(modelo.atkbase + (gameState.mortosTotais * 0.5)),
        defini: modelo.defbase,
        danini: bonusIni, 
        tipdanini: dadoIni, 
        status: []
    };

    logMsg(`⚔️ Um <b>${gameState.inimigo.nome}</b> surge!`, 'enemy');
}

function acaoAtacar() {
    AudioSys.playHit();
    const p = gameState.player;
    const targetDef = gameState.bossAtivo ? gameState.boss.defboss : gameState.inimigo.defini;
    const targetStatus = gameState.bossAtivo ? gameState.boss.status : gameState.inimigo.status;
    
    let vampiroAtivo = gameState.vampiroPassiva && temStatus(targetStatus, 'Sangramento');
    let d20 = Math.floor(Math.random() * 20) + 1;
    let teste = d20 + p.atkpla + (vampiroAtivo ? 2 : 0);

    if (teste >= targetDef) {
        let dano = Math.floor(Math.random() * p.tipdan) + 1 + p.danpla + (vampiroAtivo ? 2 : 0);
        let isCrit = d20 >= p.critico;
        if (isCrit) {
            dano *= 2;
            AudioSys.playCrit();
            logMsg(`🎯 <b>ACERTO CRÍTICO!</b> (d20: ${d20} + Atk: ${p.atkpla} vs DEF: ${targetDef})`, 'crit');
        }

        logMsg(`⚔️ Você atacou e causou <b>${dano}</b> de dano! (Teste: ${teste} vs DEF: ${targetDef})`, 'player');
        
        if (gameState.bossAtivo) gameState.boss.vidatual -= dano;
        else gameState.inimigo.vidatualini -= dano;
        
        let pctCura = 0;
        if (vampiroAtivo) pctCura += 0.5; // +50% da Passiva vs Sangramento
        if (gameState.calviceVampiricaAtiva) pctCura += 0.6; // +60% do Item
        
        if (pctCura > 0) {
            let cura = Math.floor(dano * pctCura);
            curarPlayer(cura);
            logMsg(`🩸 Roubo de Vida (${Math.round(pctCura * 100)}%): Curou +${cura} de HP!`, 'player');
        }
    } else {
        logMsg(`❌ Você errou o ataque! (Rolou d20: ${d20} + ${p.atkpla} = ${teste} vs DEF: ${targetDef})`, 'normal');
    }

    if (!verificarVitoriaInimigo()) finalizarTurnoPlayer();
}

function acaoContraAtacar() {
    logMsg(`🛡️ Você assumiu Postura de Contra-Ataque! Aguardando o ataque inimigo...`, 'player');
    gameState.tipoContraAtaque = 1;
    finalizarTurnoPlayer();
}

function acaoDescansar() {
    const p = gameState.player;
    p.energiaatual += 4;
    if (p.energiaatual > p.energiamax) p.energiaatual = p.energiamax;
    curarPlayer(2);
    logMsg(`💤 Você descansou e recuperou +4 de Energia e +2 de HP! (${p.energiaatual}/${p.energiamax})`, 'player');
    finalizarTurnoPlayer();
}

function executarContraAtaque(vezes = 1) {
    const p = gameState.player;
    const targetDef = gameState.bossAtivo ? gameState.boss.defboss : gameState.inimigo.defini;
    const targetStatus = gameState.bossAtivo ? gameState.boss.status : gameState.inimigo.status;

    for (let i = 0; i < vezes; i++) {
        const vidaAtualTarget = gameState.bossAtivo ? gameState.boss.vidatual : gameState.inimigo.vidatualini;
        if (vidaAtualTarget <= 0) break;

        let vampiroAtivo = gameState.vampiroPassiva && temStatus(targetStatus, 'Sangramento');
        let d20 = Math.floor(Math.random() * 20) + 1;
        let teste = d20 + p.atkpla + (vampiroAtivo ? 2 : 0);

        if (teste >= targetDef) {
            let dano = Math.floor(Math.random() * p.tipdan) + 1 + (p.danpla * 2) + (vampiroAtivo ? 2 : 0);
            if (d20 >= p.critico) {
                dano *= 2;
                logMsg(`💥 <b>CRÍTICO NO CONTRA-ATAQUE!</b>`, 'crit');
            }
            logMsg(`⚡ <b>CONTRA-ATAQUE SUCEDIDO!</b> Causou ${dano} de dano!`, 'player');
            
            if (gameState.bossAtivo) {
                gameState.boss.vidatual -= dano;
                if (gameState.boss.vidatual < 0) gameState.boss.vidatual = 0;
            } else {
                gameState.inimigo.vidatualini -= dano;
                if (gameState.inimigo.vidatualini < 0) gameState.inimigo.vidatualini = 0;
            }

            let pctCura = 0;
            if (vampiroAtivo) pctCura += 0.5; // +50% da Passiva vs Sangramento
            if (gameState.calviceVampiricaAtiva) pctCura += 0.6; // +60% do Item
            
            if (pctCura > 0) {
                let cura = Math.floor(dano * pctCura);
                curarPlayer(cura);
                logMsg(`🩸 Roubo de Vida (${Math.round(pctCura * 100)}%): Curou +${cura} de HP!`, 'player');
            }
        } else {
            logMsg(`❌ O seu Contra-Ataque falhou. (Teste: ${teste} vs DEF: ${targetDef})`, 'normal');
        }

        if (verificarVitoriaInimigo()) return true;
    }
    return false;
}

function abrirModalHabilidades() {
    document.getElementById('modalEnergiaTxt').innerText = `${gameState.player.energiaatual}/${gameState.player.energiamax}`;
    
    const grid = document.getElementById('containerHabilidadesGrid');
    grid.innerHTML = '';

    LISTA_HABILIDADES.forEach(hab => {
        const temEnergia = gameState.player.energiaatual >= hab.custo;
        const div = document.createElement('div');
        div.className = `relative p-4 rounded-xl border flex items-center justify-between transition overflow-hidden group ${
            temEnergia ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/60 cursor-pointer' 
            : 'bg-slate-950/40 border-slate-900 cursor-not-allowed opacity-80'
        }`;

        if (temEnergia) div.onclick = () => usarHabilidade(hab.id);

        div.innerHTML = `
            <div class="flex items-center gap-3 relative z-0">
                <span class="text-3xl transition group-hover:scale-110">${hab.icone}</span>
                <div>
                    <div class="font-bold text-sm ${hab.cor}">${hab.nome}</div>
                    <div class="text-xs text-slate-400">${hab.desc}</div>
                </div>
            </div>
            <span class="text-xs bg-cyan-950 text-cyan-300 font-bold px-2.5 py-1 rounded-lg border border-cyan-800 shrink-0 ml-2 relative z-0">${hab.custo} Energia</span>
            ${!temEnergia ? `
                <div class="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex items-center justify-center gap-2 z-10">
                    <span class="text-xl">🔒</span>
                    <span class="text-xs font-bold text-red-400 uppercase tracking-wider">Energia Insuficiente (${hab.custo})</span>
                </div>
            ` : ''}
        `;
        grid.appendChild(div);
    });

    document.getElementById('modalHabilidades').classList.remove('hidden');
}

function fecharModalHabilidades() {
    document.getElementById('modalHabilidades').classList.add('hidden');
}

function usarHabilidade(op) {
    const p = gameState.player;
    const target = gameState.bossAtivo ? gameState.boss : gameState.inimigo;
    const isBoss = gameState.bossAtivo;

    const custos = {1: 3, 2: 4, 3: 4, 4: 8, 5: 6, 6: 7, 7: 10, 8: 8};
    if (p.energiaatual < custos[op]) {
        logMsg(`⚠️ Energia insuficiente!`, 'normal');
        fecharModalHabilidades();
        return;
    }

    p.energiaatual -= custos[op];
    AudioSys.playSpell();
    fecharModalHabilidades();

    switch(op) {
        case 1:
            let d20 = Math.floor(Math.random() * 20) + 1;
            let teste = d20 + p.atkpla + 2;
            let dano = Math.floor(Math.random() * p.tipdan) + 1 + p.danpla + 1;
            let targetDef = isBoss ? target.defboss : target.defini;
            if (teste >= targetDef) {
                logMsg(`✨ <b>Ataque Aprimorado acertou!</b> Causou ${dano} de dano.`, 'spell');
                if(isBoss) target.vidatual -= dano; else target.vidatualini -= dano;
            } else { logMsg(`❌ Ataque Aprimorado errou!`, 'normal'); }
            break;
        case 2:
            logMsg(`🛡️ <b>Postura de Contra-Ataque Especial ativada!</b> (Reage com 2x ataques)`, 'spell');
            gameState.tipoContraAtaque = 2;
            break;
        case 3:
            curarPlayer(6);
            logMsg(`💚 <b>Feitiço de Cura!</b> Restaurou +6 de Vida.`, 'player');
            break;
        case 4:
            if (!temStatus(target.status, 'Chamas')) {
                target.status.push({ tipo: 'Chamas', danoPorRodada: gameState.danchama, reducaoDef: 1, duracao: -1 });
                if(isBoss) target.defboss -= 1; else target.defini -= 1;
                logMsg(`🔥 Aplica <b>Chamas</b>! Alvo recebe ${gameState.danchama} dano/rodada e -1 Defesa.`, 'spell');
            }
            break;
        case 5:
            if (!temStatus(target.status, 'Congelado')) {
                target.status.push({ tipo: 'Congelado', danoPorRodada: 0, reducaoDef: gameState.redconge, duracao: -1 });
                if(isBoss) target.defboss -= gameState.redconge; else target.defini -= gameState.redconge;
                logMsg(`❄️ Aplica <b>Congelamento</b>! Defesa do alvo reduzida em ${gameState.redconge}.`, 'spell');
            }
            break;
        case 6:
            if (!temStatus(target.status, 'Envenenado')) {
                target.status.push({ tipo: 'Envenenado', danoPorRodada: gameState.danven, reducaoDef: 0, duracao: 4 });
                logMsg(`🧪 Aplica <b>Envenenamento</b>! ${gameState.danven} dano por 4 rodadas.`, 'spell');
            }
            break;
        case 7:
            if (!temStatus(target.status, 'Sono')) {
                let dur = Math.floor(Math.random() * gameState.rodormin) + 1;
                target.status.push({ tipo: 'Sono', danoPorRodada: 0, reducaoDef: 0, duracao: dur });
                logMsg(`💤 Aplica <b>Sono</b>! Inimigo adormecido por ${dur} rodadas.`, 'spell');
            }
            break;
        case 8:
            if (!temStatus(target.status, 'Sangramento')) {
                target.status.push({ tipo: 'Sangramento', danoPorRodada: gameState.dansang, reducaoDef: 0, duracao: 7 });
                logMsg(`🩸 Aplica <b>Sangramento</b>! ${gameState.dansang} dano por 7 rodadas.`, 'spell');
            }
            break;
    }

    if (!verificarVitoriaInimigo()) finalizarTurnoPlayer();
}

async function finalizarTurnoPlayer() {
    if (gameState.bossAtivo) {
        processarStatus(gameState.boss);
        if (verificarVitoriaInimigo()) return;
    } else {
        processarStatus(gameState.inimigo);
        if (verificarVitoriaInimigo()) return;
    }

    const p = gameState.player;
    const target = gameState.bossAtivo ? gameState.boss : gameState.inimigo;

    if (temStatus(target.status, 'Sono')) {
        logMsg(`💤 <b>${target.nome} está dormindo</b> e perdeu o turno!`, 'status');
    } else {
        let atkBonus = gameState.bossAtivo ? target.atkboss : target.atkini;
        let tipDan = gameState.bossAtivo ? target.tipdanboss : target.tipdanini;
        let danBonus = gameState.bossAtivo ? target.danoss : target.danini;

        let val = Math.floor(Math.random() * 20) + 1 + atkBonus;

        if (val >= p.defpla) {
            let dano = Math.floor(Math.random() * tipDan) + 1 + danBonus - p.rd;
            if (dano < 0) dano = 0;
            p.vidaatualpla -= dano;
            if (p.vidaatualpla < 0) p.vidaatualpla = 0;
            logMsg(`👹 <b>${target.nome} atacou!</b> Causou ${dano} de dano!`, 'enemy');
        } else {
            logMsg(`🛡️ <b>${target.nome} errou o ataque!</b>`, 'normal');
            if (gameState.tipoContraAtaque === 1) {
                if (executarContraAtaque(1)) return;
            } else if (gameState.tipoContraAtaque === 2) {
                if (executarContraAtaque(2)) return;
            }
        }
    }

    gameState.tipoContraAtaque = 0;

    if (p.vidaatualpla <= 0) {
        if (gameState.auraMonstroAtiva) {
            p.vidaatualpla = p.vidamaxpla;
            gameState.auraMonstroAtiva = false;
            let idx = p.itensInventario.findIndex(i => i.nome === "Aura do Monstro");
            if (idx > -1) p.itensInventario.splice(idx, 1); // Consome o item
            
            logMsg(`🌟 <b>AURA DO MONSTRO!</b> Você retornou atraves da morte!`, 'crit');
            atualizarTela();
            return;
        }

        await salvarPontuacao();
        document.getElementById('goTotalMortos').innerText = gameState.mortosTotais;

    gameState.rodada++;
    atualizarTela();
}

function abrirModalLoot() {
    const container = document.getElementById('cardsLootContainer');
    container.innerHTML = '';

    let escolhidos = [];
    while (escolhidos.length < 3) {
        let rand = CATALOGO_ITENS[Math.floor(Math.random() * CATALOGO_ITENS.length)];
        if (!escolhidos.includes(rand)) escolhidos.push(rand);
    }

    escolhidos.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-slate-950 border border-slate-800 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between group text-center";
        card.onclick = () => aplicarItemLoot(item);

        card.innerHTML = `
            <div>
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-xl mx-auto mb-3 border border-amber-500/30 group-hover:scale-105 transition bg-slate-900 shadow-md" alt="${item.nome}">
                <h4 class="font-bold text-amber-400 text-sm mb-1">${item.nome}</h4>
                <p class="text-xs text-slate-400">${item.desc}</p>
            </div>
            <button class="mt-4 py-1.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded border border-amber-500/40 group-hover:bg-amber-500 group-hover:text-slate-950 transition">Equipar</button>
        `;
        container.appendChild(card);
    });
    document.getElementById('modalLoot').classList.remove('hidden');
}

function aplicarItemLoot(item) {
    item.efeito(gameState.player);
    gameState.player.itensInventario.push({ nome: item.nome, img: item.img });
    logMsg(`🎁 Item Equipado: <b>${item.nome}</b> (${item.desc})`, 'system');
    
    gameState.saquesRestantes--;
    if (gameState.saquesRestantes > 0) {
        logMsg(`🍽️ <b>Pote Guloso:</b> Você pode escolher mais 1 item!`, 'system');
        abrirModalLoot(); // Abre novamente com novos itens
        return;
    }

    document.getElementById('modalLoot').classList.add('hidden');
    atualizarTela();
}

function dropItemBoss() {
    const container = document.getElementById('cardsLootContainer');
    container.innerHTML = '';
    const itensSorteados = [];
    const copiaCatalogo = [...catalogoItensBoss];

    for (let i = 0; i < 3; i++) {
        if (copiaCatalogo.length === 0) break;
        const indexAleatorio = Math.floor(Math.random() * copiaCatalogo.length);
        itensSorteados.push(copiaCatalogo.splice(indexAleatorio, 1)[0]);
    }
    itensSorteados.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-slate-950 border border-red-800 hover:border-red-500 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between group text-center shadow-lg hover:shadow-red-500/20";
        
        card.onclick = () => {
            item.efeito(gameState.player);
            gameState.player.itensInventario.push({ nome: item.nome, img: item.img });
            logMsg(`👑 Drop do Boss Equipado: <b>${item.nome}</b> (${item.desc})`, 'crit');
            
            gameState.saquesRestantes--;
            if (gameState.saquesRestantes > 0) {
                logMsg(`🍽️ <b>Pote Guloso:</b> Você pode escolher mais 1 item de boss!`, 'system');
                card.remove(); // Remove apenas o card escolhido da tela
                return;
            }
        
            document.getElementById('modalLoot').classList.add('hidden');
            atualizarTela();
        };

        card.innerHTML = `
            <div>
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-xl mx-auto mb-3 border-2 border-red-500/50 group-hover:scale-105 transition bg-slate-900 shadow-md" alt="${item.nome}">
                <h4 class="font-bold text-red-400 text-sm mb-1">${item.nome}</h4>
                <p class="text-xs text-slate-400">${item.desc}</p>
            </div>
            <button class="mt-4 py-1.5 bg-red-500/20 text-red-300 font-bold text-xs rounded border border-red-500/40 group-hover:bg-red-500 group-hover:text-white transition">Equipar Boss Drop</button>
        `;
        container.appendChild(card);
    });

    document.getElementById('modalLoot').classList.remove('hidden');
}
function reiniciarJogo() { location.reload(); }

function atualizarTela() {
    const p = gameState.player;
    const ini = gameState.inimigo;
    const boss = gameState.boss;
    const isBoss = gameState.bossAtivo;

    const setTexto = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.innerText = texto;
    };

    setTexto('txtProgAmbiente', `${gameState.inimigosParaAmbiente}/2`);
    setTexto('txtAbates', gameState.mortosTotais);
    setTexto('txtRodada', gameState.rodada);

    setTexto('playerClasseBadge', p.classeNome);
    setTexto('txtPlayerVida', `${p.vidaatualpla} / ${p.vidamaxpla}`);
    
    const barPVida = document.getElementById('barPlayerVida');
    if (barPVida) barPVida.style.width = `${Math.max(0, (p.vidaatualpla / p.vidamaxpla) * 100)}%`;

    setTexto('txtPlayerEnergia', `${p.energiaatual} / ${p.energiamax}`);
    const barPEnergia = document.getElementById('barPlayerEnergia');
    if (barPEnergia) barPEnergia.style.width = `${Math.max(0, (p.energiaatual / p.energiamax) * 100)}%`;

    setTexto('attrPlayerAtk', formatarModificador(p.atkpla));
    setTexto('attrPlayerDano', formatarModificador(p.danpla));
    setTexto('attrPlayerDef', p.defpla);
    setTexto('attrPlayerRD', p.rd);
    setTexto('attrPlayerDado', `1d${p.tipdan}`);
    setTexto('attrPlayerCrit', p.critico);

    const cardInimigo = document.getElementById('cardInimigoContainer');

    if (isBoss) {
        if (cardInimigo) cardInimigo.className = "bg-slate-900/95 border-2 border-red-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur relative overflow-hidden glow-red";
        
        setTexto('inimigoTipoBadge', "BOSS");
        const badge = document.getElementById('inimigoTipoBadge');
        if (badge) badge.className = "text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded";

        setTexto('inimigoNome', boss.nome);
        setTexto('txtInimigoVida', `${boss.vidatual} / ${boss.vidamax}`);
        
        const barIVida = document.getElementById('barInimigoVida');
        if (barIVida) barIVida.style.width = `${Math.max(0, (boss.vidatual / boss.vidamax) * 100)}%`;

        setTexto('attrInimigoAtk', formatarModificador(boss.atkboss));
        setTexto('attrInimigoDano', formatarModificador(boss.danoss));
        setTexto('attrInimigoDef', boss.defboss);
        setTexto('attrInimigoDado', `1d${boss.tipdanboss}`);
        
        if (typeof renderBadgesStatus === 'function') renderBadgesStatus(boss.status || []);
    } else {
        if (cardInimigo) cardInimigo.className = "bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-xl backdrop-blur relative overflow-hidden";
        
        setTexto('inimigoTipoBadge', "Inimigo");
        const badge = document.getElementById('inimigoTipoBadge');
        if (badge) badge.className = "text-[10px] uppercase font-bold bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded";

        setTexto('inimigoNome', ini.nome);
        setTexto('txtInimigoVida', `${ini.vidatualini} / ${ini.vidamaxini}`);
        
        const barIVida = document.getElementById('barInimigoVida');
        if (barIVida) barIVida.style.width = `${Math.max(0, (ini.vidatualini / ini.vidamaxini) * 100)}%`;

        setTexto('attrInimigoAtk', formatarModificador(ini.atkini));
        setTexto('attrInimigoDano', formatarModificador(ini.danini));
        setTexto('attrInimigoDef', ini.defini);
        setTexto('attrInimigoDado', `1d${ini.tipdanini}`);
        
        if (typeof renderBadgesStatus === 'function') renderBadgesStatus(ini.status || []);
    }

    const oponente = isBoss ? boss : ini;
    const imgElement = document.getElementById('inimigoAvatarImg') || document.getElementById('inimigoAvatar');

    if (imgElement && oponente && oponente.imagem) {
        if (imgElement.tagName === 'IMG') {
            imgElement.src = oponente.imagem;
        }
    }
}

function renderBadgesStatus(statusArray) {
    const container = document.getElementById('containerStatusInimigo');
    container.innerHTML = '';
    if (!statusArray || statusArray.length === 0) {
        container.innerHTML = '<span class="text-xs text-slate-400 italic">Nenhum efeito ativo</span>';
        return;
    }
    statusArray.forEach(s => {
        const span = document.createElement('span');
        let colorClass = "bg-slate-800 text-slate-300 border-slate-600";
        if (s.tipo === 'Chamas') colorClass = "bg-orange-950 text-orange-300 border-orange-800";
        if (s.tipo === 'Congelado') colorClass = "bg-sky-950 text-sky-300 border-sky-800";
        if (s.tipo === 'Envenenado') colorClass = "bg-lime-950 text-lime-300 border-lime-800";
        if (s.tipo === 'Sono') colorClass = "bg-indigo-950 text-indigo-300 border-indigo-800";
        if (s.tipo === 'Sangramento') colorClass = "bg-rose-950 text-rose-300 border-rose-800";
        let durTxt = s.duracao === -1 ? "Infinito" : `${s.duracao}t`;
        span.className = `text-[10px] font-bold border px-2 py-0.5 rounded-lg flex items-center gap-1 ${colorClass}`;
        span.innerText = `${s.tipo} (${durTxt})`;
        container.appendChild(span);
    });
}

async function registrar() {
    let u = document.getElementById('inputUser').value.trim();
    let p = document.getElementById('inputPass').value.trim();
    if (!u || !p) return alert("Preencha usuário e senha!");
    
    let userKey = u.toLowerCase();

    try {
        const userDoc = await db.collection('usuarios').doc(userKey).get();
        if (userDoc.exists) {
            return alert("Este nome de usuário já existe!");
        }

        await db.collection('usuarios').doc(userKey).set({
            nome: u,
            senha: p
        });

        alert("Conta criada com sucesso! Você já pode entrar.");
    } catch (error) {
        console.error("Erro ao registrar:", error);
        alert("Erro ao criar conta no servidor.");
    }
}

async function logar() {
    let u = document.getElementById('inputUser').value.trim();
    let p = document.getElementById('inputPass').value.trim();
    if (!u || !p) return alert("Preencha usuário e senha!");
    
    let userKey = u.toLowerCase();

    try {
        const userDoc = await db.collection('usuarios').doc(userKey).get();
        if (userDoc.exists && userDoc.data().senha === p) {
            currentUser = userDoc.data().nome;
            localStorage.setItem('usuarioLogado', currentUser);

            document.getElementById('telaLogin').classList.add('hidden');
            document.getElementById('telaSelecaoClasse').classList.remove('hidden');
        } else {
            alert("Usuário ou senha incorretos!");
        }
    } catch (error) {
        console.error("Erro ao logar:", error);
        alert("Erro ao realizar login no servidor.");
    }
}

async function salvarPontuacao() {
    if (!currentUser) return;

    const userDocRef = db.collection('placar').doc(currentUser.toLowerCase());

    try {
        const docSnap = await userDocRef.get();

        if (docSnap.exists) {
            const pontuacaoAntiga = docSnap.data().rodada || 0;

            if (gameState.mortosTotais > pontuacaoAntiga) {
                await userDocRef.set({
                    user: currentUser,
                    classe: gameState.player.classeNome,
                    rodada: gameState.mortosTotais,
                    stats: gameState.player,
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log("Novo recorde pessoal salvo com sucesso!");
            } else {
                console.log("Pontuação menor ou igual ao recorde anterior. Não foi atualizado.");
            }
        } else {
            await userDocRef.set({
                user: currentUser,
                classe: gameState.player.classeNome,
                rodada: gameState.mortosTotais,
                stats: gameState.player,
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Primeira pontuação salva no Firebase!");
        }
    } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
    }
}

async function abrirPlacar() {
    const lista = document.getElementById('listaPlacar');
    lista.innerHTML = '<p class="text-center text-slate-400 text-sm my-4">Carregando placar online...</p>';
    document.getElementById('modalPlacar').classList.remove('hidden');

    try {
        const snapshot = await db.collection('placar')
            .orderBy('rodada', 'desc')
            .limit(50)
            .get();

        lista.innerHTML = '';
        dadosPlacarOnline = [];

        if (snapshot.empty) {
            lista.innerHTML = '<p class="text-center text-slate-500 text-sm mt-4">Nenhuma pontuação registrada ainda.</p>';
            return;
        }

        let index = 0;
        snapshot.forEach(doc => {
            const run = doc.data();
            dadosPlacarOnline.push(run);

            const div = document.createElement('div');
            div.className = "bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer flex justify-between items-center transition group";
            
            const currentIndex = index;
            div.onclick = () => mostrarDetalhesJogador(currentIndex);
            
            div.innerHTML = `
                <div class="flex items-center gap-3 pointer-events-none">
                    <span class="text-amber-500 font-black text-lg">#${currentIndex + 1}</span>
                    <div>
                        <div class="font-bold text-slate-200 group-hover:text-amber-400 transition">${run.user}</div>
                        <div class="text-[10px] text-slate-500">${run.classe}</div>
                    </div>
                </div>
                <div class="font-black text-indigo-400 text-xl pointer-events-none">${run.rodada}</div>
            `;
            lista.appendChild(div);
            index++;
        });

    } catch (error) {
        console.error("Erro ao carregar placar:", error);
        lista.innerHTML = '<p class="text-center text-red-400 text-sm mt-4">Erro ao carregar o placar online.</p>';
    }
}

function fecharPlacar() {
    document.getElementById('modalPlacar').classList.add('hidden');
}

function mostrarDetalhesJogador(index) {
    let run = dadosPlacarOnline[index];
    if (!run) return;

    document.getElementById('detNome').innerText = run.user;
    document.getElementById('detClasse').innerText = run.classe;
    document.getElementById('detHp').innerText = `${run.stats.vidaatualpla}/${run.stats.vidamaxpla}`;
    document.getElementById('detEnergia').innerText = `${run.stats.energiaatual}/${run.stats.energiamax}`;
    document.getElementById('detAtk').innerText = run.stats.atkpla;
    document.getElementById('detDano').innerText = run.stats.danpla;
    document.getElementById('detDef').innerText = run.stats.defpla;
    document.getElementById('detRd').innerText = run.stats.rd;
    document.getElementById('detTipDan').innerText = `d${run.stats.tipdan}`;
    document.getElementById('detCrit').innerText = run.stats.critico;

    const divItens = document.getElementById('detItens');
    divItens.innerHTML = '';
    
    if (!run.stats.itensInventario || run.stats.itensInventario.length === 0) {
        divItens.innerHTML = '<span class="text-slate-500 text-xs">Nenhum item coletado.</span>';
    } else {
        run.stats.itensInventario.forEach(item => {
            const imgTag = document.createElement('img');
            imgTag.src = item.img || 'imagens/imagensitem/oculosaventureiro.png';
            imgTag.className = "w-8 h-8 rounded border border-slate-700 bg-slate-800 object-cover";
            imgTag.title = item.nome || item;
            divItens.appendChild(imgTag);
        });
    }

    document.getElementById('modalDetalhes').classList.remove('hidden');
}
