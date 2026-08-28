const FESTIVALS = {
  durga:{
    name:"Durga Puja",mark:"01",subtitle:"The first Puja day is almost here.",
    target:"2026-10-16T00:00:00+05:30",date:"Friday, 16 October 2026",
    playlistName:"Durga Puja",spotifyId:"0z11u9nIBzaddobcW4ujFO",
    background:"durga-puja.jpg"
  },
  kali:{
    name:"Kali Puja",mark:"02",subtitle:"A night of lights, devotion and celebration.",
    target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",
    playlistName:"Kali Puja",spotifyId:"0sBXfKzF43guyOY9FXRofi",
    background:"kali-puja.jpg"
  },
  diwali:{
    name:"Diwali",mark:"03",subtitle:"The festival of lights is getting closer.",
    target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",
    playlistName:"Diwali",spotifyId:"0bp35vrrt5SIWqf2NW7Ue4",
    background:"diwali.jpg"
  }
};

let selected="durga";
let player=null;
let deviceId=null;
let accessToken=null;
let currentState=null;
let shuffle=false;
let repeatMode="context";
let progressTimer=null;

const $=s=>document.querySelector(s);
const CLIENT=()=>window.UTSAV_SPOTIFY?.clientId||"";

function assetUrl(name){
  return name;
}
function formatMs(ms){
  const s=Math.max(0,Math.floor(ms/1000));
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
}
function base64url(bytes){
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function randomString(length=64){
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const a=new Uint8Array(length);crypto.getRandomValues(a);
  return [...a].map(x=>chars[x%chars.length]).join("");
}
async function sha256(text){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));}

async function beginLogin(){
  if(!CLIENT() || CLIENT().includes("PASTE_YOUR")){
    setStatus("Spotify setup required","Add your Spotify Client ID in spotify-config.js.");
    return;
  }
  const verifier=randomString(96);
  const challenge=base64url(await sha256(verifier));
  const state=randomString(32);
  sessionStorage.setItem("utsav_pkce_verifier",verifier);
  sessionStorage.setItem("utsav_oauth_state",state);

  const scopes=[
    "streaming","user-read-email","user-read-private",
    "user-read-playback-state","user-modify-playback-state","user-read-currently-playing"
  ].join(" ");

  const params=new URLSearchParams({
    response_type:"code",client_id:CLIENT(),scope:scopes,
    redirect_uri:window.UTSAV_SPOTIFY.redirectUri,state,
    code_challenge_method:"S256",code_challenge:challenge
  });
  window.location.href="https://accounts.spotify.com/authorize?"+params.toString();
}

async function finishLogin(){
  const params=new URLSearchParams(location.search);
  const code=params.get("code"),state=params.get("state"),error=params.get("error");
  if(error){history.replaceState({},document.title,location.pathname);setStatus("Spotify login cancelled","Connect Spotify to enable full playback.");return;}
  if(!code)return;

  const savedState=sessionStorage.getItem("utsav_oauth_state");
  const verifier=sessionStorage.getItem("utsav_pkce_verifier");
  if(!savedState||savedState!==state||!verifier){setStatus("Login could not be verified","Please connect Spotify again.");return;}

  const body=new URLSearchParams({
    client_id:CLIENT(),grant_type:"authorization_code",code,
    redirect_uri:window.UTSAV_SPOTIFY.redirectUri,code_verifier:verifier
  });
  const res=await fetch("https://accounts.spotify.com/api/token",{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body
  });
  const data=await res.json();
  if(!res.ok){setStatus("Spotify login failed",data.error_description||"Try again.");return;}

  accessToken=data.access_token;
  sessionStorage.setItem("utsav_access_token",accessToken);
  if(data.refresh_token)sessionStorage.setItem("utsav_refresh_token",data.refresh_token);
  history.replaceState({},document.title,window.location.pathname);
  initPlayer();
}

function setStatus(title,detail){
  $("#trackTitle").textContent=title;
  $("#trackArtist").textContent=detail;
}
function updateAuthUI(connected){
  $("#spotifyLogin").textContent=connected?"Spotify connected":"Connect Spotify";
  $("#playBtn").disabled=!connected;
  $("#prevBtn").disabled=!connected;
  $("#nextBtn").disabled=!connected;
  $("#shuffleBtn").disabled=!connected;
  $("#repeatBtn").disabled=!connected;
}

