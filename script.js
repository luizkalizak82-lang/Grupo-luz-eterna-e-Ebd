/* ==========================================================================
   JAVASCRIPT: PROGRAMAÇÃO E LÓGICA DINÂMICA DO PORTAL
   ========================================================================== */
const TOTAL_ALUNOS_MATRICULADOS = 42; 

// Banco de Dados das Lições e Cronogramas
const licoes = [
    { id: 1, revista: 'atual', num: 13, data: '2026-06-21', tema: 'O Triunfo e o Alívio', desc: 'Lição final de encerramento da revista corrente com grandes ensinamentos de vitória espiritual.', status: 'Agendada' },
    { id: 2, revista: 'atual', num: 14, data: '2026-06-28', tema: 'Discernimento Cristão', desc: 'Análise sobre a importância do discernment bíblico na caminhada do jovem contemporâneo.', status: 'Agendada' },
    
    { id: 3, revista: 'nova', num: 1, data: '2026-07-05', tema: 'O Livro de Juízes: Quando cada um fazia o que parecia certo', desc: 'Introdução histórica e espiritual ao período dos juízes e o perigo do relativismo moral.', status: 'Agendada' },
    { id: 4, revista: 'nova', num: 2, data: '2026-07-12', tema: 'A Fidelidade a Deus: Uma questão de escolha', desc: 'Estudo prático sobre o livre arbítrio e o peso das escolhas diante da soberania divina.', status: 'Agendada' },
    { id: 5, revista: 'nova', num: 3, data: '2026-07-19', tema: 'O Clamor e a Libertação da Liderança de Otoniel', desc: 'Como o arrependimento do povo move o coração de Deus para levantar os libertadores.', status: 'Agendada' },
    { id: 6, revista: 'nova', num: 4, data: '2026-07-26', tema: 'Sangar: Deus usa os improváveis', desc: 'Reflexão sobre como Deus capacita e usa pessoas comuns e ferramentas simples para grandes vitórias.', status: 'Agendada' },
    { id: 7, revista: 'nova', num: 5, data: '2026-08-02', tema: 'Débora, Baraque e União para fazer a Obra de Deus', desc: 'A importância da parceria, coragem feminina e submissão ao comando do Senhor.', status: 'Agendada' },
    { id: 8, revista: 'nova', num: 6, data: '2026-08-09', tema: 'Gideão: Deus transforma a insecurity em coragem', desc: 'A jornada de superação do menor da casa de seu pai, transformado em guerreiro valoroso.', status: 'Agendada' },
    { id: 9, revista: 'nova', num: 7, data: '2026-08-16', tema: 'O Final da Liderança de Gideão e o Governo de Abimeleque', desc: 'Alertas cruciais sobre o perigo do orgulho e a ambição desmedida pelo poder terreno.', status: 'Agendada' },
    { id: 10, revista: 'nova', num: 8, data: '2026-08-23', tema: 'Jefté: De rejeitado a libertador', desc: 'Superando rejeições familiares e sociais através do cumprimento do propósito divino.', status: 'Agendada' },
    { id: 11, revista: 'nova', num: 9, data: '2026-08-30', tema: 'Sansão: A força e a fraqueza de um jovem', desc: 'Estudo focado na juventude, os dons extraordinários e a necessidade vital de domínio próprio.', status: 'Agendada' },
    { id: 12, revista: 'nova', num: 10, data: '2026-09-06', tema: 'Sansão entre Vitórias e Derrotas', desc: 'A misericórdia divina que permanece ativa mesmo diante das falhas e quedas humanas.', status: 'Agendada' },
    { id: 13, revista: 'nova', num: 11, data: '2026-09-13', tema: 'Crise Espiritual e Falsa Religiosidade', desc: 'Desmascarando rituais vazios e a idolatria camuflada no cotidiano cristão.', status: 'Agendada' },
    { id: 14, revista: 'nova', num: 12, data: '2026-09-20', tema: 'Tempos de Decadência Moral e Maldade', desc: 'Como o afastamento das Escrituras gera o colapso ético e social de uma comunidade.', status: 'Agendada' },
    { id: 15, revista: 'nova', num: 13, data: '2026-09-27', tema: 'Esperança em Meio ao Caos: Aguardando a vinda do Rei', desc: 'Encerramento triunfal apontando para a redenção plena e o Reinado Supremo de Cristo.', status: 'Agendada' }
];

