const FIREBASE_URL = "https://ebd-luz-eterna-default-rtdb.firebaseio.com/";

async function sync(p, d = null) {
    if (d) await fetch(`${FIREBASE_URL}${p}.json`, { method: 'PUT', body: JSON.stringify(d) });
    return await (await fetch(`${FIREBASE_URL}${p}.json`)).json();
}

// CADASTRO
async function cadastrarAluno() {
    const nome = document.getElementById('novo-nome').value.trim();
    if (!nome) return alert("Digite um nome!");
    let membros = await sync('membros') || [];
    membros.push({ nome: nome, cargo: "Aluno" });
    await sync('membros', membros);
    alert("Cadastro concluído!");
    window.location.reload();
}

// LOGIN
function executarLogin() {
    const nome = document.getElementById('login-nome').value.trim();
    sync('membros').then(membros => {
        const usuario = membros.find(m => m.nome.toLowerCase() === nome.toLowerCase());
        if (!usuario) return alert("Nome não encontrado!");
        localStorage.setItem('usuarioLogado', usuario.nome);
        localStorage.setItem('perfil', usuario.cargo);
        window.location.reload();
    });
}

// GESTÃO DE LIÇÕES
async function adicionarLicao() {
    const tema = document.getElementById('novo-tema').value.trim();
    if (!tema) return alert("Digite o tema!");
    let licoes = await sync('licoes') || [];
    licoes.push({ id: Date.now(), tema, status: "agendada" });
    await sync('licoes', licoes);
    renderizarTudo();
}

async function excluirLicao(id) {
    let licoes = await sync('licoes');
    licoes = licoes.filter(l => l.id !== id);
    await sync('licoes', licoes);
    renderizarTudo();
}

async function atualizarAula(id, status) {
    let licoes = await sync('licoes');
    let l = licoes.find(l => l.id === id);
    l.status = status;
    await sync('licoes', licoes);
    renderizarTudo();
}

// RENDERIZAR
async function renderizarTudo() {
    const membros = await sync('membros') || [];
    const licoes = await sync('licoes') || [];
    const perfil = localStorage.getItem('perfil');
    
    document.getElementById('lista-oficial-membros').innerHTML = "<h3>Diário de Classe</h3>" + 
        membros.map(m => `<div class="membro-row"><strong>${m.nome}</strong> - ${m.cargo}</div>`).join('');
    
    document.getElementById('feed-licoes').innerHTML = licoes.map(l => `
        <div class="card-aula">
            <h3>${l.tema}</h3>
            <p>Status: ${l.status}</p>
            ${perfil === 'Líder/Professor' ? `
                <select onchange="atualizarAula(${l.id}, this.value)">
                    <option value="agendada" ${l.status==='agendada'?'selected':''}>Agendada</option>
                    <option value="aberta" ${l.status==='aberta'?'selected':''}>Abrir Chamada</option>
                    <option value="fechada" ${l.status==='fechada'?'selected':''}>Encerrada</option>
                </select>
                <button onclick="excluirLicao(${l.id})" style="background:red; color:white;">Excluir</button>
            ` : ''}
        </div>
    `).join('');
}

// NAVEGAÇÃO
function mudarConteudo(id) {
    document.getElementById('feed-licoes').style.display = (id === 'cronograma') ? 'block' : 'none';
    document.getElementById('lista-oficial-membros').style.display = (id === 'diario') ? 'block' : 'none';
}

function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function fazerLogout() { localStorage.clear(); window.location.reload(); }

window.onload = () => {
    if (localStorage.getItem('usuarioLogado')) {
        mostrarTela('tela-dashboard');
        if(localStorage.getItem('perfil') === 'Líder/Professor') document.getElementById('painel-professor').style.display = 'block';
        renderizarTudo();
    }
};
