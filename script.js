// ==========================================================================
// PORTAL EBD - SISTEMA LUZ ETERNA 2026 (SINCRONIZAÇÃO DE PRESENÇA E MÉTRICAS)
// ==========================================================================

const MEMBROS_PRE_CADASTRADOS = [
    { nome: "Luiz Kalizak", cargo: "Líder/Professor" },
    { nome: "Luiz Gustavo Machado Kalizak", cargo: "Líder/Professor" },
    { nome: "Michael", cargo: "Líder/Professor" },
    { nome: "Eclair", cargo: "Líder/Professor" },
    { nome: "Júnior", cargo: "Líder/Professor" },
    { nome: "Junior", cargo: "Líder/Professor" },
    { nome: "Débora", cargo: "Líder/Professor" },
    { nome: "Debora", cargo: "Líder/Professor" },
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

function gerarListaDomingosCPAD() {
    let domingos = [];
    let dataFoco = new Date(2026, 6, 5); // 05/07/2026
    
    const temasCPAD = [
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
        "Lição 13: Esperança in meio ao caos: aguardando a vinda do rei"
    ];

    for (let i = 0; i < 13; i++) {
        let diaStr = String(dataFoco.getDate()).padStart(2, '0');
        let mesStr = String(dataFoco.getMonth() + 1).padStart(2, '0');
        let dataFormatada = `${diaStr}/${mesStr}/${dataFoco.getFullYear()}`;
        
        domingos.push({
            id: String(2026100 + i),
            data: dataFormatada,
            tema: `${dataFormatada} - ${temasCPAD[i]}`,
            pergunta: "O que você aprendeu com esta lição que pode aplicar no seu dia a dia?",
            isAvulso: false,
            status: "agendada",
            observacao: "Matéria oficial da grade curricular CPAD."
        });
        dataFoco.setDate(dataFoco.getDate() + 7);
    }
    return domingos;
}

// Inicializadores das tabelas de dados local
if (!localStorage.getItem('bd_membros')) {
    localStorage.setItem('bd_membros', JSON.stringify(MEMBROS_PRE_CADASTRADOS));
}
if (!localStorage.getItem('bd_licoes')) {
    localStorage.setItem('bd_licoes', JSON.stringify(gerarListaDomingosCPAD()));
}
if (!localStorage.getItem('bd_presenças_v2')) {
    localStorage.setItem('bd_presenças_v2', JSON.stringify({}));
}
if (!localStorage.getItem('bd_respostas')) {
    localStorage.setItem('bd_respostas', JSON.stringify([]));
}

function alternarAbasAuth(queroCadastrar) {
    document.getElementById('auth-login-view').style.display = queroCadastrar ? 'none' : 'block';
    document.getElementById('auth-cadastro-view').style.display = queroCadastrar ? 'block' : 'none';
    fecharAlertas();
}

function normalizarTextoParaBusca(txt) {
    return txt.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('login-alert', 'Informe o seu nome.');

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    let nomeBusca = normalizarTextoParaBusca(nomeInput);
    
    let usuario = membros.find(m => normalizarTextoParaBusca(m.nome) === nomeBusca);

    if (!usuario) return mostrarAlerta('login-alert', 'Nome não localizado na lista de classe.');

    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    iniciarSessao();
}

function executarCadastro() {
    const nomeInput = document.getElementById('cadastro-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('cadastro-alert', 'Digite o nome completo.');

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        return mostrarAlerta('cadastro-alert', 'Usuário já cadastrado.');
    }

    const novoMembro = { nome: nomeInput, cargo: "Aluno" };
    membros.push(novoMembro);
    localStorage.setItem('bd_membros', JSON.stringify(membros));

    localStorage.setItem('usuarioLogado', novoMembro.nome);
    localStorage.setItem('perfil', 'aluno');
    iniciarSessao();
}

function iniciarSessao() {
    document.getElementById('nav-principal').style.display = 'flex';
    document.getElementById('tela-auth').style.display = 'none';
    document.getElementById('tela-dashboard').classList.add('ativa');

    const nome = localStorage.getItem('usuarioLogado');
    const perfil = localStorage.getItem('perfil');

    document.getElementById('nome-usuario-logado').innerText = nome;
    const badge = document.getElementById('badge-perfil');
    badge.innerText = perfil === 'professor' ? 'PROFESSOR / LÍDER' : 'ALUNO';
    badge.className = perfil === 'professor' ? 'badge-role role-professor' : 'badge-role role-aluno';

    document.getElementById('painel-cadastro-licao').style.display = perfil === 'professor' ? 'block' : 'none';
    document.getElementById('painel-criar-exercicio-extra').style.display = perfil === 'professor' ? 'block' : 'none';

    sincronizarTelasEReatividade();

    // Cronômetro de Varredura Imediata (Varre e atualiza a tela a cada 2 segundos)
    setInterval(() => {
        sincronizarTelasEReatividade();
    }, 2000);
}

function sincronizarTelasEReatividade() {
    atualizarMétricasFrequência();
    atualizarFeedLicoes();
    atualizarAbaExercicios();
    listarMembrosNaTela();
}

// ==========================================================================
// CÁLCULO E EXIBIÇÃO DO CONTADOR E DA BARRA DE PORCENTAGEM
// ==========================================================================
function atualizarMétricasFrequência() {
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    
    // Filtra apenas os alunos cadastrados para compor a meta real
    const totalAlunosInscritos = membros.filter(m => m.cargo === 'Aluno').length || 1;
    
    // Busca qual é a lição que está com o status "aberta" no momento
    const licaoAtiva = licoes.find(l => l.status === 'aberta') || licoes[0];
    
    let totalPresentes = 0;
    if (licaoAtiva && dPresenças[String(licaoAtiva.id)]) {
        totalPresentes = dPresenças[String(licaoAtiva.id)].length;
    }

    // Calcula a porcentagem com base nos presentes reais sobre a meta de alunos
    let pct = ((totalPresentes / totalAlunosInscritos) * 100).toFixed(0);
    if (parseInt(pct) > 100) pct = '100';

    // Injeta os valores vivos direto nas tags do seu HTML
    if(document.getElementById('txt-total-meta')) document.getElementById('txt-total-meta').innerText = totalAlunosInscritos;
    if(document.getElementById('txt-presentes-hoje')) document.getElementById('txt-presentes-hoje').innerText = totalPresentes;
    if(document.getElementById('txt-porcentagem-hoje')) document.getElementById('txt-porcentagem-hoje').innerText = `${pct}%`;
    if(document.getElementById('barra-progresso-frequencia')) document.getElementById('barra-progresso-frequencia').style.width = `${pct}%`;
}

function publicarNovaLicao() {
    const tema = document.getElementById('post-tema').value.trim();
    const perguntaInput = document.getElementById('post-pergunta').value.trim();
    const observacao = document.getElementById('post-observacao').value.trim() || "Nenhuma anotação extra.";
    const status = document.getElementById('post-status').value;

    if (!tema || !perguntaInput) {
        alert('Informe o Tema e a Pergunta de fixação obrigatórios.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    
    const novaAula = {
        id: String(Date.now()),
        tema: tema,
        pergunta: perguntaInput,
        observacao: observacao,
        isAvulso: false,
        status: status
    };

    licoes.unshift(novaAula);
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    
    document.getElementById('post-tema').value = '';
    document.getElementById('post-pergunta').value = '';
    document.getElementById('post-observacao').value = '';

    sincronizarTelasEReatividade();
    alert(`Aula "${tema}" publicada com sucesso!`);
}

function deletarLicaoRemoto(licaoId) {
    if (!confirm("Tem certeza que deseja excluir permanentemente esta aula?")) return;

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.filter(l => String(l.id) !== String(licaoId));
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));

    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    if (dPresenças[String(licaoId)]) {
        delete dPresenças[String(licaoId)];
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
    }

    sincronizarTelasEReatividade();
}

function mudarStatusLicaoRemoto(licaoId, novoStatus) {
    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.map(l => {
        if (String(l.id) === String(licaoId)) {
            l.status = novoStatus;
        }
        return l;
    });
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    sincronizarTelasEReatividade();
}

function atualizarFeedLicoes() {
    const feed = document.getElementById('feed-licoes');
    if (!feed) return;

    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const perfil = localStorage.getItem('perfil');
    const nomeUser = localStorage.getItem('usuarioLogado');
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};

    if (licoes.length === 0) {
        feed.innerHTML = '<p>Nenhuma matéria programada no momento.</p>';
        return;
    }

    let htmlConteudo = '';

    const licoesOrdenadas = [...licoes].sort((a, b) => {
        if (a.status === 'aberta' && b.status !== 'aberta') return -1;
        if (a.status !== 'aberta' && b.status === 'aberta') return 1;
        return 0;
    });

    licoesOrdenadas.forEach(licao => {
        if (licao.isAvulso) return;

        const listaPresencas = dPresenças[String(licao.id)] || [];
        const usuarioJaConfirmou = listaPresencas.includes(nomeUser);

        let badgeStyle = licao.status === 'agendada' ? 'st-agendada' : (licao.status === 'aberta' ? 'st-aberta' : 'st-concluida');
        let labelStatus = licao.status === 'agendada' ? '📅 AGENDADA' : (licao.status === 'aberta' ? '🔓 ABERTA PARA PRESENÇA' : '🔒 CONCLUÍDA / FECHADA');
        let cardExtraClass = licao.status === 'aberta' ? 'aula-aberta-destaque' : '';

        let painelControleAdm = '';
        if (perfil === 'professor') {
            painelControleAdm = `
                <div class="adm-control-zone">
                    <span style="font-size:0.75rem; color:var(--azul-card-bg); font-weight:bold;">Alterar Status:</span>
                    <button class="btn-adm btn-adm-open" onclick="mudarStatusLicaoRemoto('${licao.id}', 'aberta')">Abrir</button>
                    <button class="btn-adm btn-adm-schedule" onclick="mudarStatusLicaoRemoto('${licao.id}', 'agendada')">Agendar</button>
                    <button class="btn-adm btn-adm-close" onclick="mudarStatusLicaoRemoto('${licao.id}', 'concluida')">Fechar</button>
                    <button class="btn-adm btn-adm-delete" onclick="deletarLicaoRemoto('${licao.id}')">❌ Deletar</button>
                </div>`;
        }

        let areaAcaoChamada = '';
        if (licao.status === 'aberta') {
            areaAcaoChamada = `
                <div class="box-action-area">
                    <button class="btn-action-trigger" ${usuarioJaConfirmou ? 'style="background:#6c757d; cursor:not-allowed;" disabled' : ''} onclick="assinarChamadaEletronica('${licao.id}')">
                        ${usuarioJaConfirmou ? '✅ PRESENÇA CONFIRMADA COM SUCESSO' : '🙋‍♂️ CLIQUE AQUI PARA CONFIRMAR PRESENÇA'}
                    </button>
                    <div style="margin-top:10px; font-size:0.82rem; color:#212529;">
                        <strong>Alunos confirmados nesta aula:</strong> 
                        <span style="color:var(--cor-sucesso); font-weight:bold;">${listaPresencas.length}</span>
                        <p style="color:#555; font-size:0.78rem; margin-top:3px; font-style:italic;">(${listaPresencas.join(', ') || 'Nenhum registro ainda.'})</p>
                    </div>
                </div>`;
        } else {
            areaAcaoChamada = `
                <div style="margin-top:8px; font-size:0.8rem; color:#6c757d;">
                    <span>Chamada fechada. Histórico de presentes: <strong>${listaPresencas.length}</strong></span>
                    <p style="font-size:0.75rem; color:#888;">(${listaPresencas.join(', ') || 'Sem presenças registradas'})</p>
                </div>`;
        }

        htmlConteudo += `
            <div class="inner-item-box ${cardExtraClass}">
                <span class="status-indicator ${badgeStyle}">${labelStatus}</span>
                <h4 style="color:var(--azul-card-bg); margin-bottom: 4px; font-size:1.05rem;">${licao.tema}</h4>
                <p style="font-size:0.82rem; color:#4a5568; margin-bottom:4px;">Nota: <em>${licao.observacao}</em></p>
                ${areaAcaoChamada}
                ${painelControleAdm}
            </div>`;
    });

    feed.innerHTML = htmlConteudo;
}

