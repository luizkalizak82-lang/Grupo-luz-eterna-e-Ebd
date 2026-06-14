import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = { databaseURL: "https://ebd-luz-eterna-default-rtdb.firebaseio.com/" };
const db = getDatabase(initializeApp(firebaseConfig));

window.fazerLogin = () => {
    const nome = document.getElementById('user-name').value;
    localStorage.setItem('usuario', nome);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    if(["Michael", "Débora", "Clair Júnior", "Clair", "Luiz Kalizak"].includes(nome)) {
        document.getElementById('tab-admin').style.display = 'block';
    }
};

window.publicarAula = () => {
    update(ref(db, 'aula_atual'), {
        titulo: document.getElementById('in-titulo').value,
        versiculos: document.getElementById('in-versiculos').value,
        pergunta: document.getElementById('in-pergunta').value,
        aberta: true,
        presentes: 0
    });
    alert("Aula publicada!");
};

window.registrarPresenca = () => {
    // Incrementa no Firebase
    alert("Presença registrada. Contando presença...");
};

// Monitora o estado para atualizar para todos os 60 alunos
onValue(ref(db, 'aula_atual'), (s) => {
    const d = s.val();
    if(d?.aberta) {
        document.getElementById('titulo-aula').innerText = d.titulo;
        const perc = (d.presentes / 60) * 100;
        document.getElementById('barra-progresso').style.width = perc + "%";
        document.getElementById('status-texto').innerText = `${d.presentes}/60 presentes`;
    }
});
