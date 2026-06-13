// ==========================================================================
// ARQUIVO LÓGICO: CONTROLE DE PERMISSÕES, LÍDERES, FREQUÊNCIA E CRONOGRAMAS
// ==========================================================================

// Lista oficial estrita de Professores e Líderes definidos pela coordenação
// Nota: O sistema reconhecerá você pelo seu nome completo exato conforme abaixo
const LISTA_PROFESSORES = [
    "Luís Gustavo Machado Calizaki", 
    "Michel", 
    "Júnior", 
    "Débora", 
    "Eclair"
];
const TOTAL_ALUNOS_META = 50; // Base fixa de alunos para cálculo de métricas

// Inicialização de banco de dados fictício no LocalStorage para persistência de dados local
if (!localStorage.getItem('bd_licoes')) {
    const licoesIniciais = [
        { id: 1, tema: "Lição Atual - Encerramento do Trimestre", pergunta: "Qual o maior ensinamento você tirou deste trimestre?" },
        { id: 2, tema: "Nova Revista - Introdução ao Livro de Juízes", pergunta: "Por que o ciclo de apostasia se repetia em Juízes?" }
    ];
    localStorage.setItem('bd_licoes', JSON.stringify(licoesIniciais));
}
if (!localStorage.getItem('bd_presenças')) localStorage.setItem('bd_presenças', JSON.stringify([]));
if (!localStorage.getItem('bd_membros')) localStorage.setItem('bd_membros', JSON.stringify([]));
if (!localStorage.getItem('bd_respostas')) localStorage.setItem('bd_respostas', JSON.stringify([]));

// --- CONTROLE DE TELAS (AUTENTICAÇÃO) ---
function alternarAbasAuth(queroCadastrar) {
    document.getElementById('auth-login-view').style.display = queroCadastrar ? 'none' : 'block';
    document.getElementById('auth-cadastro-view').style.display = queroCadastrar ? 'block' : 'none';
    fecharAlertas();
}

// --- VALIDAÇÃO RESTRITA DE NOME COMPLETO ---
function validarNomeCompleto(nome) {
    const partesNome = nome.trim().split(/\s+/);
    
    // Regra 1: Tem que ter pelo menos o nome e um sobrenome (mínimo 2 palavras)
    if (partesNome.length < 2) {
        return { valido: false, mensagem: "Por favor, insira seu nome COMPLETO (Nome e Sobrenome). Não são permitidos nomes únicos." };
    }

    // Regra 2: Bloquear abreviações terminadas em ponto ou com apenas 1 ou 2 letras isoladas (Ex: "Luis G.", "L. Gustavo")
    const possuiAbreviacao = partesNome.some(parte => {
        return parte.includes('.') || (parte.length <= 2 && !["da", "de", "do", "das", "dos"].includes(parte.toLowerCase()));
    });

    if (possuiAbreviacao) {
        return { valido: false, mensagem: "Não utilize abreviações ou pontos. Digite seus sobrenomes por extenso." };
    }

    return { valido: true };
}

function verificarSeEhProfessor(nome) {
    return LISTA_PROFESSORES.some(p => p.trim().toLowerCase() === nome.trim().toLowerCase());
}

// --- FLUXO DE CADASTRO ---
function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) { return mostrarAlerta('cadastro-alert', 'Por favor, insira seu nome.'); }

    // Aplica a nova validação rígida de segurança
    const validacao = validarNomeCompleto(nomeInput);
    if (!validacao.valido) {
        return mostrarAlerta('cadastro-alert', validacao.mensagem);
    }

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        return mostrarAlerta('cadastro-alert', 'Este nome já se encontra registrado no portal.');
    }

    const ehProf = verificarSeEhProfessor(nomeInput);
    const novoMembro = { nome: nomeInput, cargo: ehProf ? "Líder/Professor" : "Aluno" };
    membros.push(novoMembro);
    localStorage.setItem('bd_membros', JSON.stringify(membros));

    localStorage.setItem('usuarioLogado', novoMembro.nome);
    localStorage.setItem('perfil', ehProf ? 'professor' : 'aluno');
    iniciarSessao();
}

// --- FLUXO DE LOGIN ---
function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) { return mostrarAlerta('login-alert', 'Por favor, informe seu nome.'); }

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    let usuario = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());

    // Auto-cadastro para professores da lista oficial que entrarem pela primeira vez
    if (!usuario && verificarSeEhProfessor(nomeInput)) {
        usuario = { nome: nomeInput, cargo: "Líder/Professor" };
        membros.push(usuario);
        localStorage.setItem('bd_membros', JSON.stringify(membros));
    }

    if (!usuario) {
        return mostrarAlerta('login-alert', 'Nome não localizado. Se você é um aluno novo, clique em "Cadastre-se aqui" logo abaixo.');
    }

    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    iniciarSessao();
}

