// Função de depuração
function logDebug(message) {
    const debugLog = document.getElementById('debug-log');
    debugLog.textContent += message + '\n';
}

let allowedChannels = {};

// Função para buscar a whitelist do Firebase
async function fetchWhitelist() {
    try {
        logDebug('Buscando whitelist...');
        const response = await fetch('https://fir-42a2e-default-rtdb.firebaseio.com/whitelist.json');
        if (!response.ok) {
            throw new Error('Erro na resposta da whitelist');
        }
        const data = await response.json();
        allowedChannels = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const channel = data[key];
                allowedChannels[channel.id] = channel.name;
            }
        }
        logDebug('Whitelist carregada com sucesso: ' + JSON.stringify(allowedChannels));
    } catch (error) {
        logDebug('Erro ao buscar whitelist: ' + error.message);
    }
}

// Função para buscar vídeos com base em uma query
async function fetchVideos(query) {
    logDebug('Buscando vídeos para: ' + query);
    const apiKey = 'AIzaSyDxEJJAhX0Mb6X_pJceC2kSCxOmVv0Gi7w'; // Substitua pela sua chave de API
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
        const data = await response.json();
        const videos = data.items.filter(item => allowedChannels.hasOwnProperty(item.snippet.channelId));

        // Limpa o container de vídeos
        const videoList = document.getElementById('video-list');
        videoList.innerHTML = '';

        if (videos.length > 0) {
            videos.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('video-item');

                const titleElement = document.createElement('h3');
                titleElement.textContent = video.snippet.title;

                const iframeElement = document.createElement('iframe');
                iframeElement.width = "560";
                iframeElement.height = "315";
                iframeElement.src = `https://www.youtube.com/embed/${video.id.videoId}`;
                iframeElement.frameBorder = "0";
                iframeElement.allowFullscreen = true;

                videoElement.appendChild(titleElement);
                videoElement.appendChild(iframeElement);
                videoList.appendChild(videoElement);
            });
            logDebug('Vídeos carregados com sucesso');
        } else {
            logDebug('Nenhum vídeo encontrado ou canal fora da whitelist.');
        }
    } catch (error) {
        logDebug('Erro ao buscar vídeos: ' + error.message);
    }
}

// Inicializar whitelist ao carregar a página
window.onload = async () => {
    await fetchWhitelist();
};

// Adicionar evento ao botão de pesquisa
document.getElementById('search-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const query = document.getElementById('search').value;
    if (query) {
        fetchVideos(query);
    } else {
        logDebug('Por favor, insira uma pesquisa.');
    }
});
