// ==========================================================================
// PORTAL EBD - BANCO DE DADOS INTEGRADO DE MEMBROS E CONTROLE DE CHAMADA
// ==========================================================================

const METRICAS_CLASSE_TOTAL = 50; // Meta fixa de alunos para a barra de progresso

// 1. CARGA INICIAL DA CLASSE - Lista Oficial de Membros
const MEMBROS_PRE_CADASTRADOS = [
    // LÍDERES / PROFESSORES
    { nome: "Luiz Kalizak", cargo: "Líder/Professor" },
    { nome: "Luiz Gustavo Machado Kalizak", cargo: "Líder/Professor" },
    { nome: "Michael", cargo: "Líder/Professor" },
    { nome: "Eclair", cargo: "Líder/Professor" },
    { nome: "Júnior", cargo: "Líder/Professor" },
    { nome: "Junior", cargo: "Líder/Professor" },
    { nome: "Débora", cargo: "Líder/Professor" },
    { nome: "Debora", cargo: "Líder/Professor" },

    // ALUNOS / ALUNAS
    { nome: "Nadia Pezzini", cargo: "Aluno" },
    { nome: "Emily Júlia", cargo: "Aluno" },
    { nome: "Emily Julia", cargo: "Aluno" },
    { nome: "Camille Mikaele", cargo: "Aluno" },
    { nome: "Kauan", cargo: "Aluno" },
    { nome: "Paloma Pezzini", cargo: "Aluno" },
    { nome: "Ana", cargo: "Aluno" },
    { nome: "Arthur Henrique", cargo: "Aluno" },
    { nome: "Helen", cargo: "Aluno" },
    { nome: "Eliel", cargo: "Aluno" },
    { nome: "Guilherme", cargo: "Aluno" },
    { nome: "Henrique", cargo: "Aluno" },
    { nome: "Jonatas JM", cargo: "Aluno" },
    { nome: "Luiz Arthur", cargo: "Aluno" },
    { nome: "Eduarda", cargo: "Aluno" },
    { nome: "Raíssa", cargo: "Aluno" },
    { nome: "Raissa", cargo: "Aluno" },
    { nome: "Sara", cargo: "Aluno" },
    { nome: "Tarcila", cargo: "Aluno" },
    { nome: "Caliel", cargo: "Aluno" },
    { nome: "Silvano", cargo: "Aluno" },
    { nome: "Soare", cargo: "Aluno" },
    { nome: "Cauê", cargo: "Aluno" },
    { nome: "Caue", cargo: "Aluno" },
    { nome: "Camila", cargo: "Aluno" },
    { nome: "Christian", cargo: "Aluno" },
    { nome: "Duda", cargo: "Aluno" },
    { nome: "Felipe", cargo: "Aluno" },
    { nome: "Gustavo", cargo: "Aluno" },
    { nome: "Jonas", cargo: "Aluno" },
    { nome: "Ketlin Domingos", cargo: "Aluno" },
    { nome: "Lara", cargo: "Aluno" },
    { nome: "Letícia", cargo: "Aluno" },
    { nome: "Leticia", cargo: "Aluno" },
    { nome: "Nadiele", cargo: "Aluno" },
    { nome: "Horlana", cargo: "Aluno" },
    { nome: "Rayane", cargo: "Aluno" },
    { nome: "Rayane Oliveira", cargo: "Aluno" },
    { nome: "Sara Fernanda", cargo: "Aluno" },
    { nome: "Suzane", cargo: "Aluno" },
    { nome: "Vanessa", cargo: "Aluno" }
];

