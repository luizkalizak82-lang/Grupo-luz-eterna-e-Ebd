import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, set, child, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const db = getDatabase(initializeApp({ databaseURL: "https://ebd-luz-eterna-default-rtdb.firebaseio.com/" }));

window.entrar = async () => {
    const nome = document.getElementById('user-name').value;
    const snap = await get(child(ref(db), `membros/${nome}`));
    if (snap.exists()) {
        localStorage.setItem('usuario', nome);
        if(snap.val().perfil === 'professor') document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        await set(ref(db, `membros/${nome}`), { perfil: 'aluno' });
        window.entrar();
    }
};

window.publicarAula = () => {
    set(ref(db, 'aula_ativa'), {
        titulo: document.getElementById('in-titulo').value,
        texto: document.getElementById('in-texto').value,
        pergunta: document.getElementById('in-pergunta').value
    });
    alert("Aula publicada!");
};

window.abrir = (aba) => {
    const div = document.getElementById('conteudo-principal');
    if(aba === 'aula') {
        onValue(ref(db, 'aula_ativa'), (s) => {
            const d = s.val();
            div.innerHTML = `<h3>${d.titulo}</h3><p>${d.texto}</p><p>Pergunta: ${d.pergunta}</p>`;
        });
    } else if(aba === 'diario') {
        get(ref(db, 'membros')).then(s => {
            let html = "<ul>";
            s.forEach(c => html += `<li>${c.key}</li>`);
            div.innerHTML = "<h3>Membros</h3>" + html + "</ul>";
        });
    }
};
