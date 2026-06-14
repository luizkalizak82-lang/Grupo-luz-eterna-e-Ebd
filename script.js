import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, update, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = { databaseURL: "https://ebd-luz-eterna-default-rtdb.firebaseio.com/" };
const db = getDatabase(initializeApp(firebaseConfig));

window.fazerLogin = async () => {
    const nome = document.getElementById('user-name').value;
    const snapshot = await get(child(ref(db), `membros/${nome}`));
    
    if (snapshot.exists()) {
        localStorage.setItem('usuario', nome);
        const perfil = snapshot.val().perfil;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        if (perfil === 'professor') document.getElementById('tab-admin').style.display = 'block';
    } else {
        alert("Nome não cadastrado na lista de membros.");
    }
};

window.mostrar = (aba) => {
    document.querySelectorAll('.aba').forEach(a => a.style.display = 'none');
    document.getElementById(aba).style.display = 'block';
};

window.publicarAula = () => {
    update(ref(db, 'aula_atual'), {
        titulo: document.getElementById('in-titulo').value,
        status: 'aberta',
        presentes: 0
    });
    alert("Aula publicada!");
};

// Monitora presença e libera resposta final
onValue(ref(db, 'aula_atual'), (s) => {
    const d = s.val();
    if(d) {
        document.getElementById('titulo-aula').innerText = d.titulo;
        const perc = (d.presentes / 60) * 100;
        document.getElementById('barra-progresso').style.width = perc + "%";
        document.getElementById('status-texto').innerText = `${d.presentes}/60 presentes`;
        if(d.status === 'finalizada') document.getElementById('resp-aluno').disabled = false;
    }
});