// ==========================================================================
// CONFIRMAÇÃO DE PRESENÇA (FAZ O CONTADOR E A BARRA SUBIREM DE IMEDIATO)
// ==========================================================================
function assinarChamadaEletronica(licaoId) {
    const nome = localStorage.getItem('usuarioLogado');
    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    
    if (!dPresenças[String(licaoId)]) dPresenças[String(licaoId)] = [];

    if (!dPresenças[String(licaoId)].includes(nome)) {
        dPresenças[String(licaoId)].push(nome);
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
        
        // Dispara o recálculo imediato dos contadores e da barra antes de re-renderizar a tela
        sincronizarTelasEReatividade();
    }
}

function publicarExercicioAvulso() {
    const titulo = document.getElementById('ex-extra-titulo').value.trim();
    const pergunta = document.getElementById('ex-extra-pergunta').value.trim();

    if (!titulo || !pergunta) {
        alert('Por favor, preencha o título e o enunciado.');
        return;
    }

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const novoExAvulso = {
        id: String(Date.now()),
        tema: `Atividade: ${titulo}`,
        pergunta: pergunta,
        observacao: "Exercício avulso criado pelos líderes.",
        isAvulso: true,
        status: "aberta"
    };

    licoes.unshift(novoExAvulso);
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));

    document.getElementById('ex-extra-titulo').value = '';
    document.getElementById('ex-extra-pergunta').value = '';

    sincronizarTelasEReatividade();
    alert('Exercício postado com sucesso!');
}

