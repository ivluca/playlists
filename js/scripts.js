async function loadPlaylists() {
    const res = await fetch("playlists.json");
    const playlists = await res.json();

    const container = document.getElementById("playlist-container");

    playlists.forEach(pl => {
        const item = document.createElement("div");
        item.className = ` flex items-center justify-between bg-white rounded-xl shadow p-4 transition-all duration-300 ease-in-out playlist-item `;

        item.innerHTML = `
            <div class="flex items-center space-x-3 min-w-0" tabindex="-1">
                <img src="point.png" alt="YouTube" class="w-7 h-7 flex-shrink-0 align-middle" tabindex="-1">
                <span class="font-medium truncate flex-grow min-w-0 pe-2 leading-tight align-middle" tabindex="-1">${pl.title}</span>
            </div>
            <a href="${pl.link}" target="_blank" class="playlist-play-button" tabindex="-1">
                <button 
                    class="px-4 py-1 rounded-lg text-sm font-semibold border border-gray-300 flex-shrink-0 text-red-600 hover:bg-red-50 hover:scale-105 transition duration-300" 
                    tabindex="0">
                    Play
                </button>
            </a>
        `;

        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists();

    const albumVideo = document.getElementById('album-video');
    const albumMediaContainer = document.getElementById('album-media-container');
    const fallbackImageUrl = 'https://i.pinimg.com/736x/1a/31/0c/1a310c40c5ff58f701f02fd4e372998c.jpg';

    function handleVideoError() {
        if (!albumMediaContainer) {
            console.error('error xyz.');
            return;
        }

        const imgFallback = document.createElement('img');
        imgFallback.src = fallbackImageUrl;
        imgFallback.className = 'w-full h-full object-cover';

        albumMediaContainer.innerHTML = '';
        albumMediaContainer.appendChild(imgFallback);
    }

    if (albumVideo) {
        albumVideo.addEventListener('error', handleVideoError);
        if (albumVideo.networkState === HTMLMediaElement.NETWORK_EMPTY || albumVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            handleVideoError();
        }
    } else {
        handleVideoError();
    }
});

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
    if (e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
    }
});