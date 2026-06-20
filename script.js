// ==========================================================================
// ARQUIVO LÓGICO: CONTROLE DE PERMISSÕES, LÍDERES, FREQUÊNCIA E CRONOGRAMAS
// ==========================================================================

// Lista oficial estrita de Professores e Líderes
const LISTA_PROFESSORES = [
    "Luís Gustavo Machado Calizaki", 
    "Michel", 
    "Júnior", 
    "Débora", 
    "Eclair"
];
const TOTAL_ALUNOS_META = 50;

// --- INICIALIZAÇÃO DO BANCO DE DADOS (COM AS 13 LIÇÕES DO TRIMESTRE) ---
if (!localStorage.getItem('bd_licoes')) {
    const licoesTrimestrais = [
        { id: 1, tema: "Lição 1: Introdução ao Livro de Juízes", pergunta: "Qual o propósito central de Deus no livro de Juízes?" },
        { id: 2, tema: "Lição 2: O Ciclo de Apostasia", pergunta: "Por que o ciclo de pecado e arrependimento se repetia?" },
        { id: 3, tema: "Lição 3: Otniel, o Primeiro Juiz", pergunta: "O que a vida de Otniel nos ensina sobre coragem?" },
        { id: 4, tema: "Lição 4: Eúde e a Libertação", pergunta: "De que maneira Deus usa pessoas comuns para grandes libertações?" },
        { id: 5, tema: "Lição 5: um Líder segundo o Coração de Deus", pergunta: "Qual a importância da submissão à voz de Deus?" },
        { id: 6, tema: "Lição 6: Gideão e a Fidelidade de Deus", pergunta: "Por que Deus escolheu reduzir o exército de Gideão?" },
        { id: 7, tema: "Lição 7: A Fé de Gideão na Batalha", pergunta: "Como vencer o medo confiando na providência divina?" },
        { id: 8, tema: "Lição 8: Abimeleque e a Ambição Desenfreada", pergunta: "Como a soberba destrói a liderança?" },
        { id: 9, tema: "Lição 9: Jefté e a Integridade dos Votos", pergunta: "Qual a lição sobre cumprir compromissos com Deus?" },
        { id: 10, tema: "Lição 10: Sansão, o Separado de Deus", pergunta: "Como suas escolhas afetam o seu chamado?" },
        { id: 11, tema: "Lição 11: A Força e a Fraqueza de Sansão", pergunta: "Como o autodomínio evita a queda espiritual?" },
        { id: 12, tema: "Lição 12: A Decomposição Moral em Israel", pergunta: "O que acontece com um povo quando não há temor a Deus?" },
        { id: 13, tema: "Lição 13: Encerramento do Trimestre", pergunta: "Qual o maior ensinamento você tirou deste trimestre?" }
    ];
    localStorage.setItem('bd_licoes', JSON.stringify(licoesTrimestrais));
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

// --- VALIDAÇÃO RESTRITA ---
function validarNomeCompleto(nome) {
    const partesNome = nome.trim().split(/\s+/);
    if (partesNome.length < 2) return { valido: false, mensagem: "Por favor, insira seu nome COMPLETO." };
    const possuiAbreviacao = partesNome.some(parte => parte.includes('.') || (parte.length <= 2 && !["da", "de", "do", "das", "dos"].includes(parte.toLowerCase())));
    if (possuiAbreviacao) return { valido: false, mensagem: "Não utilize abreviações. Digite seus sobrenomes por extenso." };
    return { valido: true };
}

function verificarSeEhProfessor(nome) {
    return LISTA_PROFESSORES.some(p => p.trim().toLowerCase() === nome.trim().toLowerCase());
}

// --- FLUXOS DE CADASTRO E LOGIN ---
function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('cadastro-alert', 'Por favor, insira seu nome.');
    const validacao = validarNomeCompleto(nomeInput);
    if (!validacao.valido) return mostrarAlerta('cadastro-alert', validacao.mensagem);

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) return mostrarAlerta('cadastro-alert', 'Este nome já está registrado.');

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
    if (!nomeInput) return mostrarAlerta('login-alert', 'Por favor, informe seu nome.');
    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    let usuario = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());

    if (!usuario && verificarSeEhProfessor(nomeInput)) {
        usuario = { nome: nomeInput, cargo: "Líder/Professor" };
        membros.push(usuario);
        localStorage.setItem('bd_membros', JSON.stringify(membros));
    }
    if (!usuario) return mostrarAlerta('login-alert', 'Nome não localizado.');
    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    iniciarSessao();
}

// --- SESSÃO E DASHBOARD ---
function iniciarSessao() {
    document.getElementById('nome-usuario-logado').innerText = localStorage.getItem('usuarioLogado');
    document.getElementById('nav-principal').style.display = 'flex';
    document.getElementById('tela-auth').classList.remove('ativa');
    document.getElementById('tela-dashboard').classList.add('ativa');
    construirDashboardDinamico();
    atualizarFeedLicoes();
}

function construirDashboardDinamico() {
    const container = document.getElementById('dashboard-dinamico-conteudo');
    const perfil = localStorage.getItem('perfil');
    const presencas = JSON.parse(localStorage.getItem('bd_presenças'));
    const totalAlunosPresentes = presencas.length;
    const porcentagemTurma = ((totalAlunosPresentes / TOTAL_ALUNOS_META) * 100).toFixed(0);

    if (perfil === 'professor') {
        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card"><h2>⚙️ Painel de Comando</h2><button onclick="navegarPara('tela-licoes')">Gerenciar Lições</button></div>
            </div>
            <div class="col-direita">
                <div class="card"><h2>📊 Frequência: ${porcentagemTurma}%</h2><div class="metric-bar" style="width: ${porcentagemTurma}%"></div></div>
            </div>`;
    } else {
        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card"><h2>📍 Chamada</h2><button onclick="marcarPresencaAluno()">Confirmar Presença</button></div>
            </div>`;
    }
}

// --- RENDERIZAR LIÇÕES E FEED ---
function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    const licoes = JSON.parse(localStorage.getItem('bd_licoes'));
    feed.innerHTML = '';
    
    licoes.forEach(licao => {
        feed.innerHTML += `
            <div class="licao-timeline-item">
                <h3>${licao.tema}</h3>
                <p><strong>Atividade:</strong> ${licao.pergunta}</p>
                <input type="text" id="input-${licao.id}" placeholder="Sua resposta...">
                <button onclick="enviarRespostaAluno(${licao.id})">Enviar</button>
            </div>
        `;
    });
}

function enviarRespostaAluno(licaoId) {
    const texto = document.getElementById(`input-${licaoId}`).value.trim();
    if (!texto) return alert('Escreva uma resposta.');
    let respostas = JSON.parse(localStorage.getItem('bd_respostas'));
    respostas.push({ licaoId, aluno: localStorage.getItem('usuarioLogado'), texto });
    localStorage.setItem('bd_respostas', JSON.stringify(respostas));
    alert('Enviado com sucesso!');
}

function mostrarAlerta(id, msg) { document.getElementById(id).innerText = msg; document.getElementById(id).style.display = 'block'; }
function fecharAlertas() { document.querySelectorAll('.alert').forEach(a => a.style.display = 'none'); }
function navegarPara(id) { document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa')); document.getElementById(id).classList.add('ativa'); }
