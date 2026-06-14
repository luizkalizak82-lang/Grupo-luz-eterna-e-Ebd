// URL do seu banco de dados
const url = 'https://ebd-luz-eterna-default-rtdb.firebaseio.com/licoes.json';

async function carregarLicoes() {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao conectar com o banco');
        
        const dados = await resposta.json();
        const container = document.getElementById('lista-licoes');
        
        container.innerHTML = ''; // Limpa o "Carregando..."

        // Cria os cards dinamicamente
        Object.values(dados).forEach(licao => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            card.innerHTML = `
                <span class="status">AGENDADA</span>
                <div class="date">${licao.data}</div>
                <div><strong>${licao.titulo}</strong></div>
            `;
            container.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar lições:", erro);
        document.getElementById('lista-licoes').innerHTML = '<p>Erro ao carregar lições. Verifique o banco de dados.</p>';
    }
}

// Executa assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', carregarLicoes);
