// --- CONFIGURAÇÕES INICIAIS ---
const LISTA_PROFESSORES = ["Luiz Gustavo Machado kalizak", "Michel", "Júnior", "Débora", "Eclair"];

// Inicialização automática das 13 Lições e Bancos Necessários
function inicializarBancoDeDados() {
    if (!localStorage.getItem('bd_licoes')) {
        const licoes = [
            { id: 1, tema: "Introdução ao Livro de Juízes", pergunta: "Qual o propósito central de Deus?" },
            { id: 2, tema: "O Ciclo de Apostasia", pergunta: "Por que o ciclo de pecado se repetia?" },
            { id: 3, tema: "Otniel, o Primeiro Juiz", pergunta: "O que Otniel nos ensina sobre coragem?" },
            { id: 4, tema: "Eúde e a Libertação", pergunta: "Como Deus usa pessoas comuns?" },
            { id: 5, tema: "Débora, uma Líder", pergunta: "Qual a importância da submissão a Deus?" },
            { id: 6, tema: "Gideão e a Fidelidade de Deus", pergunta: "Por que reduzir o exército?" },
            { id: 7, tema: "A Fé de Gideão na Batalha", pergunta: "Como vencer o medo?" },
            { id: 8, tema: "Abimeleque e a Ambição", pergunta: "Como a soberba destrói?" },
            { id: 9, tema: "Jefté e a Integridade", pergunta: "Qual a lição sobre votos?" },
            { id: 10, tema: "Sansão, o Separado", pergunta: "Como escolhas afetam o chamado?" },
            { id: 11, tema: "A Força e Fraqueza de Sansão", pergunta: "Como o autodomínio evita a queda?" },
            { id: 12, tema: "A Decomposição Moral", pergunta: "O que ocorre sem temor a Deus?" },
            { id: 13, tema: "Encerramento do Trimestre", pergunta: "Qual o maior ensinamento?" }
        ];
        localStorage.setItem('bd_licoes', JSON.stringify(licoes));
    }
    if (!localStorage.getItem('bd_membros')) localStorage.setItem('bd_membros', JSON.stringify([]));
}

// --- FUNÇÕES DE APOIO ---
function normalizar(texto) {
    return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// --- FLUXO DE LOGIN ---
function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value;
    let membros = JSON.parse(localStorage.getItem('bd_membros') || '[]');
    
    let usuario = membros.find(m => normalizar(m.nome) === normalizar(nomeInput));

    if (!usuario && LISTA_PROFESSORES.some(p => normalizar(p) === normalizar(nomeInput))) {
        usuario = { nome: nomeInput, cargo: "Líder/Professor" };
        membros.push(usuario);
        localStorage.setItem('bd_membros', JSON.stringify(membros));
    }

    if (usuario) {
        localStorage.setItem('usuarioLogado', usuario.nome);
        alert("Bem-vindo(a), " + usuario.nome);
        window.location.reload();
    } else {
        alert("Nome não localizado. Clique em Solicitar Cadastro.");
    }
}

// --- CADASTRO ---
function executarCadastro() {
    const nomeInput = document.getElementById('cad-nome').value;
    if (nomeInput.length < 3) return alert("Digite um nome válido.");
    
    let membros = JSON.parse(localStorage.getItem('bd_membros') || '[]');
    membros.push({ nome: nomeInput, cargo: "Aluno" });
    localStorage.setItem('bd_membros', JSON.stringify(membros));
    alert("Cadastro realizado!");
    alternarTela('tela-login');
}

// --- INTERFACE ---
function alternarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
}

// Inicializa tudo ao carregar
window.onload = inicializarBancoDeDados;
