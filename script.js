// ==========================================================================
// ARQUIVO LÓGICO COMPLETO COM CORREÇÃO DE LIDERANÇA E TRAVA DE STATUS
// ==========================================================================

// Lista oficial com nomes corrigidos para privilégio de Professor/Líder
const LISTA_PROFESSORES = [
    "Luiz Gustavo Machado Kalizak", 
    "Michael", 
    "Eclair", 
    "Júnior", 
    "Débora"
];
const TOTAL_ALUNOS_META = 50; // Alunos alvo do cálculo de frequência

// Carga de lições iniciais padrão da revista se o navegador estiver vazio
if (!localStorage.getItem('bd_licoes')) {
    const licoesIniciais = [
        { id: 101, tema: "Lição 1: O Livro de Juízes: quando cada um fazia o que parecia certo", pergunta: "O que significa dizer que cada um fazia o que parecia certo aos seus olhos?", status: "concluida" },
        { id: 102, tema: "Lição 2: Fidelidade a Deus: uma questão de escolha", pergunta: "Qual a lição prática sobre escolhas espirituais aprendemos em Juízes?", status: "aberta" },
        { id: 103, tema: "Lição 3: Clamor e libertação: a liderança de Otniel", pergunta: "Qual foi o papel de Otniel no clamor do povo?", status: "agendada" }
    ];
    localStorage.setItem('bd_licoes', JSON.stringify(licoesIniciais));
}
if (!localStorage.getItem('bd_presenças_v2')) localStorage.setItem('bd_presenças_v2', JSON.stringify({}));
if (!localStorage.getItem('bd_membros')) localStorage.setItem('bd_membros', JSON.stringify([]));
if (!localStorage.getItem('bd_respostas')) localStorage.setItem('bd_respostas', JSON.stringify([]));

// --- CONTROLE DE ALTERNÂNCIA DE TELAS ---
function alternarAbasAuth(queroCadastrar) {
    document.getElementById('auth-login-view').style.display = queroCadastrar ? 'none' : 'block';
    document.getElementById('auth-cadastro-view').style.display = queroCadastrar ? 'block' : 'none';
    fecharAlertas();
}

// --- VALIDAÇÃO OBRIGATÓRIA DE NOME COMPLETO ---
function validarNomeCompleto(nome) {
    const partesNome = nome.trim().split(/\s+/);
    
    // Bloqueia nomes curtos ou sem sobrenome
    if (partesNome.length < 2) {
        return { valido: false, mensagem: "Por favor, insira seu nome COMPLETO (Nome e Sobrenome). Não são permitidos nomes curtos." };
    }

    // Identifica e barra abreviações vulgares ou com pontos
    const possuiAbreviacao = partesNome.some(parte => {
        return parte.includes('.') || (parte.length <= 2 && !["da", "de", "do", "das", "dos"].includes(parte.toLowerCase()));
    });

    if (possuiAbreviacao) {
        return { valido: false, mensagem: "Não utilize abreviações ou pontos. Digite seus sobrenomes completos por extenso." };
    }

    return { valido: true };
}

function verificarSeEhProfessor(nome) {
    return LISTA_PROFESSORES.some(p => p.trim().toLowerCase() === nome.trim().toLowerCase());
}

function obterCargoUsuario(nome) {
    return verificarSeEhProfessor(nome) ? 'professor' : 'aluno';
}

// --- PROCESSOS DE CADASTRO ---
function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('cadastro-alert', 'Por favor, insira seu nome.');

    const validacao = validarNomeCompleto(nomeInput);
    if (!validacao.valido) return mostrarAlerta('cadastro-alert', validacao.mensagem);

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        return mostrarAlerta('cadastro-alert', 'Este nome já está cadastrado no sistema.');
    }

    const cargo = obterCargoUsuario(nomeInput);
    const novoMembro = { nome: nomeInput, cargo: cargo === 'professor' ? "Líder/Professor" : "Aluno" };
    
    membros.push(novoMembro);
    localStorage.setItem('bd_membros', JSON.stringify(membros));

    localStorage.setItem('usuarioLogado', novoMembro.nome);
    localStorage.setItem('perfil', cargo);
    iniciarSessao();
}

