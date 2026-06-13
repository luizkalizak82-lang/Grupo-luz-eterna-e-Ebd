// ==========================================================================
// ARQUIVO LÓGICO COMPLETO: MAPEAMENTO DE PERMISSÕES, CALENDÁRIO E OBSERVAÇÕES
// ==========================================================================

// Lista oficial com nomes exatos e tolerância ampla a erros de digitação (ignora maiúsculas/minúsculas)
const LISTA_LIDERES_E_PROFESSORES = [
    "luiz gustavo machado kalizak", 
    "michael", 
    "eclair", 
    "júnior", 
    "junior", 
    "débora",
    "debora"
];

const METRICAS_CLASSE_TOTAL = 50; // Quantidade de alunos meta fixada no painel

// Gerador automático de Domingos do ano letivo de 2026 para preencher a plataforma
function gerarListaDomingos2026() {
    let domingos = [];
    // Data base: Primeiro Domingo de Julho de 2026 (Início do 3º Trimestre refletido na revista)
    let dataFoco = new Date(2026, 6, 5); // 5 de Julho de 2026
    
    // Títulos sequenciais da revista fornecida na imagem do usuário
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

    for (let i = 0; i < 22; i++) { // Cobre os domingos até o final do ano
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
            status: i === 0 ? "concluida" : (i === 1 ? "aberta" : "agendada") // Inicializa as primeiras abertas/concluídas
        });
        
        // Avança 7 dias para o próximo domingo
        dataFoco.setDate(dataFoco.getDate() + 7);
    }
    return domingos;
}

// Inicializações seguras de Bancos de Dados locais
if (!localStorage.getItem('bd_licoes')) {
    localStorage.setItem('bd_licoes', JSON.stringify(gerarListaDomingos2026()));
}
if (!localStorage.getItem('bd_presenças_v2')) localStorage.setItem('bd_presenças_v2', JSON.stringify({}));
if (!localStorage.getItem('bd_membros')) localStorage.setItem('bd_membros', JSON.stringify([]));
if (!localStorage.getItem('bd_respostas')) localStorage.setItem('bd_respostas', JSON.stringify([]));

function alternarAbasAuth(queroCadastrar) {
    document.getElementById('auth-login-view').style.display = queroCadastrar ? 'none' : 'block';
    document.getElementById('auth-cadastro-view').style.display = queroCadastrar ? 'block' : 'none';
    fecharAlertas();
}

// Tratamento rigoroso de caracteres para evitar falhas com acentos e maiúsculas
function normalizarTextoParaBusca(txt) {
    return txt.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verificarSeEhProfessor(nome) {
    let nomeNormalizado = normalizarTextoParaBusca(nome);
    return LISTA_LIDERES_E_PROFESSORES.some(lider => normalizarTextoParaBusca(lider) === nomeNormalizado);
}

function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('cadastro-alert', 'Por favor, digite seu nome completo.');

    if (nomeInput.split(/\s+/).length < 2) {
        return mostrarAlerta('cadastro-alert', 'Digite nome e sobrenome por extenso para validação da ata.');
    }

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        return mostrarAlerta('cadastro-alert', 'Este usuário já está cadastrado. Vá em Fazer Login.');
    }

    const ehProf = verificarSeEhProfessor(nomeInput);
    const novoMembro = { nome: nomeInput, cargo: ehProf ? "Líder/Professor" : "Aluno" };
    
    membros.push(novoMembro);
    localStorage.setItem('bd_membros', JSON.stringify(membros));

    localStorage.setItem('usuarioLogado', novoMembro.nome);
    localStorage.setItem('perfil', ehProf ? 'professor' : 'aluno');
    iniciarSessao();
}

function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('login-alert', 'Por favor, informe seu nome completo.');

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    let usuario = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());

    // Auto-inserção de professores para evitar barreiras de acesso iniciais
    if (!usuario && verificarSeEhProfessor(nomeInput)) {
        usuario = { nome: nomeInput, cargo: "Líder/Professor" };
        membros.push(usuario);
        localStorage.setItem('bd_membros', JSON.stringify(membros));
    }

    if (!usuario) {
        return mostrarAlerta('login-alert', 'Nome não localizado. Se você for um aluno novo, faça seu cadastro primeiro.');
    }

    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
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

    // Libera o painel de escrita de matérias exclusivamente se for líder/professor
    document.getElementById('painel-cadastro-licao').style.display = perfil === 'professor' ? 'block' : 'none';

    atualizarMétricasFrequência();
    atualizarFeedLicoes();
    listarMembrosNaTela();
}

