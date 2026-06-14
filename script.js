// ==========================================================================
// PORTAL EBD LUZ ETERNA - CÓDIGO FINAL INTEGRADO
// ==========================================================================

const FIREBASE_URL = "https://ebd-luz-eterna-default-rtdb.firebaseio.com/";

// Lista Completa de Membros
const MEMBROS_BASE = [
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

// --- FUNÇÕES DE NUVEM ---
async function salvar(pasta, dados) {
    try {
        await fetch(`${FIREBASE_URL}${pasta}.json`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
    } catch (e) { console.error("Erro na Nuvem:", e); }
}

async function puxar(pasta) {
    try {
        let res = await fetch(`${FIREBASE_URL}${pasta}.json`);
        return await res.json();
    } catch (e) { return null; }
}

// --- AUTENTICAÇÃO E LOGIN ---
function executarLogin() {
    const nomeInput = document.getElementById('login-nome').value.trim();
    let membros = JSON.parse(localStorage.getItem('bd_membros') || "[]");
    let usuario = membros.find(m => m.nome.toLowerCase() === nomeInput.toLowerCase());
    
    if (!usuario) return alert("Nome não localizado na lista de classe.");
    
    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('perfil', usuario.cargo === "Líder/Professor" ? 'professor' : 'aluno');
    window.location.reload();
}

// --- SINCRONIZAÇÃO E INTERFACE ---
async function iniciarSessao() {
    // Garante que os membros estejam no Firebase
    let membrosNuvem = await puxar('membros');
    if (!membrosNuvem) {
        await salvar('membros', MEMBROS_BASE);
        localStorage.setItem('bd_membros', JSON.stringify(MEMBROS_BASE));
    } else {
        localStorage.setItem('bd_membros', JSON.stringify(membrosNuvem));
    }
    
    // Mostra o dashboard
    document.getElementById('tela-auth').style.display = 'none';
    document.getElementById('tela-dashboard').style.display = 'block';
    
    // Inicia a atualização automática
    setInterval(renderizarTudo, 3000);
    renderizarTudo();
}

async function renderizarTudo() {
    const licoes = await puxar('licoes') || [];
    const presencas = await puxar('presencas') || {};
    const container = document.getElementById('feed-licoes');
    if (!container) return;

    // Renderiza o cronograma (usando a lógica que você já tinha)
    container.innerHTML = licoes.map(licao => `
        <div class="card-aula" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <h3>${licao.tema}</h3>
            <p>Status: <strong>${licao.status}</strong></p>
            ${localStorage.getItem('perfil') === 'professor' ? 
                `<button onclick="alterarStatus('${licao.id}', 'aberta')">Abrir Presença</button>` : 
                (licao.status === 'aberta' ? `<button onclick="confirmarPresenca('${licao.id}')">Confirmar Presença</button>` : '')}
        </div>
    `).join('');
}

async function confirmarPresenca(licaoId) {
    const usuario = localStorage.getItem('usuarioLogado');
    let presencas = await puxar('presencas') || {};
    if (!presencas[licaoId]) presencas[licaoId] = [];
    if (!presencas[licaoId].includes(usuario)) {
        presencas[licaoId].push(usuario);
        await salvar('presencas', presencas);
        alert("Presença confirmada!");
        renderizarTudo();
    }
}

async function alterarStatus(licaoId, novoStatus) {
    let licoes = await puxar('licoes') || [];
    licoes = licoes.map(l => l.id === licaoId ? {...l, status: novoStatus} : l);
    await salvar('licoes', licoes);
    renderizarTudo();
}

window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) iniciarSessao();
};
