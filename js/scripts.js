import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://usmfqjuniptwehgkiflp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbWZxanVuaXB0d2VoZ2tpZmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTQ3NzcsImV4cCI6MjA3MjczMDc3N30.azadza5uTpRlLpdlwoPr9siwt9MYnVK_zZptfenMils";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPlaylists() {
  const CACHE_KEY = "playlists_cache";
  const CACHE_TTL = 1000 * 60 * 13;

  const now = Date.now();

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);

    if (now - timestamp < CACHE_TTL) {
      console.log("Load playlists from cache");
      renderPlaylists(data);
      return;
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  console.log("Fetch playlists from Supabase");
  const { data: playlists, error } = await supabase
    .from("playlists")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error loading playlists:", error);
    return;
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: playlists,
    timestamp: now
  }));

  renderPlaylists(playlists);
}

function renderPlaylists(playlists) {
  const container = document.getElementById("playlist-container");
  container.innerHTML = "";

  playlists.forEach(pl => {
    const item = document.createElement("div");
    item.className = `flex items-center justify-between bg-white rounded-xl shadow p-4 transition-all duration-300 ease-in-out playlist-item`;

    item.innerHTML = `
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
    `;

    container.appendChild(item);
  });
}

async function loadSocials() {
  const CACHE_KEY = "socials_cache";
  const CACHE_TTL = 1000 * 60 * 13; // 13 phút

  const now = Date.now();

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);

    if (now - timestamp < CACHE_TTL) {
      console.log("Load socials from cache");
      renderSocials(data);
      return;
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  console.log("Fetch socials from Supabase");
  const { data: socials, error } = await supabase
    .from("socials")
    .select("name, url")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error loading socials:", error);
    return;
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: socials,
    timestamp: now
  }));

  renderSocials(socials);
}

function renderSocials(socials) {
  const container = document.getElementById("socials-container");
  if (!container) return;

  container.innerHTML = "";

  socials.forEach(sc => {
    const link = document.createElement("a");
    link.href = sc.url;
    link.target = "_blank";
    link.className = "social-link text-blue-300 hover:underline mx-2";
    link.textContent = sc.name;

    container.appendChild(link);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlaylists();
  loadSocials();

  const reloadBtn = document.getElementById("reload-btn");
  reloadBtn.addEventListener("click", () => {
    reloadBtn.classList.add("spin-once");

    reloadBtn.addEventListener("animationend", () => {
      reloadBtn.classList.remove("spin-once");
    }, { once: true });

    forceReload();
  });

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

async function forceReload() {
  console.log("Force reload from Supabase...");

  localStorage.removeItem("playlists_cache");
  localStorage.removeItem("socials_cache");

  await Promise.all([
    loadPlaylists(),
    loadSocials()
  ]);

  console.log("Reload completed!");
}


document.addEventListener("contextmenu", e => e.preventDefault()); ``

// document.addEventListener("keydown", e => {
//   if (e.key === "F12" ||
//     (e.ctrlKey && e.shiftKey && e.key === "I") ||
//     (e.ctrlKey && e.shiftKey && e.key === "J") ||
//     (e.ctrlKey && e.key === "U")) {
//     e.preventDefault();
//   }
// });