// --- SISTEMA DINÂMICO DE ATUALIZAÇÃO DA PORCENTAGEM DE PRESENÇAS ---
function atualizarMétricasFrequência() {
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    
    // Localiza a lição que está ativa/aberta no domingo corrente
    const licaoAtiva = licoes.find(l => l.status === 'aberta') || licoes[0];
    
    let totalPresentes = 0;
    if (licaoAtiva && dPresenças[licaoAtiva.id]) {
        totalPresentes = dPresenças[licaoAtiva.id].length;
    }

    let pct = ((totalPresentes / METRICAS_CLASSE_TOTAL) * 100).toFixed(0);
    if (pct > 100) pct = 100;

    // Atualiza os elementos de texto injetados na tela separada
    document.getElementById('txt-meta-alunos').innerText = METRICAS_CLASSE_TOTAL;
    document.getElementById('txt-presentes-hoje').innerText = totalPresentes;
    document.getElementById('txt-porcentagem-hoje').innerText = `${pct}%`;
    document.getElementById('barra-progresso-frequencia').style.width = `${pct}%`;
}

// --- POSTAGEM DE NOVAS MATÉRIAS PELO PROFESSOR ---
function publicarNovaLicao() {
    const tema = document.getElementById('post-tema').value.trim();
    const pergunta = document.getElementById('post-pergunta').value.trim();
    const observacao = document.getElementById('post-observacao').value.trim() || "Nenhuma anotação extra.";
    const status = document.getElementById('post-status').value;

    if (!tema || !pergunta) {
        alert('Por favor, informe pelo menos o Tema da aula e a Pergunta de fixação.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const novaAula = {
        id: Date.now(),
        tema: tema,
        pergunta: pergunta,
        observacao: observacao,
        status: status
    };

    licoes.unshift(novaAula); // Insere no topo da linha cronológica
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    
    // Reseta os inputs
    document.getElementById('post-tema').value = '';
    document.getElementById('post-pergunta').value = '';
    document.getElementById('post-observacao').value = '';

    alert('Aula e anotações gravadas e postadas com sucesso!');
    atualizarFeedLicoes();
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
    atualizarMétricasFrequência();
}

// --- CONSTRUTOR DE INTEGRAÇÃO DO FEED (CRONOGRAMA DE ESTUDOS) ---
function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    const respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];

    if (licoes.length === 0) {
        feed.innerHTML = '<p style="color:var(--dourado-claro);">Nenhum domingo mapeado no cronograma.</p>';
        return;
    }

    feed.innerHTML = '';

    licoes.forEach(licao => {
        const listaPresencas = dPresenças[licao.id] || [];
        const alunoJaDeuPresenca = listaPresencas.includes(nomeUser);
        const alunoJaRespondeu = respostas.some(r => r.licaoId === licao.id && r.aluno === nomeUser);

        let badgeClass = `status-${licao.status}`;
        let labelStatus = licao.status === 'agendada' ? '📅 Agendada' : (licao.status === 'aberta' ? '🔓 Aberta para Hoje' : '🔒 Concluída');

        let painelAcoesProfessor = '';
        if (perfil === 'professor') {
            painelAcoesProfessor = `
                <div style="margin-top:10px; border-top:1px dashed rgba(212,175,55,0.2); padding-top:8px;">
                    <span style="font-size:0.75rem; color:var(--dourado-claro); display:block;">Gerenciar Estados de Aula:</span>
                    ${licao.status !== 'aberta' ? `<button class="btn-acao-aula btn-abrir" onclick="mudarStatusLicaoRemoto(${licao.id}, 'aberta')">Abrir Presenças</button>` : ''}
                    ${licao.status !== 'concluida' ? `<button class="btn-acao-aula btn-fechar" onclick="mudarStatusLicaoRemoto(${licao.id}, 'concluida')">Concluir e Fechar</button>` : ''}
                    ${licao.status !== 'agendada' ? `<button class="btn-acao-aula" style="background:#95a5a6;" onclick="mudarStatusLicaoRemoto(${licao.id}, 'agendada')">Bloquear Entrada</button>` : ''}
                </div>`;
        }

        let interfaceConteudoEstudo = '';
        if (licao.status === 'agendada') {
            interfaceConteudoEstudo = `
                <div class="atividade-box" style="border-left-color: var(--alerta);">
                    <p style="color: var(--dourado); font-weight: bold;">📅 Estudo Bloqueado / Futuro</p>
                    <p style="font-size: 0.85rem; margin-top:4px; color:#edf2f7;">O conteúdo programático e a chamada eletrônica correspondentes a este assunto serão destravados pelos coordenadores no respectivo domingo de aula.</p>
                </div>`;
        } else if (licao.status === 'aberta') {
            if (perfil === 'aluno') {
                interfaceConteudoEstudo = `
                    <div class="atividade-box" style="border-left-color: var(--sucesso);">
                        <p style="font-weight: bold; margin-bottom: 5px;">Ata de Presença Dominical:</p>
                        <button class="btn-principal" style="background-color: var(--sucesso); color: var(--azul-escuro); margin-bottom: 1rem;" ${alunoJaDeuPresenca ? 'disabled' : ''} onclick="assinarChamadaEletronica(${licao.id})">
                            ${alunoJaDeuPresenca ? '✅ SUA PRESENÇA FOI COMPUTADA NO DIÁRIO DE CLASSE' : 'Assinar Lista de Presenças Virtual'}
                        </button>
                        <p style="margin-top:10px;"><strong>✍️ Exercício Interativo:</strong> ${licao.pergunta}</p>
                        ${alunoJaRespondeu ? '<p style="color: var(--dourado); font-weight:bold; margin-top:5px;">✅ Sua resposta foi enviada aos professores.</p>' : `
                            <div style="margin-top:0.5rem; display:flex; gap:8px;">
                                <input type="text" id="ipt-${licao.id}" placeholder="Escreva seu ponto de vista ou resposta...">
                                <button class="btn-principal" style="width:auto; padding: 0.5rem 1rem;" onclick="submeterRespostaAluno(${licao.id})">Enviar</button>
                            </div>
                        `}
                    </div>`;
            } else {
                // Visão unificada do Professor na aula corrente
                const filtrarRespostas = respostas.filter(r => r.licaoId === licao.id);
                let listaRender = filtrarRespostas.map(r => `<p style="font-size:0.85rem; padding:3px 0; border-bottom:1px dashed rgba(255,255,255,0.05)"><strong>${r.aluno}:</strong> ${r.texto}</p>`).join('');
                interfaceConteudoEstudo = `
                    <div class="atividade-box">
                        <p><strong>Anotações Internas do Líder:</strong> <span style="font-style:italic; color:var(--dourado-claro);">${licao.observacao}</span></p>
                        <p style="margin-top:5px;"><strong>Alunos na Lista de Presença (${listaPresencas.length}):</strong> ${listaPresencas.join(', ') || 'Nenhum aluno registrou entrada ainda.'}</p>
                        <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 4px; margin-top: 8px;">
                            <strong>Respostas dos Alunos (${filtrarRespostas.length}):</strong>
                            <div style="max-height: 100px; overflow-y:auto; margin-top:4px;">${listaRender || 'Sem respostas submetidas.'}</div>
                        </div>
                    </div>`;
            }
        } else if (licao.status === 'concluida') {
            const filtrarRespostas = respostas.filter(r => r.licaoId === licao.id);
            let listaRender = filtrarRespostas.map(r => `<p style="font-size:0.85rem; padding:2px 0;"><strong>${r.aluno}:</strong> ${r.texto}</p>`).join('');
            interfaceConteudoEstudo = `
                <div class="atividade-box" style="border-left-color: #7f8c8d; background-color:#1c315e;">
                    <p style="color: #bdc3c7; font-weight: bold;">🔒 Histórico Arquivado e Fechado</p>
                    <p style="font-size:0.85rem;"><strong>Total de Frequência Computada:</strong> ${listaPresencas.length} alunos presentes.</p>
                    <p style="font-size:0.85rem; color:var(--dourado-claro);"><strong>Observações Técnicas:</strong> ${licao.observacao}</p>
                    <div style="font-size:0.8rem; border-top: 1px solid rgba(212,175,55,0.1); margin-top:5px; padding-top:4px;">
                        <strong>Respostas Gravadas no Relatório:</strong>
                        <div>${listaRender || 'Nenhuma atividade anexada.'}</div>
                    </div>
                </div>`;
        }

        feed.innerHTML += `
            <div style="background: var(--azul-medio); padding:1.2rem; border-radius:8px; margin-bottom:1rem; border:1px solid rgba(212,175,55,0.15);">
                <span class="status-indicator ${badgeClass}">${labelStatus}</span>
                <h3 style="color:var(--dourado); font-size:1.15rem; margin-top:3px;">${licao.tema}</h3>
                ${interfaceConteudoEstudo}
                ${painelAcoesProfessor}
            </div>
        `;
    });
}