function renderCountdown(){
  const f=FESTIVALS[selected];
  $("#festivalMark").textContent=f.mark;
  $("#festivalTitle").textContent=f.name;
  $("#festivalSubtitle").textContent=f.subtitle;
  $("#targetDate").textContent=f.date;
  $("#scene").style.backgroundImage=`url("${assetUrl(f.background)}")`;

  document.querySelectorAll(".tab").forEach(b=>{
    const active=b.dataset.festival===selected;
    b.classList.toggle("active",active);
    b.setAttribute("aria-current",active?"page":"false");
  });
  updateCountdown();
  loadPlaylistList();
}

function updateCountdown(){
  const diff=new Date(FESTIVALS[selected].target).getTime()-Date.now();
  if(diff<=0){
    $("#days").textContent=$("#hours").textContent=$("#minutes").textContent=$("#seconds").textContent="00";
    return;
  }
  const total=Math.floor(diff/1000);
  $("#days").textContent=String(Math.floor(total/86400));
  $("#hours").textContent=String(Math.floor((total%86400)/3600)).padStart(2,"0");
  $("#minutes").textContent=String(Math.floor((total%3600)/60)).padStart(2,"0");
  $("#seconds").textContent=String(total%60).padStart(2,"0");
}

async function api(path,options={}){
  const r=await fetch("https://api.spotify.com/v1"+path,{
    ...options,headers:{...(options.headers||{}),Authorization:"Bearer "+accessToken}
  });
  if(r.status===204)return null;
  if(!r.ok){
    if(r.status===401) await refreshOrRelogin();
    throw new Error("Spotify API error "+r.status);
  }
  return r.json();
}

async function refreshOrRelogin(){
  // A pure static client cannot safely exchange a refresh token without handling
  // the OAuth flow again. Re-authentication is the safe fallback.
  sessionStorage.removeItem("utsav_access_token");
  accessToken=null;
  updateAuthUI(false);
  setStatus("Spotify session expired","Connect Spotify again.");
}

async function transferAndPlay(){
  if(!player||!deviceId||!accessToken)return;
  try{
    await api("/me/player",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      device_ids:[deviceId],play:false
    })});
    await api("/me/player/play",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      context_uri:"spotify:playlist:"+FESTIVALS[selected].spotifyId
    })});
  }catch(e){
    setStatus("Playback needs Spotify Premium","Sign in to a Premium account and try again.");
  }
}

function initPlayer(){
  if(!window.Spotify){
    setStatus("Spotify player loading…","Please wait a moment.");
    return;
  }
  player=new Spotify.Player({
    name:"Utsav Web Player",
    getOAuthToken:cb=>cb(accessToken),
    volume:.75,
    enableMediaSession:true
  });

  player.addListener("ready",({device_id})=>{
    deviceId=device_id;
    updateAuthUI(true);
    $("#playerStatus").textContent="SPOTIFY WEB PLAYER • READY";
    setStatus("Choose a festival playlist","Tap play to start full-song playback.");
    loadPlaylistList();
  });
  player.addListener("not_ready",()=>setStatus("Spotify player offline","Reconnect Spotify to continue."));
  player.addListener("initialization_error",({message})=>setStatus("Spotify player unavailable",message));
  player.addListener("authentication_error",({message})=>setStatus("Spotify authentication failed",message));
  player.addListener("account_error",()=>setStatus("Spotify Premium required","Web Playback requires Premium."));
  player.addListener("playback_error",({message})=>setStatus("Playback error",message));
  player.addListener("autoplay_failed",()=>setStatus("Tap Play to start","Your browser blocked automatic playback."));
  player.addListener("player_state_changed",state=>{
    currentState=state;
    renderTrackState(state);
  });
  player.connect();
}

