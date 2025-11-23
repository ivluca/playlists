import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants
const SUPABASE_URL = "https://usmfqjuniptwehgkiflp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbWZxanVuaXB0d2VoZ2tpZmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTQ3NzcsImV4cCI6MjA3MjczMDc3N30.azadza5uTpRlLpdlwoPr9siwt9MYnVK_zZptfenMils";
const CACHE_KEY = "playlists_cache";
const CACHE_TTL = 780000; // 13 minutes in ms
const FALLBACK_IMAGE = 'https://i.pinimg.com/736x/1a/31/0c/1a310c40c5ff58f701f02fd4e372998c.jpg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cache utilities
const cache = {
    get(key) {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            return Date.now() - timestamp < CACHE_TTL ? data : null;
        } catch (e) {
            console.error("Cache read error:", e);
            return null;
        }
    },

    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (e) {
            console.error("Cache write error:", e);
        }
    },

    clear(key) {
        localStorage.removeItem(key);
    }
};

// Playlist functions
async function loadPlaylists() {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
        renderPlaylists(cached);
        return;
    }

    try {
        const { data: playlists, error } = await supabase
            .from("playlists")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) throw error;

        cache.set(CACHE_KEY, playlists);
        renderPlaylists(playlists);
    } catch (error) {
        console.error("❌ Error loading playlists:", error);
    }
}

function renderPlaylists(playlists) {
    const container = document.getElementById("playlist-container");
    if (!container) return;

    container.innerHTML = playlists.map(pl => `
    <div class="flex items-center justify-between bg-white rounded-md shadow px-4 py-2 transition-all duration-300 ease-in-out playlist-item">
      <div class="flex items-center space-x-3 min-w-0" tabindex="-1">
        <img src="./library/point.png" alt="YouTube" class="w-7 h-7 flex-shrink-0 align-middle" tabindex="-1">
        <a href="${pl.url}" target="_blank" 
          class="font-medium truncate flex-grow min-w-0 pe-2 leading-tight align-middle text-blue-600 hover:underline url-link"
          tabindex="-1">
          ${pl.name}
        </a>
      </div>
      <a href="${pl.url}" target="_blank" class="playlist-play-button" tabindex="-1">
        <button 
          class="px-4 py-1 rounded-lg text-sm font-semibold border border-gray-300 flex-shrink-0 text-red-600 hover:bg-red-50 hover:scale-105 transition duration-300" 
          tabindex="0">
          Play
        </button>
      </a>
    </div>
  `).join('');
}

// Video fallback handler
function setupVideoFallback() {
    const albumVideo = document.getElementById('album-video');
    const albumMediaContainer = document.getElementById('album-media-container');

    if (!albumMediaContainer) return;

    const handleVideoError = () => {
        albumMediaContainer.innerHTML = `<img src="${FALLBACK_IMAGE}" class="w-full h-full object-cover" alt="Album cover">`;
    };

    if (albumVideo) {
        albumVideo.addEventListener('error', handleVideoError);

        // Check if video failed to load
        if (albumVideo.networkState === HTMLMediaElement.NETWORK_EMPTY ||
            albumVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            handleVideoError();
        }
    } else {
        handleVideoError();
    }
}

// Force reload
async function forceReload() {
    cache.clear(CACHE_KEY);
    cache.clear("socials_cache");
    await loadPlaylists();
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists();
    setupVideoFallback();

    const reloadBtn = document.getElementById("refresh-playlist");
    if (reloadBtn) {
        reloadBtn.addEventListener("click", forceReload);
    }
});

document.addEventListener("contextmenu", e => e.preventDefault());