let usuarioLogado = null;

// Inicialização automática ao abrir o site
document.addEventListener("DOMContentLoaded", () => {
    inicializarBancoFalso();
    renderizarLicoes();
    verificarSessao();
    atualizarWidgets();
});

function inicializarBancoFalso() {
    if (!localStorage.getItem("ebd_membros")) {
        const membrosIniciais = [
            { nome: "Professor Lucas Oliveira", funcao: "Líder/Professor", presencas: ["2026-06-21"] },
            { nome: "Amanda Costa Medeiros", funcao: "Aluno", presencas: ["2026-06-21"] },
            { nome: "Mateus Henrique Souza", funcao: "Aluno", presencas: ["2026-06-21"] },
            { nome: "Sarah Rebeca Lima", funcao: "Aluno", presencas: ["2026-06-21"] },
            { nome: "Daniel Ferreira", funcao: "Aluno", presencas: ["2026-06-21"] }
        ];
        localStorage.setItem("ebd_membros", JSON.stringify(membrosIniciais));
    }
}

function navegarPara(idTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(idTela).classList.add('ativa');
    atualizarWidgets();
}

function alternarAbasAuth(mostrarCadastro) {
    document.getElementById("auth-login-view").style.display = mostrarCadastro ? "none" : "block";
    document.getElementById("auth-cadastro-view").style.display = mostrarCadastro ? "block" : "none";
}

function executarCadastro() {
    const nomeInput = document.getElementById("cadastro-nome").value.trim();
    const funcaoInput = document.getElementById("cadastro-funcao").value;
    const alertBox = document.getElementById("cadastro-alert");

    if (!nomeInput) {
        alertBox.textContent = "Por favor, insira o seu nome completo.";
        alertBox.style.display = "block";
        return;
    }

    let membros = JSON.parse(localStorage.getItem("ebd_membros"));

    if (membros.some(m => m.nome.toLowerCase() === nomeInput.toLowerCase())) {
        alertBox.textContent = "Este nome já se encontra registrado no grupo.";
        alertBox.style.display = "block";
        return;
    }

    const novoMembro = { nome: nomeInput, funcao: funcaoInput, presencas: [] };
    membros.push(novoMembro);
    localStorage.setItem("ebd_membros", JSON.stringify(membros));

    definirSessaoUsuario(novoMembro);
}

function executarLogin() {
    const nomeInput = document.getElementById("login-nome").value.trim();
    const alertBox = document.getElementById("login-alert");

    if (!nomeInput) {
        alertBox.textContent = "Por favor, digite o seu nome para acessar.";
        alertBox.style.display = "block";
        return;
    }

    const membros = JSON.parse(localStorage.getItem("ebd_membros"));
    const usuarioEncontrado = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());

    if (!usuarioEncontrado) {
        alertBox.textContent = "Nome não localizado. Verifique se digitou corretamente ou faça o cadastro.";
        alertBox.style.display = "block";
        return;
    }

    definirSessaoUsuario(usuarioEncontrado);
}

function definirSessaoUsuario(membro) {
    usuarioLogado = membro;
    localStorage.setItem("ebd_sessao_atual", JSON.stringify(membro));
    
    document.getElementById("nome-usuario-logado").textContent = membro.nome;
    document.getElementById("nav-principal").style.display = "flex";
    document.getElementById("tela-auth").classList.remove('ativa');
    
    navegarPara("tela-dashboard");
}

