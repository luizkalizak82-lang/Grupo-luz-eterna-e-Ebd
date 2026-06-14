import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, set, child, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const db = getDatabase(initializeApp({ databaseURL: "https://ebd-luz-eterna-default-rtdb.firebaseio.com/" }));

const professores = ["Luiz Kalizak", "Michael Silva", "Eclair Cecília", "Débora", "Junior"];

const listaAlunos = [
    "Nadia Pezzini", "Paloma Pezzini", "Emily Júlia", "Camille", "Mikaelly", 
    "MICAELLI", "Kauan", "Ana Júlia", "Arthur Henrique", "Ellen", "Eliel", 
    "Gabriel", "Angel", "Guilherme", "Henrique", "Ícaro Gomes", "Jonathan", 
    "Kai", "Luiz Artur", "Maria Eduarda", "Matheus Silva", "Raíssa", "Sara", 
    "Tharsila", "Silvano", "Soares", "Kauê", "Kalil", "Anne", 
    "Borges", "Camila", "Christian", "Duda", "Felipe", "Gustavo", "Helen", 
    "Jonas", "Kathleen", "Domingos", "Lara", "Letícia", "Soares", "Mari", 
    "Madielle", "Orlana", "Eloísa", "Rayane Araújo", "Rayana Oliveira", 
    "Sara Fernanda", "Susane", "Thiago (H)", "Thiago (I)", "Vanessa Santos", "Davi Domingues"
];

// 1. Função para garantir que os alunos existam no banco (rode isso uma vez no console)
window.inicializarBanco = async () => {
    for (let nome of listaAlunos) {
        await set(ref(db, `membros/${nome}`), { perfil: 'aluno' });
    }
    alert("Lista de alunos carregada no banco!");
};

window.entrar = async () => {
    const nome = document.getElementById('user-name').value.trim();
    if (!nome) return alert("Digite seu nome!");

    const snap = await get(child(ref(db), `membros/${nome}`));
    
    if (snap.exists() || professores.includes(nome)) {
        localStorage.setItem('usuario', nome);
        
        // Registrar presença
        const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        set(ref(db, `presenca/${hoje}/${nome}`), { status: 'presente' });

        document.getElementById('login-area').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        if (professores.includes(nome)) {
            document.getElementById('btn-admin').style.display = 'inline-block';
        }
        window.abrir('aula');
    } else {
        alert("Nome não encontrado na lista.");
    }
};

window.abrir = (aba) => {
    const div = document.getElementById('conteudo-principal');
    
    if (aba === 'diario') {
        // Busca TODOS os membros para o diário
        get(ref(db, 'membros')).then(snapshot => {
            let html = "<h3>Diário de Classe - Lista Completa</h3><ul>";
            snapshot.forEach(c => {
                html += `<li>${c.key}</li>`;
            });
            div.innerHTML = html + "</ul>";
        });
    } else if (aba === 'admin') {
        div.innerHTML = `
            <div class="card">
                <h3>Painel Professor</h3>
                <input id="in-titulo" placeholder="Título da Aula">
                <textarea id="in-texto" placeholder="Conteúdo da aula"></textarea>
                <textarea id="in-pergunta" placeholder="Pergunta do dia"></textarea>
                <button class="gold" onclick="publicarAula()">Liberar Aula para Alunos</button>
            </div>`;
    }
    // ... restante das abas
};
