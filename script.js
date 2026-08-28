const FESTIVALS={
 durga:{name:"Durga Puja",mark:"01",subtitle:"The first Puja day is almost here.",target:"2026-10-16T00:00:00+05:30",date:"Friday, 16 October 2026",playlistName:"Durga Puja",spotifyId:"0z11u9nIBzaddobcW4ujFO",background:"durga-puja.jpg"},
 kali:{name:"Kali Puja",mark:"02",subtitle:"A night of lights, devotion and celebration.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistName:"Kali Puja",spotifyId:"0sBXfKzF43guyOY9FXRofi",background:"kali-puja.jpg"},
 diwali:{name:"Diwali",mark:"03",subtitle:"The festival of lights is getting closer.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistName:"Diwali",spotifyId:"0bp35vrrt5SIWqf2NW7Ue4",background:"diwali.jpg"}
};

let selected="durga",player=null,deviceId=null,accessToken=null,currentState=null,shuffle=false,repeatMode="context";

const $=s=>document.querySelector(s);
const config=window.UTSAV_SPOTIFY||{};
const CLIENT=()=>config.clientId||"";

function setStatus(title,detail){
 $("#trackTitle").textContent=title;
 $("#trackArtist").textContent=detail;
}
function updateAuthUI(connected){
 $("#spotifyLogin").textContent=connected?"Spotify connected":"Connect Spotify";
 ["playBtn","prevBtn","nextBtn","shuffleBtn","repeatBtn"].forEach(id=>{const e=$("#"+id);if(e)e.disabled=!connected;});
}
function updateCountdown(){
 const diff=new Date(FESTIVALS[selected].target).getTime()-Date.now();
 if(diff<=0){["days","hours","minutes","seconds"].forEach(id=>$("#"+id).textContent="00");return;}
 const t=Math.floor(diff/1000);
 $("#days").textContent=String(Math.floor(t/86400));
 $("#hours").textContent=String(Math.floor(t%86400/3600)).padStart(2,"0");
 $("#minutes").textContent=String(Math.floor(t%3600/60)).padStart(2,"0");
 $("#seconds").textContent=String(t%60).padStart(2,"0");
}
function renderFestival(){
 const f=FESTIVALS[selected];
 $("#festivalMark").textContent=f.mark;
 $("#festivalTitle").textContent=f.name;
 $("#festivalSubtitle").textContent=f.subtitle;
 $("#targetDate").textContent=f.date;
 $("#scene").style.backgroundImage=`url("${f.background}")`;
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.festival===selected));
}
function randomString(n=64){
 const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",a=new Uint8Array(n);
 crypto.getRandomValues(a);return [...a].map(x=>chars[x%chars.length]).join("");
}
function b64(buf){return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
async function sha(text){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));}

async function login(){
 if(!CLIENT()||CLIENT().includes("PASTE_")){
   setStatus("Spotify setup required","Add your Client ID in spotify-config.js first."); return;
 }
 const verifier=randomString(96),challenge=b64(await sha(verifier)),state=randomString(32);
 sessionStorage.setItem("utsav_verifier",verifier);
 sessionStorage.setItem("utsav_state",state);
 const scopes="streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing";
 const p=new URLSearchParams({response_type:"code",client_id:CLIENT(),scope:scopes,redirect_uri:config.redirectUri,state,code_challenge_method:"S256",code_challenge:challenge});
 location.href="https://accounts.spotify.com/authorize?"+p;
}
async function finishLogin(){
 const p=new URLSearchParams(location.search),code=p.get("code");
 if(!code)return false;
 const verifier=sessionStorage.getItem("utsav_verifier"),state=sessionStorage.getItem("utsav_state");
 if(!verifier||state!==p.get("state")){setStatus("Spotify login failed","Please connect again.");return false;}
 const body=new URLSearchParams({client_id:CLIENT(),grant_type:"authorization_code",code,redirect_uri:config.redirectUri,code_verifier:verifier});
 const r=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
 const d=await r.json();
 history.replaceState({},document.title,location.pathname);
 if(!r.ok){setStatus("Spotify login failed",d.error_description||"Try again.");return false;}
 accessToken=d.access_token;sessionStorage.setItem("utsav_access_token",accessToken);return true;
}