// --- SESSÃO ATIVA & RENDERIZAÇÃO DIRECIONADA ---
function iniciarSessao() {
    const nome = localStorage.getItem('usuarioLogado');
    const perfil = localStorage.getItem('perfil');

    document.getElementById('nome-usuario-logado').innerText = nome;
    const badge = document.getElementById('badge-perfil');
    badge.innerText = perfil === 'professor' ? 'Professor' : 'Aluno';
    badge.className = perfil === 'professor' ? 'badge-role role-professor' : 'badge-role role-aluno';

    document.getElementById('nav-principal').style.display = 'flex';
    document.getElementById('tela-auth').classList.remove('ativa');
    document.getElementById('tela-dashboard').classList.add('ativa');

    document.getElementById('painel-cadastro-licao').style.display = perfil === 'professor' ? 'block' : 'none';

    construirDashboardDinamico();
    atualizarFeedLicoes();
    listarMembrosNaTela();
}

// --- CONSTRUTOR DINÂMICO DE PORTAL (ALUNO VS PROFESSOR) ---
function construirDashboardDinamico() {
    const container = document.getElementById('dashboard-dinamico-conteudo');
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');

    const presencas = JSON.parse(localStorage.getItem('bd_presenças'));
    const totalAlunosPresentes = presencas.length;
    const porcentagemTurma = ((totalAlunosPresentes / TOTAL_ALUNOS_META) * 100).toFixed(0);

    if (perfil === 'professor') {
        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card card-admin-action">
                    <h2>⚙️ Painel de Comando</h2>
                    <p style="margin-bottom:1rem;">Olá Líder, use as abas do menu superior para inserir matérias ou analisar a lista completa de presença dos alunos.</p>
                    <button class="btn-principal" onclick="navegarPara('tela-licoes')">Ir para Área de Postagens</button>
                </div>
            </div>
            <div class="col-direita">
                <div class="card">
                    <h2>📊 Frequência em Tempo Real (Turma)</h2>
                    <p>Meta Fixa da Sala: <strong>${TOTAL_ALUNOS_META} Alunos</strong> (Professores não alteram a métrica).</p>
                    <div class="metric-container">
                        <div class="metric-bar" style="width: ${porcentagemTurma}%"></div>
                        <div class="metric-text">${porcentagemTurma}% (${totalAlunosPresentes} de ${TOTAL_ALUNOS_META})</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        const jaDeuPresenca = presencas.includes(nomeUser);
        const frequenciaPessoal = jaDeuPresenca ? "100%" : "0%";

        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card card-presenca-hoje">
                    <h2>📍 Chamada Eletrônica</h2>
                    <p>Confirme que você está assistindo à aula do grupo <strong>Luz Eterna</strong> de hoje.</p>
                    <button id="btn-marcar-presenca" class="btn-presence" ${jaDeuPresenca ? 'disabled' : ''} onclick="marcarPresencaAluno()">
                        ${jaDeuPresenca ? '✅ PRESENÇA CONFIRMADA' : 'MARCAR MINHA PRESENÇA'}
                    </button>
                </div>
            </div>
            <div class="col-direita">
                <div class="card">
                    <h2>📊 Meu Aproveitamento</h2>
                    <p>Sua assiduidade registrada no sistema neste domingo:</p>
                    <div class="metric-container">
                        <div class="metric-bar" style="width: ${frequenciaPessoal}"></div>
                        <div class="metric-text">${frequenciaPessoal} de Presença</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// --- REGRAS DE PRESENÇA DOS ALUNOS ---
function marcarPresencaAluno() {
    const nome = localStorage.getItem('usuarioLogado');
    const perfil = localStorage.getItem('perfil');

    if (perfil === 'professor') {
        alert('Líderes e Professores possuem presença automática e permanente, não alterando a meta de alunos.');
        return;
    }

    let presencas = JSON.parse(localStorage.getItem('bd_presenças'));
    if (!presencas.includes(nome)) {
        presencas.push(nome);
        localStorage.setItem('bd_presenças', JSON.stringify(presencas));
    }

    construirDashboardDinamico();
    mostrarAlerta('dashboard-alert', 'Presença computada com sucesso na classe Luz Eterna!');
}

// --- CRIAÇÃO DE CONTEÚDO (PROFESSOR INSERE) ---
function publicarNovaLicao() {
    const tema = document.getElementById('post-tema').value.trim();
    const pergunta = document.getElementById('post-pergunta').value.trim();

    if (!tema || !pergunta) {
        alert('Por favor, preencha o tema e a pergunta da atividade.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes'));
    const nova = { id: Date.now(), tema: tema, pergunta: pergunta };
    licoes.unshift(nova);

    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    
    document.getElementById('post-tema').value = '';
    document.getElementById('post-pergunta').value = '';

    alert('Lição e Atividade publicadas com sucesso!');
    atualizarFeedLicoes();
}

// --- RENDERIZAR LIÇÕES E ATIVIDADES ---
function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    const licoes = JSON.parse(localStorage.getItem('bd_licoes'));
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');
    const respostas = JSON.parse(localStorage.getItem('bd_respostas'));

    if (licoes.length === 0) {
        feed.innerHTML = '<p>Nenhuma matéria cadastrada ainda.</p>';
        return;
    }

    feed.innerHTML = '';
    licoes.forEach(licao => {
        const jaRespondeu = respostas.some(r => r.licaoId === licao.id && r.aluno === nomeUser);

        let areaInteracao = '';
        if (perfil === 'aluno') {
            areaInteracao = jaRespondeu 
                ? `<p style="color:var(--sucesso); font-weight:bold; margin-top:0.5rem;">✅ Você já enviou sua resposta para esta atividade.</p>`
                : `<div class="atividade-box" id="box-${licao.id}">
                    <p><strong>Atividade:</strong> ${licao.pergunta}</p>
                    <input type="text" id="input-${licao.id}" placeholder="Escreva sua resposta aqui...">
                    <button onclick="enviarRespostaAluno(${licao.id})">Enviar</button>
                   </div>`;
        } else {
            const respostasDaLicao = respostas.filter(r => r.licaoId === licao.id);
            let listaRespostasProf = '';
            respostasDaLicao.forEach(r => {
                listaRespostasProf += `<p style="font-size:0.85rem; border-top:1px dashed #ccc; padding-top:4px;"><strong>${r.aluno}:</strong> ${r.texto}</p>`;
            });

            areaInteracao = `<div class="atividade-box">
                <p><strong>Pergunta Ativa:</strong> ${licao.pergunta}</p>
                <div style="margin-top:0.5rem; background:white; padding:0.5rem; border-radius:4px;">
                    <span style="font-size:0.8rem; font-weight:bold; color:var(--azul-medio);">Respostas dos Alunos (${respostasDaLicao.length}):</span>
                    ${listaRespostasProf || '<p style="font-size:0.8rem; color:gray;">Nenhuma resposta enviada ainda.</p>'}
                </div>
               </div>`;
        }

        feed.innerHTML += `
            <div class="licao-timeline-item">
                <h3>${licao.tema}</h3>
                ${areaInteracao}
            </div>
        `;
    });
}

// --- SUBMISSÃO DE ATIVIDADES PELO ALUNO ---
function enviarRespostaAluno(licaoId) {
    const input = document.getElementById(`input-${licaoId}`);
    const respostaTexto = input.value.trim();
    const nomeUser = localStorage.getItem('usuarioLogado');

    if (!respostaTexto) {
        alert('Escreva uma resposta válida antes de enviar.');
        return;
    }

    let respostas = JSON.parse(localStorage.getItem('bd_respostas'));
    respostas.push({ licaoId: licaoId, aluno: nomeUser, texto: respostaTexto });
    localStorage.setItem('bd_respostas', JSON.stringify(respostas));

    alert('Sua atividade foi registrada pelo professor!');
    atualizarFeedLicoes();
}

// --- LISTA DE MEMBROS ---
function listarMembrosNaTela() {
    const container = document.getElementById('lista-oficial-membros');
    const membros = JSON.parse(localStorage.getItem('bd_membros'));

    if (membros.length === 0) {
        container.innerHTML = '<p>Nenhum membro cadastrado nesta rede local.</p>';
        return;
    }

    container.innerHTML = '';
    membros.forEach(m => {
        const classeBadge = m.cargo === 'Líder/Professor' ? 'role-professor' : 'role-aluno';
        container.innerHTML += `
            <div class="membro-row">
                <span class="membro-name">${m.nome}</span>
                <span class="membro-badge ${classeBadge}">${m.cargo}</span>
            </div>
        `;
    });
}

// --- ROTINAS AUXILIARES ---
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

function fecharAlertas() {
    document.querySelectorAll('.alert').forEach(a => a.style.display = 'none');
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('perfil');
    window.location.reload();
}

// Verificação de persistência em recarregamentos de página
window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) {
        iniciarSessao();
    }
};