// Gerador automático de Domingos do ano letivo de 2026
function gerarListaDomingos2026() {
    let domingos = [];
    let dataFoco = new Date(2026, 6, 5); // 5 de Julho de 2026
    
    const temasRevista = [
        "Lição 1: O Livro de Juízes: quando cada um fazia o que parecia certo",
        "Lição 2: Fidelidade a Deus: uma questão de escolha",
        "Lição 3: Clamor e libertação: a liderança de Otniel",
        "Lição 4: Eude e Sangar: Deus usa os improváveis",
        "Lição 5: Débora e Baraque: união para fazer a obra de Deus",
        "Lição 6: Gideão: Deus transforma a insegurança em coragem",
        "Lição 7: O fim da liderança de Gideão e o governo de Abimeleque",
        "Lição 8: Jefté: de rejeitado a libertador",
        "Lição 9: Sansão: a força e a fraqueza de um jovem",
        "Lição 10: Sansão: entre vitórias e derrotas",
        "Lição 11: Crise espiritual e falsa religiosidade",
        "Lição 12: Tempos de decadência moral e maldade",
        "Lição 13: Esperança em meio ao caos: aguardando a vinda do rei"
    ];

    for (let i = 0; i < 22; i++) {
        let diaStr = String(dataFoco.getDate()).padStart(2, '0');
        let mesStr = String(dataFoco.getMonth() + 1).padStart(2, '0');
        let dataFormatada = `${diaStr}/${mesStr}/${dataFoco.getFullYear()}`;
        
        let temaPadrao = temasRevista[i] || `EBD Dominical - Estudo Bíblico Continuado (Classe Jovens)`;
        
        domingos.push({
            id: 202600 + i,
            data: dataFormatada,
            tema: `${dataFormatada} - ${temaPadrao}`,
            pergunta: "Quais lições práticas e espirituais você absorveu na ministração de hoje?",
            observacao: "Nenhuma anotação extra realizada pelos professores.",
            status: i === 0 ? "concluida" : (i === 1 ? "aberta" : "agendada")
        });
        dataFoco.setDate(dataFoco.getDate() + 7);
    }
    return domingos;
}

// Inicializações seguras de Bancos de Dados locais
if (!localStorage.getItem('bd_licoes')) {
    localStorage.setItem('bd_licoes', JSON.stringify(gerarListaDomingos2026()));
}
if (!localStorage.getItem('bd_presenças_v2')) localStorage.setItem('bd_presenças_v2', JSON.stringify({}));
if (!localStorage.getItem('bd_respostas')) localStorage.setItem('bd_respostas', JSON.stringify([]));

// Garante que a lista de membros contenha todos os nomes oficiais pré-carregados
let membrosAtuais = JSON.parse(localStorage.getItem('bd_membros')) || [];
if (membrosAtuais.length === 0 || !membrosAtuais.some(m => m.nome === "Horlana")) {
    localStorage.setItem('bd_membros', JSON.stringify(MEMBROS_PRE_CADASTRADOS));
}

function alternarAbasAuth(queroCadastrar) {
    document.getElementById('auth-login-view').style.display = queroCadastrar ? 'none' : 'block';
    document.getElementById('auth-cadastro-view').style.display = queroCadastrar ? 'block' : 'none';
    fecharAlertas();
}

function normalizarTextoParaBusca(txt) {
    return txt.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// 2. SISTEMA DE LOGIN
function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('login-alert', 'Por favor, informe seu nome.');

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    let nomeBusca = normalizarTextoParaBusca(nomeInput);
    
    let usuario = membros.find(m => normalizarTextoParaBusca(m.nome) === nomeBusca);

    if (!usuario) {
        return mostrarAlerta('login-alert', 'Nome não localizado na lista oficial. Verifique a grafia.');
    }

    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    iniciarSessao();
}

function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('cadastro-alert', 'Por favor, digite seu nome completo.');

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        return mostrarAlerta('cadastro-alert', 'Este usuário já consta no sistema. Use a tela de login.');
    }

    const novoMembro = { nome: nomeInput, cargo: "Aluno" };
    membros.push(novoMembro);
    localStorage.setItem('bd_membros', JSON.stringify(membros));

    localStorage.setItem('usuarioLogado', novoMembro.nome);
    localStorage.setItem('perfil', 'aluno');
    iniciarSessao();
}

