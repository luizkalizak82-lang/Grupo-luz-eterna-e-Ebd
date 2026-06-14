import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, update, get, child, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = { databaseURL: "https://ebd-luz-eterna-default-rtdb.firebaseio.com/" };
const db = getDatabase(initializeApp(firebaseConfig));

// Alterna entre Login e Cadastro
window.alternarForm = (formType) => {
    if (formType === 'cadastro') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('cadastro-form').style.display = 'block';
    } else {
        document.getElementById('cadastro-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
};

window.fazerLogin = async () => {
    const nome = document.getElementById('user-name').value;
    const snap = await get(child(ref(db), `membros/${nome}`));
    if (snap.exists()) {
        localStorage.setItem('usuario', nome);
        const perfil = snap.val().perfil;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        if (perfil === 'professor') document.getElementById('tab-admin').style.display = 'block';
    } else alert("Nome não autorizado.");
};

window.solicitarCadastro = async () => {
    const nome = document.getElementById('new-name').value;
    
    // 1. Cadastra no banco de dados com perfil 'aluno'
    await set(ref(db, `membros/${nome}`), {
        perfil: 'aluno'
    });
    
    // 2. Faz o login automático
    localStorage.setItem('usuario', nome);
    localStorage.setItem('perfil', 'aluno');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    alert(`Cadastro realizado com sucesso, ${nome}! Bem-vindo ao Luz Eterna.`);
};

// ... restante das funções (mostrar, publicarAula, onValue) permanecem iguais ...