function renderTrackState(state){
  if(!state)return;
  const track=state.track_window?.current_track;
  if(!track)return;
  $("#trackTitle").textContent=track.name;
  $("#trackArtist").textContent=track.artists.map(a=>a.name).join(", ");
  $("#playerStatus").textContent=state.paused?"PAUSED • SPOTIFY":"NOW PLAYING";
  $("#playBtn").textContent=state.paused?"▶":"Ⅱ";
  $("#currentTime").textContent=formatMs(state.position);
  $("#trackDuration").textContent=formatMs(state.duration);
  $("#progressFill").style.width=state.duration?`${Math.min(100,state.position/state.duration*100)}%`:"0%";
  const art=track.album?.images?.[0]?.url;
  if(art){
    $("#trackArt").src=art;
    $("#trackArt").hidden=false;
  }
}

async function playPause(){
  if(!player)return;
  await player.activateElement();
  await player.togglePlay();
}
async function next(){if(player)await player.nextTrack();}
async function prev(){if(player)await player.previousTrack();}

async function setShuffle(){
  shuffle=!shuffle;
  $("#shuffleBtn").classList.toggle("active",shuffle);
  $("#shuffleBtn").setAttribute("aria-pressed",String(shuffle));
  if(accessToken)try{await api("/me/player/shuffle?state="+shuffle,{method:"PUT"});}catch(e){}
}
async function setRepeat(){
  repeatMode=repeatMode==="context"?"track":repeatMode==="track"?"off":"context";
  $("#repeatBtn").classList.toggle("active",repeatMode!=="context");
  $("#repeatBtn").setAttribute("aria-pressed",String(repeatMode!=="context"));
  if(accessToken)try{await api("/me/player/repeat?state="+repeatMode,{method:"PUT"});}catch(e){}
}

async function loadPlaylistList(){
  const list=$("#playlistList");
  if(!accessToken){list.innerHTML='<div class="playlist-loading">Connect Spotify to browse this playlist.</div>';return;}
  try{
    const data=await api("/playlists/"+FESTIVALS[selected].spotifyId+"/items?limit=50");
    list.innerHTML="";
    (data.items||[]).forEach((item,index)=>{
      const t=item.item;
      if(!t)return;
      const row=document.createElement("div");
      row.className="playlist-track";
      row.innerHTML=`<img alt="" src="${t.album?.images?.[2]?.url||t.album?.images?.[0]?.url||''}">
        <div class="pt-copy"><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.artists.map(a=>a.name).join(", "))}</span></div>`;
      row.addEventListener("click",()=>playTrack(t.uri));
      list.appendChild(row);
    });
  }catch(e){
    list.innerHTML='<div class="playlist-loading">Unable to load this playlist. Reconnect Spotify and try again.</div>';
  }
}

async function playTrack(uri){
  if(!deviceId)return;
  await api("/me/player/play",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({device_id:deviceId,uris:[uri]})});
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function openPlaylist(){
  $("#playlistModal").hidden=false;
  document.body.style.overflow="hidden";
  loadPlaylistList();
}
function closePlaylist(){
  $("#playlistModal").hidden=true;
  document.body.style.overflow="";
}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
  selected=b.dataset.festival;
  renderCountdown();
}));
$("#spotifyLogin").addEventListener("click",beginLogin);
$("#playBtn").addEventListener("click",async()=>{await playPause();});
$("#nextBtn").addEventListener("click",next);
$("#prevBtn").addEventListener("click",prev);
$("#shuffleBtn").addEventListener("click",setShuffle);
$("#repeatBtn").addEventListener("click",setRepeat);
$("#closePlaylist").addEventListener("click",closePlaylist);
$("#closeByBackdrop").addEventListener("click",closePlaylist);

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&!$("#playlistModal").hidden)closePlaylist();
});

window.onSpotifyWebPlaybackSDKReady=()=>{
  const token=sessionStorage.getItem("utsav_access_token");
  if(token){accessToken=token;initPlayer();}
};

(async function(){
  renderCountdown();
  updateAuthUI(false);
  await finishLogin();
  window.setInterval(updateCountdown,1000);
  progressTimer=window.setInterval(()=>{
    if(currentState&&!currentState.paused){
      const pos=Math.min(currentState.duration,currentState.position+1000);
      $("#currentTime").textContent=formatMs(pos);
      $("#progressFill").style.width=currentState.duration?`${pos/currentState.duration*100}%`:"0%";
    }
  },1000);
})();