function iniciarSessao() {
    const nome = localStorage.getItem('usuarioLogado');
    const perfil = localStorage.getItem('perfil');

    document.getElementById('nome-usuario-logado').innerText = nome;
    const badge = document.getElementById('badge-perfil');
    
    badge.innerText = perfil === 'professor' ? 'Professor / Líder' : 'Aluno';
    badge.className = perfil === 'professor' ? 'badge-role role-professor' : 'badge-role role-aluno';

    document.getElementById('nav-principal').style.display = 'flex';
    document.getElementById('tela-auth').classList.remove('ativa');
    document.getElementById('tela-dashboard').classList.add('ativa');

    // Mostra painel de postagem apenas para os líderes
    document.getElementById('painel-cadastro-licao').style.display = perfil === 'professor' ? 'block' : 'none';

    atualizarMétricasFrequência();
    atualizarFeedLicoes();
    atualizarAbaExercicios();
    listarMembrosNaTela();
}

function atualizarMétricasFrequência() {
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    const licaoAtiva = licoes.find(l => l.status === 'aberta') || licoes[0];
    
    let totalPresentes = 0;
    if (licaoAtiva && dPresenças[licaoAtiva.id]) {
        totalPresentes = dPresenças[licaoAtiva.id].length;
    }

    let pct = ((totalPresentes / METRICAS_CLASSE_TOTAL) * 100).toFixed(0);
    if (pct > 100) pct = 100;

    document.getElementById('txt-meta-alunos').innerText = METRICAS_CLASSE_TOTAL;
    document.getElementById('txt-presentes-hoje').innerText = totalPresentes;
    document.getElementById('txt-porcentagem-hoje').innerText = `${pct}%`;
    document.getElementById('barra-progresso-frequencia').style.width = `${pct}%`;
}

