async function fetchVideos(query) {
    const apiKey = 'AIzaSyDxEJJAhX0Mb6X_pJceC2kSCxOmVv0Gi7w'; // Substitua pela sua chave de API
    const allowedChannels = ['Jazzghost', 'Souzones'];

    // Faz a requisição para a API do YouTube
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
    const data = await response.json();

    const videos = data.items.filter(item => allowedChannels.includes(item.snippet.channelTitle));
    
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
        titleElement.classList.add('video-title');  // Adiciona a classe 'video-title'
        titleElement.textContent = video.snippet.title;
        
        // Cria o iframe do vídeo
        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('video-iframe');  // Adiciona a classe 'video-iframe'
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

// Adiciona o evento de clique ao botão de pesquisa
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search').value;  // Captura o valor da pesquisa
    if (query) {
        fetchVideos(query);  // Passa a query para a função que vai buscar os vídeos
    }
});