function atualizarAbaExercicios() {
    const container = document.getElementById('feed-exercicios');
    if (!container) return;

    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];
    const nomeUser = localStorage.getItem('usuarioLogado');

    const liberados = licoes.filter(l => l.status !== 'agendada' || l.isAvulso);

    if (liberados.length === 0) {
        container.innerHTML = '<p style="padding:10px; color:#666;">Nenhum exercício disponível no momento.</p>';
        return;
    }

    let htmlConteudo = '';

    liberados.forEach(licao => {
        const jaRespondeu = respostas.some(r => String(r.licaoId) === String(licao.id) && r.aluno === nomeUser);
        const filtradas = respostas.filter(r => String(r.licaoId) === String(licao.id));

        let feedRespostasGerais = '';
        if (filtradas.length > 0) {
            let itens = filtradas.map(r => `<p style="font-size:0.8rem; padding:4px 0; border-bottom:1px dashed #e2e8f0;"><strong>✅ ${r.aluno}:</strong> "${r.texto}"</p>`).join('');
            feedRespostasGerais = `<div style="margin-top:10px; background:#f1f5f9; padding:10px; border-radius:6px; border:1px solid #cbd5e1; color:#333;"><strong>Respostas coletadas:</strong>${itens}</div>`;
        }

        let interfaceEnvio = '';
        if (licao.status === 'concluida') {
            interfaceEnvio = '<p style="color:#6c757d; font-size:0.85rem; margin-top:5px;">🔒 Exercício encerrado.</p>';
        } else if (jaRespondeu) {
            interfaceEnvio = '<p style="color:var(--cor-sucesso); font-size:0.85rem; font-weight:bold; margin-top:5px;">✅ Atividade Respondida!</p>';
        } else {
            interfaceEnvio = `
                <div style="margin-top:10px; display:flex; gap:6px;">
                    <input type="text" id="ipt-${licao.id}" placeholder="Escreva sua resposta aqui..." style="flex:1; padding:8px; font-size:0.9rem;">
                    <button onclick="enviarExercicio('${licao.id}')" style="padding:8px 15px; background:var(--azul-card-bg); color:white; border:none; cursor:pointer; font-weight:bold; border-radius:6px;">Enviar</button>
                </div>`;
        }

        htmlConteudo += `
            <div class="inner-item-box" style="border-left: 4px solid var(--dourado-tema);">
                <h4 style="color:var(--azul-card-bg); font-size:0.95rem;">📋 ${licao.tema.includes(' - ') ? licao.tema.split(' - ')[1] : licao.tema}</h4>
                <p style="font-size:0.88rem; margin-top:5px; background:#f8fafc; padding:8px; border-radius:4px; border:1px solid #edf2f7;"><strong>Pergunta:</strong> ${licao.pergunta}</p>
                ${interfaceEnvio}
                ${feedRespostasGerais}
            </div>`;
    });

    container.innerHTML = htmlConteudo;
}