function assinarChamadaEletronica(licaoId) {
    const nome = localStorage.getItem('usuarioLogado');
    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    if (!dPresenças[licaoId]) dPresenças[licaoId] = [];

    if (!dPresenças[licaoId].includes(nome)) {
        dPresenças[licaoId].push(nome);
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
        alert('Presença computada e salva no diário de chamada!');
        atualizarFeedLicoes();
        atualizarMétricasFrequência();
    }
}

function submeterRespostaAluno(licaoId) {
    const inputElement = document.getElementById(`ipt-${licaoId}`);
    const texto = inputElement.value.trim();
    const nome = localStorage.getItem('usuarioLogado');

    if (!texto) return alert('Por favor, redija uma resposta antes de submeter.');

    let respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];
    respostas.push({ licaoId: licaoId, aluno: nome, texto: texto });
    localStorage.setItem('bd_respostas', JSON.stringify(respostas));

    alert('Sua resposta foi anexada aos relatórios da liderança.');
    atualizarFeedLicoes();
}

function listarMembrosNaTela() {
    const container = document.getElementById('lista-oficial-membros');
    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if (membros.length === 0) { container.innerHTML = '<p>Nenhum aluno registrado nas atas.</p>'; return; }
    container.innerHTML = '';
    membros.forEach(m => {
        const classeBadge = m.cargo === 'Líder/Professor' ? 'role-professor' : 'role-aluno';
        container.innerHTML += `<div class="membro-row" style="color:white;"><span>${m.nome}</span><span class="membro-badge ${classeBadge}">${m.cargo}</span></div>`;
    });
}

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

// Inicia automaticamente o ecossistema na tela ao ler o documento
window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) iniciarSessao();
};