function verificarSessao() {
    const sessaoSalva = localStorage.getItem("ebd_sessao_atual");
    if (sessaoSalva) {
        const dados = JSON.parse(sessaoSalva);
        const membros = JSON.parse(localStorage.getItem("ebd_membros"));
        const mestre = membros.find(m => m.nome === dados.nome);
        if (mestre) definirSessaoUsuario(mestre);
    }
}

function fazerLogout() {
    localStorage.removeItem("ebd_sessao_atual");
    usuarioLogado = null;
    document.getElementById("nav-principal").style.display = "none";
    navegarPara("tela-auth");
}

function renderizarLicoes() {
    const containerAtual = document.getElementById("lista-revista-atual");
    const containerNova = document.getElementById("lista-revista-nova");
    
    containerAtual.innerHTML = "";
    containerNova.innerHTML = "";

    licoes.forEach(lic => {
        const dataFormatada = new Date(lic.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const html = `
            <div class="lesson-item">
                <div class="lesson-info">
                    <h4>Lição ${lic.num}: ${lic.tema}</h4>
                    <p>${lic.desc}</p>
                    <p style="margin-top: 0.3rem; font-size: 0.8rem; color: var(--azul-medio); font-weight: 500;">
                        📅 Domingo: ${dataFormatada}
                    </p>
                </div>
                <div>
                    <span class="lesson-badge ${lic.num === 13 && lic.revista === 'atual' ? 'badge-next' : 'badge-scheduled'}">
                        ${lic.num === 13 && lic.revista === 'atual' ? 'Próxima Aula' : lic.status}
                    </span>
                </div>
            </div>
        `;
        if (lic.revista === 'atual') containerAtual.innerHTML += html;
        else containerNova.innerHTML += html;
    });
}

function obterAulaDestaque() {
    return licoes.find(l => l.num === 13 && l.revista === 'atual');
}

function atualizarWidgets() {
    if (!usuarioLogado) return;

    const aula = obterAulaDestaque();
    const dataAulaFormatada = new Date(aula.data + 'T00:00:00').toLocaleDateString('pt-BR');

    // 1. Destaque da Aula
    const areaDestaque = document.getElementById("conteudo-proxima-aula");
    areaDestaque.innerHTML = `
        <h3 style="color: var(--azul-medio); margin-bottom: 0.4rem;">Lição ${aula.num} - ${aula.tema}</h3>
        <p style="font-size: 0.95rem; color: var(--cinza-texto); margin-bottom: 0.8rem;">${aula.desc}</p>
        <span style="font-size: 0.85rem; background-color: var(--dourado-claro); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600;">
            📅 Data Oficial: ${dataAulaFormatada}
        </span>
    `;

    // 2. Caixa de chamada rápida
    document.getElementById("presence-date-text").textContent = dataAulaFormatada;
    document.getElementById("presence-theme-text").textContent = `Tema: ${aula.tema}`;

    const membros = JSON.parse(localStorage.getItem("ebd_membros"));
    const eu = membros.find(m => m.nome === usuarioLogado.nome);
    const btnPresenca = document.getElementById("btn-marcar-presenca");

    if (eu && eu.presencas.includes(aula.data)) {
        btnPresenca.textContent = "✓ PRESENÇA CONFIRMADA";
        btnPresenca.disabled = true;
        btnPresenca.style.backgroundColor = "#7bc696";
    } else {
        btnPresenca.textContent = "CONFIRMAR PRESENÇA";
        btnPresenca.disabled = false;
        btnPresenca.style.backgroundColor = "var(--sucesso)";
    }

    // 3. Cálculos matemáticos baseados nos 42 Alunos
    const totalPresentesHoje = membros.filter(m => m.presencas.includes(aula.data)).length;
    const porcentagemGeral = ((totalPresentesHoje / TOTAL_ALUNOS_MATRICULADOS) * 100).toFixed(1);

    const barraProgresso = document.getElementById("barra-progresso-aula");
    const textoProgresso = document.getElementById("texto-progresso-aula");
    const insightTexto = document.getElementById("insight-presenca");

    barraProgresso.style.width = `${Math.min(porcentagemGeral, 100)}%`;
    textoProgresso.textContent = `${porcentagemGeral}% (${totalPresentesHoje} de ${TOTAL_ALUNOS_MATRICULADOS} presentes)`;

    if (porcentagemGeral == 0) {
        insightTexto.textContent = "⏰ Nenhum aluno registrou presença ainda. Vamos incentivar a classe!";
        insightTexto.style.color = "var(--alerta)";
    } else if (porcentagemGeral < 50) {
        insightTexto.textContent = "📉 Estamos abaixo da metade da classe. Incentive os jovens a confirmarem!";
        insightTexto.style.color = "var(--alerta)";
    } else if (porcentagemGeral >= 50 && porcentagemGeral < 80) {
        insightTexto.textContent = "🚀 Mais da metade da classe presente! Glória a Deus, continue convidando.";
        insightTexto.style.color = "var(--azul-medio)";
    } else {
        insightTexto.textContent = "🔥 Excelente engajamento! Quase a totalidade dos 42 alunos participando!";
        insightTexto.style.color = "var(--sucesso)";
    }

    // 4. Mini Ranking lateral
    const areaRanking = document.getElementById("dashboard-ranking");
    areaRanking.innerHTML = "";
    const membrosOrdenados = [...membros].sort((a,b) => b.presencas.length - a.presencas.length).slice(0, 4);
    membrosOrdenados.forEach(m => {
        areaRanking.innerHTML += `
            <div class="membro-row">
                <span class="membro-name">${m.nome} <small style="color: #888; font-size: 0.75rem;">(${m.funcao})</small></span>
                <span class="membro-stats">${m.presencas.length} pres.</span>
            </div>
        `;
    });

    // 5. Lista completa na aba de Membros
    const areaMembrosCompleta = document.getElementById("lista-oficial-membros");
    areaMembrosCompleta.innerHTML = "";
    membros.forEach(m => {
        const listaDatas = m.presencas.length > 0 
            ? m.presencas.map(d => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')).join(', ') 
            : "Nenhuma presença registrada ainda";

        areaMembrosCompleta.innerHTML += `
            <div style="padding: 1rem; border-bottom: 1px solid #eee; margin-bottom: 0.5rem; background-color: #fcfdfd; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <strong style="color: var(--azul-escuro); font-size: 1.05rem;">${m.nome}</strong>
                    <span style="font-size: 0.8rem; padding: 0.2rem 0.5rem; background-color: var(--azul-medio); color: white; border-radius: 4px;">${m.funcao}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--cinza-texto);">
                    <strong>Dias presentes:</strong> <span style="color: var(--sucesso); font-weight: 500;">${listaDatas}</span> (${m.presencas.length} frequências registradas)
                </p>
            </div>
        `;
    });
}

function marcarPresencaAtual() {
    if (!usuarioLogado) return;
    const aula = obterAulaDestaque();
    let membros = JSON.parse(localStorage.getItem("ebd_membros"));
    const index = membros.findIndex(m => m.nome === usuarioLogado.nome);
    
    if (index !== -1) {
        if (!membros[index].presencas.includes(aula.data)) {
            membros[index].presencas.push(aula.data);
            localStorage.setItem("ebd_membros", JSON.stringify(membros));
            
            const dashAlert = document.getElementById("dashboard-alert");
            dashAlert.textContent = `Glória a Deus! Sua presença na Lição ${aula.num} foi registrada!`;
            dashAlert.style.display = "block";
            setTimeout(() => dashAlert.style.display = "none", 5000);

            atualizarWidgets();
        }
    }
}