// --- PROCESSOS DE LOGIN ---
function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('login-alert', 'Por favor, informe seu nome.');

    let membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    let usuario = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());

    // Auto-cadastro para líderes oficiais ausentes do banco inicial
    if (!usuario && verificarSeEhProfessor(nomeInput)) {
        usuario = { nome: nomeInput, cargo: "Líder/Professor" };
        membros.push(usuario);
        localStorage.setItem('bd_membros', JSON.stringify(membros));
    }

    if (!usuario) {
        return mostrarAlerta('login-alert', 'Nome não localizado. Se você for aluno, clique em "Cadastre-se aqui" abaixo.');
    }

    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    iniciarSessao();
}

// --- GERENCIAMENTO DE INTERFACES ATIVAS ---
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

function construirDashboardDinamico() {
    const container = document.getElementById('dashboard-dinamico-conteudo');
    const perfil = localStorage.getItem('perfil');
    
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const licaoAbertaHoje = licoes.find(l => l.status === 'aberta');
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    
    let totalPresentesHoje = 0;
    if (licaoAbertaHoje && dPresenças[licaoAbertaHoje.id]) {
        totalPresentesHoje = dPresenças[licaoAbertaHoje.id].length;
    }
    const porcentagemTurma = ((totalPresentesHoje / TOTAL_ALUNOS_META) * 100).toFixed(0);

    if (perfil === 'professor') {
        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card card-admin-action">
                    <h2>⚙️ Painel de Gestão da EBD</h2>
                    <p>Olá, Professor! Use as abas superiores para navegar. Na aba <strong>"Cronograma & Chamadas"</strong> você pode abrir, fechar ou agendar lições.</p>
                    <div style="margin-top:1.5rem; background:#fff; padding:1rem; border-radius:6px; border:1px solid #e2e8f0;">
                        <strong>Frequência da Aula Ativa Hoje:</strong> ${porcentagemTurma}% (${totalPresentesHoje} de ${TOTAL_ALUNOS_META} Alunos)
                        <div class="metric-container"><div class="metric-bar" style="width: ${porcentagemTurma}%"></div></div>
                    </div>
                </div>
            </div>`;
    } else {
        container.innerHTML = `
            <div class="col-esquerda">
                <div class="card">
                    <h2>📍 Central do Aluno - Luz Eterna</h2>
                    <p>Fique atento! A chamada do dia e as perguntas estão concentradas no menu <strong style="color:var(--azul-medio); text-decoration:underline; cursor:pointer;" onclick="navegarPara('tela-licoes')">"Cronograma & Chamadas"</strong>.</p>
                </div>
            </div>`;
    }
}

// --- PUBLICAÇÕES DE LIÇÕES ---
function publicarNovaLicao() {
    const tema = document.getElementById('post-tema').value.trim();
    const pergunta = document.getElementById('post-pergunta').value.trim();
    const status = document.getElementById('post-status').value;

    if (!tema || !pergunta) {
        alert('Por favor, defina o tema e a pergunta do exercício.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const nova = { id: Date.now(), tema: tema, pergunta: pergunta, status: status };
    licoes.unshift(nova);

    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    document.getElementById('post-tema').value = '';
    document.getElementById('post-pergunta').value = '';

    alert('Nova aula inserida no cronograma com sucesso!');
    atualizarFeedLicoes();
    construirDashboardDinamico();
}

function alterarStatusAula(licaoId, novoStatus) {
    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.map(l => {
        if (l.id === licaoId) l.status = novoStatus;
        return l;
    });
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    atualizarFeedLicoes();
    construirDashboardDinamico();
}

// --- CONSTRUTOR DO FEED COM BLOQUEIOS DE STATUS ---
function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    const respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];

    if (licoes.length === 0) {
        feed.innerHTML = '<p>Nenhuma lição agendada no momento.</p>';
        return;
    }

    feed.innerHTML = '';

    licoes.forEach(licao => {
        const listaPresencasDessaLicao = dPresenças[licao.id] || [];
        const jaDeuPresenca = listaPresencasDessaLicao.includes(nomeUser);
        const jaRespondeu = respostas.some(r => r.licaoId === licao.id && r.aluno === nomeUser);

        let selStatusClass = `status-${licao.status}`;
        let statusTexto = licao.status === 'agendada' ? '📅 Agendada' : (licao.status === 'aberta' ? '🔓 Aberta para Hoje' : '🔒 Concluída');

        let controleProfessor = '';
        if (perfil === 'professor') {
            controleProfessor = `
                <div style="margin-top: 12px; border-top: 1px dashed #ddd; padding-top: 8px;">
                    <span style="font-size:0.8rem; font-weight:bold; color:#777; display:block; margin-bottom:5px;">Ações do Professor:</span>
                    ${licao.status !== 'aberta' ? `<button class="btn-acao-aula btn-abrir" onclick="alterarStatusAula(${licao.id}, 'aberta')">Liberar Chamada</button>` : ''}
                    ${licao.status !== 'concluida' ? `<button class="btn-acao-aula btn-fechar" onclick="alterarStatusAula(${licao.id}, 'concluida')">Encerrar Aula</button>` : ''}
                    ${licao.status !== 'agendada' ? `<button class="btn-acao-aula" style="background:#7f8c8d;" onclick="alterarStatusAula(${licao.id}, 'agendada')">Bloquear/Agendar</button>` : ''}
                </div>`;
        }

        let areaInteracao = '';
        if (licao.status === 'agendada') {
            areaInteracao = `
                <div class="atividade-box" style="border-left-color: var(--alerta); background: #fff9f5;">
                    <p style="color: var(--alerta); font-weight:bold;">⚠️ Presença Bloqueada</p>
                    <p style="font-size: 0.85rem; color: #666; margin-top:4px;">Esta aula está cadastrada para o futuro. A chamada eletrônica e o exercício associado só estarão abertos no respectivo domingo.</p>
                </div>`;
        } else if (licao.status === 'aberta') {
            if (perfil === 'aluno') {
                areaInteracao = `
                    <div class="atividade-box" style="border-left-color: var(--sucesso);">
                        <p style="margin-bottom:0.5rem; font-weight:bold;">📍 Controle de Chamada:</p>
                        <button class="btn-principal" style="background:var(--sucesso); color:white;" ${jaDeuPresenca ? 'disabled' : ''} onclick="marcarPresencaV2(${licao.id})">
                            ${jaDeuPresenca ? '✅ SUA PRESENÇA FOI COMPUTADA NESTA AULA' : 'Clique aqui para Confirmar Presença'}
                        </button>
                        <hr style="border:0; border-top:1px solid #ccc; margin:1rem 0;">
                        <p><strong>📝 Exercício da Lição:</strong> ${licao.pergunta}</p>
                        ${jaRespondeu ? '<p style="color:var(--sucesso); font-weight:bold; margin-top:5px;">✅ Resposta enviada com sucesso!</p>' : `
                            <div style="margin-top: 0.5rem; display: flex; gap: 10px;">
                                <input type="text" id="input-${licao.id}" placeholder="Digite sua resposta por extenso..." style="flex: 1; padding: 0.5rem; border-radius:4px; border:1px solid #ccc;">
                                <button onclick="enviarRespostaV2(${licao.id})" style="padding:0.5rem 1rem; background:var(--azul-escuro); color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Enviar</button>
                            </div>
                        `}
                    </div>`;
            } else {
                const respDaLicao = respostas.filter(r => r.licaoId === licao.id);
                let listagem = respDaLicao.map(r => `<p style="font-size:0.85rem; border-top:1px dashed #ddd; padding:4px 0;"><strong>${r.aluno}:</strong> ${r.texto}</p>`).join('');
                areaInteracao = `
                    <div class="atividade-box">
                        <p><strong>Alunos Presentes hoje (${listaPresencasDessaLicao.length}):</strong> ${listaPresencasDessaLicao.join(', ') || 'Nenhum aluno registrou presença.'}</p>
                        <div style="margin-top:0.8rem; background:white; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
                            <strong>Exercícios respondidos (${respDaLicao.length}):</strong>
                            <div style="max-height:120px; overflow-y:auto; margin-top:4px;">${listagem || 'Sem respostas enviadas.'}</div>
                        </div>
                    </div>`;
            }
        } else if (licao.status === 'concluida') {
            const respDaLicao = respostas.filter(r => r.licaoId === licao.id);
            let listagem = respDaLicao.map(r => `<p style="font-size:0.85rem; border-top:1px dashed #ddd; padding:4px 0;"><strong>${r.aluno}:</strong> ${r.texto}</p>`).join('');
            areaInteracao = `
                <div class="atividade-box" style="border-left-color: #7f8c8d; background: #f9f9f9;">
                    <p style="color:#555; font-weight:bold;">🔒 Aula Concluída</p>
                    <p style="font-size:0.85rem; margin-bottom:5px;"><strong>Total Final de Alunos Presentes:</strong> ${listaPresencasDessaLicao.length}</p>
                    <div style="background:white; padding:0.5rem; border:1px solid #ddd; border-radius:4px; font-size:0.85rem;">
                        <strong>Histórico de Respostas dos Alunos:</strong>
                        <div>${listagem || 'Sem respostas registradas para esta aula.'}</div>
                    </div>
                </div>`;
        }

        feed.innerHTML += `
            <div class="licao-timeline-item" style="background: white; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px; margin-bottom:1.5rem;">
                <span class="status-indicator ${selStatusClass}">${statusTexto}</span>
                <h3 style="margin-top:5px; color:var(--azul-escuro); font-size:1.2rem;">${licao.tema}</h3>
                ${areaInteracao}
                ${controleProfessor}
            </div>
        `;
    });
}

function marcarPresencaV2(licaoId) {
    const nome = localStorage.getItem('usuarioLogado');
    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    if (!dPresenças[licaoId]) dPresenças[licaoId] = [];

    if (!dPresenças[licaoId].includes(nome)) {
        dPresenças[licaoId].push(nome);
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
        alert('Sua presença foi salva com sucesso nesta lição!');
        atualizarFeedLicoes();
        construirDashboardDinamico();
    }
}

function enviarRespostaV2(licaoId) {
    const input = document.getElementById(`input-${licaoId}`);
    const texto = input.value.trim();
    const nomeUser = localStorage.getItem('usuarioLogado');

    if (!texto) return alert('Por favor, preencha o campo de texto antes de submeter.');

    let respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];
    respostas.push({ licaoId: licaoId, aluno: nomeUser, texto: texto });
    localStorage.setItem('bd_respostas', JSON.stringify(respostas));

    alert('Exercício enviado com sucesso para análise do líder!');
    atualizarFeedLicoes();
}

function listarMembrosNaTela() {
    const container = document.getElementById('lista-oficial-membros');
    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if (membros.length === 0) { container.innerHTML = '<p>Nenhum membro registrado na rede.</p>'; return; }
    container.innerHTML = '';
    membros.forEach(m => {
        const classeBadge = m.cargo === 'Líder/Professor' ? 'role-professor' : 'role-aluno';
        container.innerHTML += `<div class="membro-row"><span>${m.nome}</span><span class="membro-badge ${classeBadge}">${m.cargo}</span></div>`;
    });
}

// --- FUNÇÕES UTILITÁRIAS ---
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

window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) iniciarSessao();
};
