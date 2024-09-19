async function fetchVideos() {
    const apiKey = 'YOUR_API_KEY'; // Substitua com sua chave de API
    const allowedChannels = ['Channel1', 'Channel2'];
    const query = 'your search query';
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
    const data = await response.json();
    const videos = data.items.filter(item => allowedChannels.includes(item.snippet.channelTitle));
    
    const videoList = document.getElementById('video-list');
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.innerHTML = `<h3>${video.snippet.title}</h3><iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
        videoList.appendChild(videoElement);
    });
}

fetchVideos();
