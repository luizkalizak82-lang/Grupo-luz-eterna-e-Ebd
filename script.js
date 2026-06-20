const licoes = [
    "Lição 1: O Livro de Juízes: quando cada um fazia o que parecia certo",
    "Lição 2: Fidelidade a Deus: uma questão de escolha",
    "Lição 3: Clamor e libertação: a liderança de Otniel",
    "Lição 4: Eúde e Sangar: Deus usa os improváveis",
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

function fazerLogin() {
    const user = document.getElementById('user').value;
    if(user !== "") { // Login simplificado para teste
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        mostrar('licoes');
    } else {
        alert("Digite um usuário.");
    }
}

function mostrar(secao) {
    const cont = document.getElementById('conteudo-dinamico');
    cont.innerHTML = `<h2>${secao.toUpperCase()}</h2>`;
    
    if (secao === 'licoes') {
        licoes.forEach((texto, i) => {
            cont.innerHTML += `<div class='card'><h3>Lição ${i + 1}</h3><p>${texto}</p></div>`;
        });
    } else if (secao === 'avisos') {
        cont.innerHTML += `<div class='card'>Avisos e perguntas da semana estarão aqui.</div>`;
    } else {
        cont.innerHTML += `<div class='card'>Agenda de eventos do grupo Luz Eterna.</div>`;
    }
}

function logout() {
    location.reload();
}