// 3. POSTAGEM DE TEMAS ADICIONAIS PELOS LÍDERES
function publicarNovaLicao() {
    const tema = document.getElementById('post-tema').value.trim();
    const perguntaInput = document.getElementById('post-pergunta').value.trim();
    const observacao = document.getElementById('post-observacao').value.trim() || "Nenhuma anotação extra.";
    const status = document.getElementById('post-status').value;

    if (!tema || !perguntaInput) {
        alert('Por favor, informe o Tema da aula e a Pergunta de fixação.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const novaAula = {
        id: Date.now(),
        tema: tema,
        pergunta: perguntaInput,
        observacao: observacao,
        status: status
    };

    licoes.unshift(novaAula);
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    
    document.getElementById('post-tema').value = '';
    document.getElementById('post-pergunta').value = '';
    document.getElementById('post-observacao').value = '';

    alert('Nova aula adicionada e postada com sucesso!');
    atualizarFeedLicoes();
    atualizarAbaExercicios();
    atualizarMétricasFrequência();
}

function mudarStatusLicaoRemoto(licaoId, novoStatus) {
    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.map(l => {
        if (l.id === licaoId) l.status = novoStatus;
        return l;
    });
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    atualizarFeedLicoes();
    atualizarAbaExercicios();
    atualizarMétricasFrequência();
}

// 4. CRONOGRAMA DE LIÇÕES
function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};

    if (licoes.length === 0) {
        feed.innerHTML = '<p style="color:var(--dourado-claro);">Nenhuma lição mapeada.</p>';
        return;
    }

    feed.innerHTML = '';

    licoes.forEach(licao => {
        const listaPresencas = dPresenças[licao.id] || [];
        const alunoJaDeuPresenca = listaPresencas.includes(nomeUser);

        let badgeClass = `status-${licao.status}`;
        let labelStatus = licao.status === 'agendada' ? '📅 Agendada' : (licao.status === 'aberta' ? '🔓 Aberta para Chamada' : '🔒 Concluída');

        let painelAcoesProfessor = '';
        if (perfil === 'professor') {
            painelAcoesProfessor = `
                <div style="margin-top:10px; border-top:1px dashed rgba(212,175,55,0.2); padding-top:8px;">
                    <span style="font-size:0.75rem; color:var(--dourado-claro); display:block;">Controle do Líder:</span>
                    ${licao.status !== 'aberta' ? `<button class="btn-acao-aula btn-abrir" onclick="mudarStatusLicaoRemoto(${licao.id}, 'aberta')">Abrir Presenças</button>` : ''}
                    ${licao.status !== 'concluida' ? `<button class="btn-acao-aula btn-fechar" onclick="mudarStatusLicaoRemoto(${licao.id}, 'concluida')">Concluir Aula</button>` : ''}
                </div>`;
        }

        let interfaceChamada = '';
        if (licao.status === 'aberta') {
            interfaceChamada = `
                <div class="atividade-box" style="border-left-color: var(--sucesso); margin-top: 10px;">
                    <p style="font-weight: bold; margin-bottom: 5px;">Ata de Presença Dominical:</p>
                    <button class="btn-principal" style="background-color: var(--sucesso); color: var(--azul-escuro);" ${alunoJaDeuPresenca ? 'disabled' : ''} onclick="assinarChamadaEletronica(${licao.id})">
                        ${alunoJaDeuPresenca ? '✅ SUA PRESENÇA FOI REGISTRADA' : 'Assinar Chamada Virtual'}
                    </button>
                    <p style="font-size:0.85rem; color:white; margin-top:10px;">👥 Presentes nesta aula: ${listaPresencas.join(', ') || 'Nenhum participante ainda.'}</p>
                </div>`;
        } else if (licao.status === 'concluida') {
            interfaceChamada = `<p style="font-size:0.85rem; margin-top:8px; color:#aaa;">🔒 Aula encerrada. Frequência final: ${listaPresencas.length} alunos.</p>`;
        } else {
            interfaceChamada = `<p style="font-size:0.85rem; margin-top:8px; color:var(--alerta);">📅 Conteúdo programático bloqueado até a data da aula.</p>`;
        }

        feed.innerHTML += `
            <div style="background: var(--azul-medio); padding:1.2rem; border-radius:8px; margin-bottom:1rem; border:1px solid rgba(212,175,55,0.15);">
                <span class="status-indicator ${badgeClass}">${labelStatus}</span>
                <h3 style="color:var(--dourado); font-size:1.15rem; margin-top:3px;">${licao.tema}</h3>
                <p style="font-size:0.9rem; color:#edf2f7; margin-top:5px;"><em>Obs: ${licao.observacao}</em></p>
                ${interfaceChamada}
                ${painelAcoesProfessor}
            </div>
        `;
    });
}