function initPlayer(){
 if(player||!accessToken||!window.Spotify)return;
 player=new Spotify.Player({name:"Utsav Web Player",getOAuthToken:cb=>cb(accessToken),volume:.75,enableMediaSession:true});
 player.addListener("ready",({device_id})=>{
  deviceId=device_id;updateAuthUI(true);$("#playerStatus").textContent="SPOTIFY WEB PLAYER • READY";
  setStatus("Ready to play","Tap Play to start your selected festival playlist.");
 });
 player.addListener("not_ready",()=>setStatus("Spotify player offline","Reconnect Spotify to continue."));
 player.addListener("initialization_error",({message})=>setStatus("Spotify player unavailable",message));
 player.addListener("authentication_error",({message})=>{accessToken=null;updateAuthUI(false);setStatus("Spotify authentication failed",message);});
 player.addListener("account_error",()=>{updateAuthUI(false);setStatus("Spotify Premium required","Web Playback requires Spotify Premium.");});
 player.addListener("playback_error",({message})=>setStatus("Playback error",message));
 player.addListener("autoplay_failed",()=>setStatus("Tap Play to start","Your browser blocked automatic playback."));
 player.addListener("player_state_changed",renderState);
 player.connect();
}
window.initUtsavSpotifyPlayer=initPlayer;

function renderState(state){
 currentState=state;if(!state?.track_window?.current_track)return;
 const t=state.track_window.current_track;
 $("#trackTitle").textContent=t.name;
 $("#trackArtist").textContent=t.artists.map(a=>a.name).join(", ");
 $("#playerStatus").textContent=state.paused?"PAUSED • SPOTIFY":"NOW PLAYING";
 $("#playBtn").textContent=state.paused?"▶":"Ⅱ";
 $("#currentTime").textContent=fmt(state.position);
 $("#trackDuration").textContent=fmt(state.duration);
 $("#progressFill").style.width=state.duration?(state.position/state.duration*100)+"%":"0%";
 const art=t.album?.images?.[0]?.url;
 if(art){$("#trackArt").src=art;$("#trackArt").hidden=false;}
}
function fmt(ms){const s=Math.floor(Math.max(0,ms)/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
async function api(path,options={}){
 const r=await fetch("https://api.spotify.com/v1"+path,{...options,headers:{...(options.headers||{}),Authorization:"Bearer "+accessToken}});
 if(r.status===401){setStatus("Spotify session expired","Connect Spotify again.");return null;}
 if(r.status===204)return null;
 if(!r.ok)throw new Error("Spotify API "+r.status);
 return r.json();
}
async function playSelected(){
 if(!player||!deviceId){setStatus("Connect Spotify first","Use Connect Spotify, then tap Play.");return;}
 try{
  await player.activateElement();
  await api("/me/player/play",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({device_id:deviceId,context_uri:"spotify:playlist:"+FESTIVALS[selected].spotifyId})});
 }catch(e){setStatus("Playback couldn't start","Make sure your Spotify account is Premium and try again.");}
}
async function togglePlay(){if(!player)return;await player.activateElement();await player.togglePlay();}
async function next(){if(player)await player.nextTrack();}
async function prev(){if(player)await player.previousTrack();}
async function setShuffle(){shuffle=!shuffle;$("#shuffleBtn").classList.toggle("active",shuffle);$("#shuffleBtn").setAttribute("aria-pressed",String(shuffle));try{await api("/me/player/shuffle?state="+shuffle,{method:"PUT"});}catch(e){}}
async function setRepeat(){repeatMode=repeatMode==="context"?"track":repeatMode==="track"?"off":"context";$("#repeatBtn").classList.toggle("active",repeatMode!=="context");try{await api("/me/player/repeat?state="+repeatMode,{method:"PUT"});}catch(e){}}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{selected=b.dataset.festival;renderFestival();}));
$("#spotifyLogin").addEventListener("click",login);
$("#playBtn").addEventListener("click",togglePlay);
$("#prevBtn").addEventListener("click",prev);
$("#nextBtn").addEventListener("click",next);
$("#shuffleBtn").addEventListener("click",setShuffle);
$("#repeatBtn").addEventListener("click",setRepeat);

renderFestival();updateAuthUI(false);
setInterval(updateCountdown,1000);

(async()=>{
 const had=await finishLogin();
 const saved=sessionStorage.getItem("utsav_access_token");
 if(had||saved){accessToken=had?accessToken:saved; if(window.Spotify)initPlayer();}
})();

setInterval(()=>{
 if(currentState&&!currentState.paused){
  const p=Math.min(currentState.duration,currentState.position+1000);
  $("#currentTime").textContent=fmt(p);
  $("#progressFill").style.width=currentState.duration?(p/currentState.duration*100)+"%":"0%";
 }
},1000);
