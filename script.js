const FESTIVALS = {
  durga: {
    name: "Durga Puja",
    mark: "01",
    subtitle: "The first Puja day is almost here.",
    target: "2026-10-16T00:00:00+05:30",
    date: "Friday, 16 October 2026",
    playlistName: "Pujo Mood",
    description: "The main curated Durga Puja playlist.",
    spotifyId: "0z11u9nIBzaddobcW4ujFO",
    background: "durga-puja.jpg"
  },
  kali: {
    name: "Kali Puja",
    mark: "02",
    subtitle: "A night of lights, devotion and celebration.",
    target: "2026-11-08T00:00:00+05:30",
    date: "Sunday, 8 November 2026",
    playlistName: "Shyama Night",
    description: "A playlist for the Kali Puja night.",
    spotifyId: "0sBXfKzF43guyOY9FXRofi",
    background: "kali-puja.jpg"
  },
  diwali: {
    name: "Diwali",
    mark: "03",
    subtitle: "The festival of lights is getting closer.",
    target: "2026-11-08T00:00:00+05:30",
    date: "Sunday, 8 November 2026",
    playlistName: "Diwali Glow",
    description: "Music for the festival of lights.",
    spotifyId: "0bp35vrrt5SIWqf2NW7Ue4",
    background: "diwali.jpg"
  }
};

let selected = "durga";
let modalSelected = "durga";

const $ = (s) => document.querySelector(s);

function pad(n){ return String(n).padStart(2,"0"); }

function updateCountdown(){
  const f = FESTIVALS[selected];
  const diff = new Date(f.target).getTime() - Date.now();

  if(diff <= 0){
    $("#days").textContent = "00";
    $("#hours").textContent = "00";
    $("#minutes").textContent = "00";
    $("#seconds").textContent = "00";
    $("#festivalSubtitle").textContent = "The celebration has arrived.";
    return;
  }

  const total = Math.floor(diff / 1000);
  $("#days").textContent = String(Math.floor(total / 86400));
  $("#hours").textContent = pad(Math.floor((total % 86400) / 3600));
  $("#minutes").textContent = pad(Math.floor((total % 3600) / 60));
  $("#seconds").textContent = pad(total % 60);
}

function spotifyEmbed(id, title){
  const iframe = document.createElement("iframe");
  iframe.title = `${title} Spotify playlist`;
  iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.loading = "lazy";
  return iframe;
}

function renderMain(){
  const f = FESTIVALS[selected];

  $("#festivalMark").textContent = f.mark;
  $("#festivalTitle").textContent = f.name;
  $("#festivalSubtitle").textContent = f.subtitle;
  $("#targetDate").textContent = f.date;
  $("#playlistName").textContent = f.playlistName;

  $("#scene").style.backgroundImage = `url("${f.background}")`;

  document.querySelectorAll(".tab").forEach((b)=>{
    const active = b.dataset.festival === selected;
    b.classList.toggle("active", active);
    b.setAttribute("aria-current", active ? "page" : "false");
  });

  const player = $("#spotifyPlayer");
  player.replaceChildren(spotifyEmbed(f.spotifyId, f.playlistName));
  updateCountdown();
}

function renderModal(){
  const f = FESTIVALS[modalSelected];
  $("#modalTitle").textContent = f.name;
  $("#modalDescription").textContent = f.description;

  document.querySelectorAll(".modal-tab").forEach((b)=>{
    b.classList.toggle("active", b.dataset.festival === modalSelected);
  });

  $("#modalSpotify").replaceChildren(spotifyEmbed(f.spotifyId, f.playlistName));
}

function openModal(){
  modalSelected = selected;
  renderModal();
  $("#playlistModal").hidden = false;
  document.body.style.overflow = "hidden";
  $("#closePlaylist").focus();
}

function closeModal(){
  $("#playlistModal").hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".tab").forEach((button)=>{
  button.addEventListener("click", ()=>{
    selected = button.dataset.festival;
    renderMain();
  });
});

document.querySelectorAll(".modal-tab").forEach((button)=>{
  button.addEventListener("click", ()=>{
    modalSelected = button.dataset.festival;
    renderModal();
  });
});

$("#openPlaylist").addEventListener("click", openModal);
$("#closePlaylist").addEventListener("click", closeModal);
$("#closeByBackdrop").addEventListener("click", closeModal);

document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape" && !$("#playlistModal").hidden) closeModal();
});

renderMain();
window.setInterval(updateCountdown,1000);
