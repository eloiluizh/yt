let allowedChannels = {};
let currentPage = 1;
let itemsPerPage = 10;  // Defina quantos itens por página você deseja (pode ser alterado)
let totalPages = 1;
let allVideos = [];  // Armazena todos os vídeos retornados para uso nas páginas

// Função de depuração
function logDebug(message) {
    const debugLog = document.getElementById('debug-log');
    debugLog.textContent += message + '\n';
}

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
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&key=${apiKey}`);
        const data = await response.json();
        allVideos = data.items.filter(item => allowedChannels.hasOwnProperty(item.snippet.channelId));

        // Atualiza o total de páginas
        totalPages = Math.ceil(allVideos.length / itemsPerPage);
        currentPage = 1;

        displayVideos();
        displayPagination();
    } catch (error) {
        logDebug('Erro ao buscar vídeos: ' + error.message);
    }
}

// Função para exibir os vídeos da página atual
function displayVideos() {
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const videosToShow = allVideos.slice(startIndex, endIndex);

    if (videosToShow.length > 0) {
        videosToShow.forEach(video => {
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
    } else {
        logDebug('Nenhum vídeo encontrado ou canal fora da whitelist.');
    }
}

// Função para exibir a navegação de páginas
function displayPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.href = "#";
        pageLink.onclick = function (event) {
            event.preventDefault();  // Evita recarregar a página
            currentPage = i;
            displayVideos();  // Renderiza apenas os vídeos da página selecionada
        };
        if (i === currentPage) {
            pageLink.style.fontWeight = 'bold';  // Destaque para a página atual
        }
        pagination.appendChild(pageLink);
    }

    paginationContainer.appendChild(pagination);
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
