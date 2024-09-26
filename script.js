

let allowedChannels = {};

// Função para buscar a whitelist do Firebase
async function fetchWhitelist() {
    try {
        const response = await fetch('https://fir-42a2e-default-rtdb.firebaseio.com/whitelist'); // URL correta do Firebase
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Atualiza o allowedChannels com os canais obtidos do Firebase
        allowedChannels = {};
        for (const key in data) { // Itera diretamente no objeto 'whitelist'
            if (data.hasOwnProperty(key)) {
                const channel = data[key];
                allowedChannels[channel.id] = channel.name; // Atualiza allowedChannels
            }
        }
        console.log("Whitelist atualizada:", allowedChannels);
    } catch (error) {
        console.error('Erro ao buscar a whitelist:', error);
    }
}

// Função para buscar vídeos com base em uma query
async function fetchVideos(query) {
    const apiKey = 'AIzaSyDxEJJAhX0Mb6X_pJceC2kSCxOmVv0Gi7w';

    // Faz a requisição para a API do YouTube
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
    const data = await response.json();

    // Filtra os vídeos com base na whitelist de allowedChannels
    const videos = data.items.filter(item => allowedChannels.hasOwnProperty(item.snippet.channelId));

    // Seleciona o elemento HTML onde os vídeos serão exibidos
    const videoList = document.getElementById('video-list');

    // Limpa os resultados antigos
    videoList.innerHTML = '';

    // Adiciona os vídeos filtrados à página
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-item'); // Classe CSS para estilização

        const titleElement = document.createElement('h3');
        titleElement.classList.add('video-title');
        titleElement.textContent = video.snippet.title;

        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('video-iframe');
        iframeElement.width = "560";
        iframeElement.height = "315";
        iframeElement.src = `https://www.youtube.com/embed/${video.id.videoId}`;
        iframeElement.frameBorder = "0";
        iframeElement.allowFullscreen = true;

        // Adiciona o título e o vídeo à página
        videoElement.appendChild(titleElement);
        videoElement.appendChild(iframeElement);
        videoList.appendChild(videoElement);
    });
}

// Função para inicializar a whitelist ao carregar a página
window.onload = async () => {
    await fetchWhitelist(); // Busca a whitelist antes de buscar os vídeos
};

// Adiciona o evento de clique ao botão de pesquisa
document.getElementById('search-btn').addEventListener('click', (event) => {
    event.preventDefault(); // Previne o envio do formulário
    const query = document.getElementById('search').value;  // Captura o valor da pesquisa
    if (query) {
        fetchVideos(query);  // Faz a busca dos vídeos
    }
});
