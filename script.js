const FESTIVALS = {
  durga: {
    name: "Durga Puja",
    mark: "01",
    subtitle: "The first Puja day is almost here.",
    target: "2026-10-16T00:00:00+05:30",
    date: "Friday, 16 October 2026",
    playlistName: "Durga Puja",
    spotifyId: "0z11u9nIBzaddobcW4ujFO",
    background: "durga-puja.jpg"
  },
  kali: {
    name: "Kali Puja",
    mark: "02",
    subtitle: "A night of lights, devotion and celebration.",
    target: "2026-11-08T00:00:00+05:30",
    date: "Sunday, 8 November 2026",
    playlistName: "Kali Puja",
    spotifyId: "0sBXfKzF43guyOY9FXRofi",
    background: "kali-puja.jpg"
  },
  diwali: {
    name: "Diwali",
    mark: "03",
    subtitle: "The festival of lights is getting closer.",
    target: "2026-11-08T00:00:00+05:30",
    date: "Sunday, 8 November 2026",
    playlistName: "Diwali",
    spotifyId: "0bp35vrrt5SIWqf2NW7Ue4",
    background: "diwali.jpg"
  }
};

// Spotify playlist shown in the embed code supplied for this update.
const FEATURED_PLAYLIST_ID = "0jg7iCdiBFijHM7qo7ZeF2";

let selected = "durga";

const $ = (s) => document.querySelector(s);

function updateCountdown() {
  const f = FESTIVALS[selected];
  const diff = new Date(f.target).getTime() - Date.now();

  if (diff <= 0) {
    $("#days").textContent = "00";
    $("#hours").textContent = "00";
    $("#minutes").textContent = "00";
    $("#seconds").textContent = "00";
    return;
  }

  const total = Math.floor(diff / 1000);
  $("#days").textContent = String(Math.floor(total / 86400));
  $("#hours").textContent = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
  $("#minutes").textContent = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  $("#seconds").textContent = String(total % 60).padStart(2, "0");
}

function spotifyEmbed(id, title, height = 152) {
  const iframe = document.createElement("iframe");
  iframe.title = `Spotify Embed: ${title}`;
  iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  iframe.width = "100%";
  iframe.height = String(height);
  iframe.style.minHeight = `${height}px`;
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.loading = "lazy";
  return iframe;
}

function renderPlayer() {
  const f = FESTIVALS[selected];
  $("#playlistName").textContent = f.playlistName;
  $("#playlistStatus").textContent = "Spotify playlist • embedded in Utsav";
  $("#spotifyPlayer").replaceChildren(spotifyEmbed(f.spotifyId, f.playlistName, 152));
}

function renderMain() {
  const f = FESTIVALS[selected];

  $("#festivalMark").textContent = f.mark;
  $("#festivalTitle").textContent = f.name;
  $("#festivalSubtitle").textContent = f.subtitle;
  $("#targetDate").textContent = f.date;
  $("#scene").style.backgroundImage = `url("${f.background}")`;

  document.querySelectorAll(".tab").forEach((button) => {
    const active = button.dataset.festival === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });

  renderPlayer();
  updateCountdown();
}

function openPlaylist() {
  const f = FESTIVALS[selected];
  $("#modalTitle").textContent = f.name;
  $("#modalSpotify").replaceChildren(spotifyEmbed(f.spotifyId, f.playlistName, 520));
  $("#playlistModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closePlaylist() {
  $("#playlistModal").hidden = true;
  document.body.style.overflow = "";
  $("#modalSpotify").replaceChildren();
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    selected = button.dataset.festival;
    renderMain();
  });
});

$("#openPlaylist").addEventListener("click", openPlaylist);
$("#closePlaylist").addEventListener("click", closePlaylist);
$("#closeByBackdrop").addEventListener("click", closePlaylist);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#playlistModal").hidden) closePlaylist();
});

renderMain();
window.setInterval(updateCountdown, 1000);