// 5. ABA DE EXERCÍCIOS DE FIXAÇÃO
function atualizarAbaExercicios() {
    const container = document.getElementById('feed-exercicios');
    if (!container) return;

    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];
    const nomeUser = localStorage.getItem('usuarioLogado');

    const licoesComAtividade = licoes.filter(l => l.status !== 'agendada');

    if (licoesComAtividade.length === 0) {
        container.innerHTML = '<p style="color:var(--dourado-claro); padding:10px;">Nenhum exercício liberado no momento.</p>';
        return;
    }

    container.innerHTML = '';

    licoesComAtividade.forEach(licao => {
        const alunoJaRespondeu = respostas.some(r => r.licaoId === licao.id && r.aluno === nomeUser);
        const respostasDestaLicao = respostas.filter(r => r.licaoId === licao.id);

        let htmlRespostasMembros = '';
        if (respostasDestaLicao.length > 0) {
            let listaItens = respostasDestaLicao.map(r => `
                <div style="background:rgba(0,0,0,0.2); padding:6px 10px; border-radius:4px; margin-bottom:4px; font-size:0.85rem;">
                    <strong style="color:var(--dourado);">${r.aluno}:</strong> <span style="color:white;">"${r.texto}"</span>
                </div>
            `).join('');
            htmlRespostasMembros = `
                <div style="margin-top:12px; border-top:1px solid rgba(212,175,55,0.1); padding-top:8px;">
                    <span style="font-size:0.8rem; color:var(--dourado-claro); display:block; margin-bottom:4px;">Respostas Enviadas:</span>
                    ${listaItens}
                </div>`;
        }

        let campoInteracao = '';
        if (licao.status === 'concluida') {
            campoInteracao = `<p style="color:#aaa; font-size:0.85rem; margin-top:5px;">🔒 Exercício arquivado junto com a lição.</p>`;
        } else if (alunoJaRespondeu) {
            campoInteracao = `<p style="color:var(--sucesso); font-size:0.85rem; font-weight:bold; margin-top:5px;">✅ Sua resposta foi enviada com sucesso!</p>`;
        } else {
            campoInteracao = `
                <div style="margin-top:10px; display:flex; gap:8px;">
                    <input type="text" id="resposta-input-${licao.id}" placeholder="Digite sua resposta aqui..." style="flex:1; padding:6px; border-radius:4px; border:1px solid var(--dourado); color:white; background:var(--azul-escuro);">
                    <button class="btn-principal" style="width:auto; padding:6px 15px; margin:0;" onclick="enviarExercicio(${licao.id})">Enviar</button>
                </div>`;
        }

        container.innerHTML += `
            <div style="background: var(--azul-medio); border-left: 4px solid var(--dourado); padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
                <h4 style="color:white; font-size:1rem; margin-bottom:4px;">📋 Exercício: ${licao.tema.split(' - ')[1] || licao.tema}</h4>
                <p style="color:#edf2f7; font-size:0.9rem; background:rgba(255,255,255,0.05); padding:8px; border-radius:4px;"><strong>Pergunta:</strong> ${licao.pergunta}</p>
                ${campoInteracao}
                ${htmlRespostasMembros}
            </div>
        `;
    });
}

function enviarExercicio(licaoId) {
    const input = document.getElementById(`resposta-input-${licaoId}`);
    if (!input || !input.value.trim()) return alert('Por favor, digite uma resposta antes de enviar.');

    const nomeUser = localStorage.getItem('usuarioLogado');
    let respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];

    respostas.push({
        licaoId: licaoId,
        aluno: nomeUser,
        texto: input.value.trim()
    });

    localStorage.setItem('bd_respostas', JSON.stringify(respostas));
    alert('Resposta de fixação gravada!');
    atualizarAbaExercicios();
}

function assinarChamadaEletronica(licaoId) {
    const nome = localStorage.getItem('usuarioLogado');
    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    if (!dPresenças[licaoId]) dPresenças[licaoId] = [];

    if (!dPresenças[licaoId].includes(nome)) {
        dPresenças[licaoId].push(nome);
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
        alert('Presença registrada com sucesso!');
        atualizarFeedLicoes();
        atualizarMétricasFrequência();
    }
}

// 6. DIÁRIO DE CLASSE (EXIBIÇÃO COMPLETA)
function listarMembrosNaTela() {
    const container = document.getElementById('lista-oficial-membros');
    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    
    if (membros.length === 0) { 
        container.innerHTML = '<p style="color:var(--dourado-claro); padding:10px;">Nenhum participante cadastrado.</p>'; 
        return; 
    }
    
    container.innerHTML = '';
    membros.forEach(m => {
        const classeBadge = m.cargo === 'Líder/Professor' ? 'role-professor' : 'role-aluno';
        container.innerHTML += `
            <div class="membro-row" style="color:white; display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(212,175,55,0.1);">
                <span>👤 ${m.nome}</span>
                <span class="badge-role ${classeBadge}">${m.cargo}</span>
            </div>`;
    });
}

// Navegação entre abas
function navegarPara(telaId) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(telaId).classList.add('ativa');
    fecharAlertas();
}

function mostrarAlerta(idElemento, msg) {
    const el = document.getElementById(idElemento);
    el.innerText = msg;
    el.style.display = 'block';
}

function fecharAlertas() { document.querySelectorAll('.alert').forEach(a => a.style.display = 'none'); }

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('perfil');
    window.location.reload();
}

window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) iniciarSessao();
};
