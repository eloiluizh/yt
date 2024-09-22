let allowedChannels = {};

// Função para buscar a whitelist do Firebase
async function fetchWhitelist() {
    try {
        const response = await fetch('https://fir-42a2e-default-rtdb.firebaseio.com/whitelist.json'); // Substitua pela URL do seu Firebase
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allowedChannels = {};
        for (const key in data.whitelist) {
            if (data.whitelist.hasOwnProperty(key)) {
                const channel = data.whitelist[key];
                allowedChannels[channel.id] = channel.name; // Atualiza allowedChannels
            }
        }
    } catch (error) {
        console.error('Erro ao buscar a whitelist:', error);
    }
}

async function fetchVideos(query) {
    const apiKey = 'AIzaSyDxEJJAhX0Mb6X_pJceC2kSCxOmVv0Gi7w'; // Sua chave de API

    // Faz a requisição para a API do YouTube
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
    const data = await response.json();

    const videos = data.items.filter(item => {
        return allowedChannels.hasOwnProperty(item.snippet.channelId); // Filtra usando allowedChannels
    });
    
    const videoList = document.getElementById('video-list');

    // Limpa os resultados antigos
    videoList.innerHTML = '';

    // Adiciona os vídeos filtrados à página
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        
        // Atribui classes para estilização
        videoElement.classList.add('video-item');
        
        // Cria o título do vídeo
        const titleElement = document.createElement('h3');
        titleElement.classList.add('video-title');
        titleElement.textContent = video.snippet.title;
        
        // Cria o iframe do vídeo
        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('video-iframe');
        iframeElement.width = "560";
        iframeElement.height = "315";
        iframeElement.src = `https://www.youtube.com/embed/${video.id.videoId}`;
        iframeElement.frameBorder = "0";
        iframeElement.allowFullscreen = true;
        
        // Adiciona o título e o iframe dentro da div do vídeo
        videoElement.appendChild(titleElement);
        videoElement.appendChild(iframeElement);
        
        // Adiciona o vídeo ao container principal
        videoList.appendChild(videoElement);
    });
}

// Chama fetchWhitelist ao carregar a página
window.onload = async () => {
    await fetchWhitelist(); // Busca a whitelist
};

// Adiciona o evento de clique ao botão de pesquisa
document.getElementById('search-btn').addEventListener('click', (event) => {
    event.preventDefault(); // Previne o envio do formulário
    const query = document.getElementById('search').value;  // Captura o valor da pesquisa
    if (query) {
        fetchVideos(query);  // Passa a query para a função que vai buscar os vídeos
    }
});
