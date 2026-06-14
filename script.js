// ==========================================================================
// PORTAL EBD - SISTEMA LUZ ETERNA 2026 (PERSISTÊNCIA TOTAL E GERENCIAMENTO ADM)
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
        "Lição 13: Esperança em meio ao caos: aguardando a vinda do rei"
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

// ==========================================================================
// FUNÇÃO DE LOGIN CORRIGIDA (IGNORA MAIÚSCULAS/MINÚSCULAS)
// ==========================================================================
function ejecutarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    if (!nomeInput) return mostrarAlerta('login-alert', 'Informe o seu nome.');

    let membros = JSON.parse(localStorage.getItem('bd_membros'));
    let nomeBusca = normalizarTextoParaBusca(nomeInput);
    
    // Agora normaliza tanto a digitação quanto os itens salvos na lista para não haver erro
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
}

function sincronizarTelasEReatividade() {
    atualizarMétricasFrequência();
    atualizarFeedLicoes();
    atualizarAbaExercicios();
    listarMembrosNaTela();
}

function atualizarMétricasFrequência() {
    const licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    const dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    const membros = JSON.parse(localStorage.getItem('bd_membros')) || [];
    
    const totalAlunosInscritos = membros.filter(m => m.cargo === 'Aluno').length || 1;
    const licaoAtiva = licoes.find(l => l.status === 'aberta') || licoes[0];
    
    let totalPresentes = 0;
    if (licaoAtiva && dPresenças[String(licaoAtiva.id)]) {
        totalPresentes = dPresenças[String(licaoAtiva.id)].length;
    }

    let pct = ((totalPresentes / totalAlunosInscritos) * 100).toFixed(0);
    if (parseInt(pct) > 100) pct = '100';

    document.getElementById('txt-total-meta').innerText = totalAlunosInscritos;
    document.getElementById('txt-presentes-hoje').innerText = totalPresentes;
    document.getElementById('txt-porcentagem-hoje').innerText = `${pct}%`;
    document.getElementById('barra-progresso-frequencia').style.width = `${pct}%`;
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

    alert(`Aula "${tema}" publicada com sucesso e salva definitivamente!`);
    sincronizarTelasEReatividade();
}

function deletarLicaoRemoto(licaoId) {
    if (!confirm("Tem certeza absoluta de que deseja excluir permanentemente esta aula do sistema?")) return;

    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.filter(l => String(l.id) !== String(licaoId));
    localStorage.setItem('bd_licoes', JSON.stringify(licoes));

    let dPresenças = JSON.parse(localStorage.getItem('bd_presenças_v2')) || {};
    if (dPresenças[String(licaoId)]) {
        delete dPresenças[String(licaoId)];
        localStorage.setItem('bd_presenças_v2', JSON.stringify(dPresenças));
    }

    alert("Aula excluída com sucesso!");
    sincronizarTelasEReatividade();
}

function mudarStatusLicaoRemoto(licaoId, novoStatus) {
    let licoes = JSON.parse(localStorage.getItem('bd_licoes')) || [];
    licoes = licoes.map(l => {
        if (String(l.id) === String(licaoId)) l.status = novoStatus;
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

    feed.innerHTML = '';

    const licoesOrdenadas = [...licoes].sort((a, b) => {
        if (a.status === 'aberta' && b.status !== 'aberta') return -1;
        if (a.status !== 'aberta' && b.status === 'aberta') return 1;
        return 0;
    });

    licoesOrdenadas.forEach(licao => {
        if (licao.isAvulso) return;

        const listaPresencas = dPresenças[String(licao.id)] || [];
        const usuarioJaConfirmou = listaPresencas.includes(nome