function enviarExercicio(licaoId) {
    const input = document.getElementById(`ipt-${licaoId}`);
    if (!input || !input.value.trim()) return alert('Digite uma resposta válida.');

    const nomeUser = localStorage.getItem('usuarioLogado');
    let respostas = JSON.parse(localStorage.getItem('bd_respostas')) || [];

    respostas.push({ licaoId: String(licaoId), aluno: nomeUser, texto: input.value.trim() });
    localStorage.setItem('bd_respostas', JSON.stringify(respostas));
    
    sincronizarTelasEReatividade();
    alert('Resposta salva com sucesso!');
}

function listarMembrosNaTela() {
    const container = document.getElementById('lista-oficial-membros');
    if (!container) return;

    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    if(document.getElementById('txt-total-membros-diario')) {
        document.getElementById('txt-total-membros-diario').innerText = membros.length;
    }

    const lideres = membros.filter(m => m.cargo === 'Líder/Professor');
    const alunos = membros.filter(m => m.cargo === 'Aluno');

    let htmlGerado = '';

    htmlGerado += `<div class="diario-secao-titulo">👥 Líderes e Professores (${lideres.length})</div>`;
    lideres.forEach(m => {
        htmlGerado += `
            <div class="membro-row">
                <span>⭐ <strong>${m.nome}</strong></span>
                <span class="badge-role role-professor">PROFESSOR / LÍDER</span>
            </div>`;
    });

    htmlGerado += `<div class="diario-secao-titulo">👨‍🎓 Alunos Integrantes (${alunos.length})</div>`;
    alunos.forEach(m => {
        htmlGerado += `
            <div class="membro-row">
                <span>👤 ${m.nome}</span>
                <span class="badge-role role-aluno">ALUNO</span>
            </div>`;
    });

    container.innerHTML = htmlGerado;
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

window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) iniciarSessao();
};
