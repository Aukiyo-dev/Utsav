const FESTIVALS={
  durga:{
    name:"Durga Puja",mark:"01",
    subtitle:"The first Puja day is almost here.",
    target:"2026-10-16T00:00:00+05:30",
    date:"Friday, 16 October 2026",
    playlistName:"Pujo Mood",
    playlistId:"PLcEXU5KhRttE",
    playlistUrl:"https://www.youtube.com/playlist?list=PLcEXU5KhRttE",
    background:"/durga-puja.jpg",
    mobileBackground:"/durga-puja-mobile.jpg"
  },
  kali:{
    name:"Kali Puja",mark:"02",
    subtitle:"A night of lights, devotion and celebration.",
    target:"2026-11-08T00:00:00+05:30",
    date:"Sunday, 8 November 2026",
    playlistName:"Shyama Night",
    playlistId:"PLHwvw4RcSUnk",
    playlistUrl:"https://www.youtube.com/playlist?list=PLHwvw4RcSUnk",
    background:"/kali-puja.jpg",
    mobileBackground:"/kali-puja-mobile.jpg"
  },
  mahalaya:{
    name:"Mahalaya",mark:"03",
    subtitle:"The sacred Mahalaya morning is getting closer.",
    target:"2026-10-10T00:00:00+05:30",
    date:"Saturday, 10 October 2026",
    playlistName:"Iconic Mahalaya",
    playlistId:"PLZMOb9zpbEKQ",
    background:"/mahalaya.jpg",
    mobileBackground:"/mahalaya-mobile.jpg",
    playlists:{
      iconic:{name:"Iconic Mahalaya",playlistId:"PLZMOb9zpbEKQ",playlistUrl:"https://www.youtube.com/playlist?list=PLZMOb9zpbEKQ"},
      collection:{name:"Mahalaya Collection",playlistId:"PLPEyl3dIK7O0",playlistUrl:"https://www.youtube.com/playlist?list=PLPEyl3dIK7O0"}
    }
  }
};

function getSelectedFestival(){
  const path=location.pathname;
  if(path.includes("/durga-puja-countdown/"))return"durga";
  if(path.includes("/kali-puja-countdown/"))return"kali";
  if(path.includes("/mahalaya-countdown/"))return"mahalaya";
  return"durga";
}

let selected=getSelectedFestival();
let ytPlayer=null,ytApiLoading=false,ytPlayerReady=false,pendingPlayRequest=false,shuffle=false,repeat=false,playlistCache={};
let currentPlaylistId=FESTIVALS[selected].playlistId;
let currentPlaylistKey=selected==="mahalaya"?"iconic":"main";
let playerGeneration=0,playlistRequestGeneration=0;
const $=s=>document.querySelector(s);
let celebrationShown={durga:false,kali:false,mahalaya:false};

const FESTIVE_MESSAGES={
  50:name=>`${name} is getting closer. There’s still a little time — enjoy the playlist and set the mood.`,
  20:name=>`Start getting ready. ${name} is at the doorstep — your preparations can begin.`,
  10:name=>`${name} is knocking on your door. Start your preparations now.`,
  2:name=>`Just 2 days to go. ${name} is almost here — let the celebration begin.`,
  1:name=>`Tomorrow is the day. One more sleep until ${name}. ✨`
};

function showFestivalMessage(text,hidden=false){
  const el=$("#festivalMessage"); if(!el)return;
  el.textContent=text||""; el.hidden=hidden;
}

function triggerCelebration(){
  if(celebrationShown[selected])return;
  celebrationShown[selected]=true;
  document.body.classList.add("festival-arrived");
  const layer=document.createElement("div");
  layer.className="celebration-sprinkles";
  layer.setAttribute("aria-hidden","true");
  for(let i=0;i<100;i++){
    const piece=document.createElement("i");
    piece.style.left=(Math.random()*100)+"%";
    piece.style.animationDelay=(Math.random()*1.5)+"s";
    piece.style.animationDuration=(2.2+Math.random()*2.3)+"s";
    piece.style.transform=`rotate(${Math.random()*360}deg)`;
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(()=>layer.remove(),7000);
}

function updateCountdown(){
  const f=FESTIVALS[selected];
  const diff=Math.max(0,new Date(f.target).getTime()-Date.now());
  if(diff<=0){
    const box=$(".countdown");
    if(box){
      box.classList.add("arrived");
      box.innerHTML='<div class="countdown-arrived">See you next year ✨</div>';
    }
    showFestivalMessage(`Happy ${f.name}! The celebration has arrived.`,false);
    triggerCelebration();
    return;
  }
  const t=Math.floor(diff/1000);
  const days=Math.floor(t/86400);
  const hours=Math.floor((t%86400)/3600);
  const minutes=Math.floor((t%3600)/60);
  const seconds=t%60;
  const vals={days,hours,minutes,seconds};
  Object.entries(vals).forEach(([id,v])=>{
    const el=$("#"+id); if(el)el.textContent=String(v).padStart(2,"0");
  });
  let msg=null;
  if(days<=1)msg=FESTIVE_MESSAGES[1](f.name);
  else if(days<=2)msg=FESTIVE_MESSAGES[2](f.name);
  else if(days<=10)msg=FESTIVE_MESSAGES[10](f.name);
  else if(days<=20)msg=FESTIVE_MESSAGES[20](f.name);
  else if(days<=50)msg=FESTIVE_MESSAGES[50](f.name);
  showFestivalMessage(msg,!msg);
  $(".countdown")?.classList.remove("arrived");
}

function resetCountdownMarkup(){
  const countdown=$(".countdown");
  if(!countdown)return;
  countdown.innerHTML='<div class="time"><strong id="days">00</strong><span>DAYS</span></div><i></i><div class="time"><strong id="hours">00</strong><span>HOURS</span></div><i></i><div class="time"><strong id="minutes">00</strong><span>MINUTES</span></div><i></i><div class="time"><strong id="seconds">00</strong><span>SECONDS</span></div>';
}

function setPlaylistSelection(key){
  if(selected!=="mahalaya"){
    currentPlaylistKey="main";
    currentPlaylistId=FESTIVALS[selected].playlistId;
    return;
  }
  currentPlaylistKey=key==="collection"?"collection":"iconic";
  currentPlaylistId=FESTIVALS.mahalaya.playlists[currentPlaylistKey].playlistId;
}

function destroyPlayer(){
  if(typeof window.UtsavStopSongTips==='function')window.UtsavStopSongTips();
  playerGeneration++;
  ytPlayerReady=false;
  pendingPlayRequest=false;
  if(ytPlayer && typeof ytPlayer.destroy==="function"){
    try{ytPlayer.destroy();}catch(e){}
  }
  ytPlayer=null;
}

function renderFestival(){
  const f=FESTIVALS[selected];
  resetCountdownMarkup();
  celebrationShown[selected]=false;
  document.body.classList.remove("festival-arrived");
  $("#festivalMark").textContent=f.mark;
  $("#festivalTitle").textContent=f.name;
  $("#festivalSubtitle").textContent=f.subtitle;
  $("#targetDate").textContent=f.date;

  if(selected!=="mahalaya")setPlaylistSelection("main");
  else setPlaylistSelection(currentPlaylistKey);

  $("#playlistName").textContent=selected==="mahalaya"
    ? f.playlists[currentPlaylistKey].name
    : f.playlistName;

  const scene=$("#scene");
  if(scene){
    scene.style.setProperty("--desktop-bg",`url("${f.background}")`);
    scene.style.setProperty("--mobile-bg",`url("${f.mobileBackground||f.background}")`);
  }

  document.querySelectorAll(".tab").forEach(tab=>{
    tab.classList.toggle("active",tab.dataset.festival===selected);
  });

  const choices=$("#mahalayaPlaylistChoices");
  if(choices){
    choices.hidden=selected!=="mahalaya";
    if(selected==="mahalaya"){
      document.querySelectorAll(".playlist-choice").forEach(b=>{
        const on=b.dataset.playlist===currentPlaylistKey;
        b.classList.toggle("active",on);
        b.setAttribute("aria-pressed",String(on));
      });
    }
  }

  destroyPlayer();
  createYouTubePlayer("youtubePlayer",currentPlaylistId,185,false);
}

function loadYTAPI(){
  if(window.YT?.Player){
    createYouTubePlayer("youtubePlayer",currentPlaylistId,185,false);
    return;
  }
  if(ytApiLoading)return;
  ytApiLoading=true;
  window.onYouTubeIframeAPIReady=()=>{
    ytApiLoading=false;
    createYouTubePlayer("youtubePlayer",currentPlaylistId,185,false);
  };
  const s=document.createElement("script");
  s.id="youtube-api";
  s.src="https://www.youtube.com/iframe_api";
  s.async=true;
  document.head.appendChild(s);
}

function createYouTubePlayer(containerId,playlistId,height,isModal=false){
  const generation=playerGeneration;
  const expectedPlaylistId=playlistId;
  const c=$("#"+containerId); if(!c)return;
  c.innerHTML="";
  const d=document.createElement("div");
  d.id=containerId+"Frame";
  c.appendChild(d);

  if(!window.YT?.Player){
    loadYTAPI();
    return;
  }

  const player=new YT.Player(d.id,{
    height:String(height),width:"100%",
    playerVars:{
      listType:"playlist",list:playlistId,index:0,
      playsinline:1,rel:0,modestbranding:1
    },
    events:{
      onReady:e=>{
        if(!isModal && generation===playerGeneration && expectedPlaylistId===currentPlaylistId){
          ytPlayer=e.target;
          window.ytPlayerForTips=ytPlayer;
          ytPlayerReady=true;
          $("#playlistStatus").textContent="YouTube playlist ready • tap play to begin";
          syncModes();
          // If Play was tapped while YouTube was still loading, execute it now.
          if(pendingPlayRequest){
            pendingPlayRequest=false;
            try{ ytPlayer.playVideo(); }catch(err){}
          }
        }
      },
      onStateChange:e=>{
        if(!isModal && generation===playerGeneration && expectedPlaylistId===currentPlaylistId){
          const play=$("#ytPlay");
          if(play)play.textContent=e.data===YT.PlayerState.PLAYING?"Ⅱ":"▶";
          updateNowPlaying(e.target);
          if(e.data===YT.PlayerState.PLAYING && typeof window.UtsavShowFirstPlayTip==="function") window.UtsavShowFirstPlayTip();
        }
      },
      onError:()=>{
        if(!isModal && generation===playerGeneration && expectedPlaylistId===currentPlaylistId){
          $("#nowPlaying").textContent="This YouTube video may not allow embedding.";
        }
      }
    }
  });
  return player;
}

function updateMediaSession(p){
  if(!('mediaSession' in navigator))return;
  try{
    const data=p.getVideoData?.()||{};
    navigator.mediaSession.metadata=new MediaMetadata({
      title:data.title||FESTIVALS[selected].playlistName||FESTIVALS[selected].name,
      artist:'Utsav • '+FESTIVALS[selected].name,
      album:'Utsav 2026 Festival Music',
      artwork:[{src:`${location.origin}/utsav-logo.png`,sizes:'192x192',type:'image/png'}]
    });
  }catch(e){}
}

function updateNowPlaying(p){
  try{
    updateMediaSession(p);
    $("#nowPlaying").textContent="Now playing • "+(p.getVideoData()?.title||"YouTube playlist");
  }catch(e){}
}

function syncModes(){
  const sh=$("#ytShuffle"),rp=$("#ytRepeat");
  if(sh){sh.classList.toggle("active",shuffle);sh.setAttribute("aria-pressed",String(shuffle));}
  if(rp){rp.classList.toggle("active",repeat);rp.setAttribute("aria-pressed",String(repeat));}
}

$("#ytPlay").addEventListener("click",()=>{
  // Do not lose the first tap while the YouTube iframe/API is initializing.
  if(!ytPlayer || !ytPlayerReady){
    pendingPlayRequest=!pendingPlayRequest;
    const status=$("#playlistStatus");
    if(status && !ytPlayerReady)status.textContent="Starting YouTube player…";
    return;
  }
  if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING)ytPlayer.pauseVideo();
  else ytPlayer.playVideo();
});
$("#ytPrev").addEventListener("click",()=>ytPlayer?.previousVideo());
$("#ytNext").addEventListener("click",()=>ytPlayer?.nextVideo());
$("#ytShuffle").addEventListener("click",()=>{
  shuffle=!shuffle;syncModes();ytPlayer?.setShuffle(shuffle);
});
$("#ytRepeat").addEventListener("click",()=>{
  repeat=!repeat;syncModes();ytPlayer?.setLoop(repeat);
});

async function getPlaylistItems(playlistId){
  if(playlistCache[playlistId])return playlistCache[playlistId];
  const configuredPlaylistIds=[];
  Object.values(FESTIVALS).forEach(f=>{
    if(f.playlistId)configuredPlaylistIds.push(f.playlistId);
    if(f.playlists)Object.values(f.playlists).forEach(p=>configuredPlaylistIds.push(p.playlistId));
  });
  if(!configuredPlaylistIds.includes(playlistId)){
    throw new Error("This playlist ID is not configured in the current Utsav build.");
  }

  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const u=new URL("/api/playlist",window.location.origin);
    u.searchParams.set("playlistId",playlistId);
    const r=await fetch(u.toString(),{method:"GET",headers:{Accept:"application/json"},cache:"no-store",signal:controller.signal});
    const text=await r.text();
    let d={};try{d=JSON.parse(text)}catch(_){}
    if(!r.ok)throw new Error(d.error||`Playlist service returned HTTP ${r.status}.`);
    if(!Array.isArray(d.items))throw new Error("Playlist service returned an invalid response.");
    playlistCache[playlistId]=d.items;
    return d.items;
  }catch(e){
    if(e.name==="AbortError")throw new Error("The playlist took too long to load. Check the Vercel API deployment and try again.");
    throw e;
  }finally{clearTimeout(timeout);}
}

function renderPlaylistItems(items){
  const box=$("#playlistItems"); if(!box)return;
  box.innerHTML="";
  if(!items.length){box.innerHTML='<div class="playlist-error">No songs were found in this playlist.</div>';return;}
  items.forEach((item,i)=>{
    const vid=item.videoId;if(!vid)return;
    const b=document.createElement("button");
    b.type="button";b.className="playlist-row";b.dataset.videoId=vid;
    const thumb=item.thumbnails?.medium?.url||item.thumbnails?.high?.url||item.thumbnails?.default?.url||`https://i.ytimg.com/vi/${encodeURIComponent(vid)}/mqdefault.jpg`;
    b.innerHTML=`<span class="playlist-number">${String(i+1).padStart(2,"0")}</span><img class="playlist-thumb" src="${escapeAttr(thumb)}" alt="" loading="lazy"><span class="playlist-meta"><span class="playlist-title">${escapeHTML(item.title||"Untitled")}</span><span class="playlist-channel">${escapeHTML(item.channel||"YouTube")}</span></span>`;
    b.addEventListener("click",()=>{
      if(ytPlayer){
        ytPlayer.loadVideoById(vid);
        document.querySelectorAll(".playlist-row").forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        closePlaylist();
      }else{
        closePlaylist();
        setTimeout(()=>{
          if(ytPlayer){ytPlayer.loadVideoById(vid);ytPlayer.playVideo();}
        },500);
      }
    });
    box.appendChild(b);
  });
}

function escapeHTML(v){
  const d=document.createElement("div");d.textContent=String(v??"");return d.innerHTML;
}
function escapeAttr(v){
  return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function openPlaylist(){
  const requestGeneration=++playlistRequestGeneration;
  const requestedFestival=selected;
  const f=FESTIVALS[selected];
  const playlist=f.playlists ? f.playlists[currentPlaylistKey] : f;
  const playlistUrl=playlist.playlistUrl;
  $("#modalTitle").textContent=playlist.name||f.playlistName;
  $("#playlistModal").hidden=false;
  document.body.style.overflow="hidden";
  const box=$("#playlistItems");
  box.innerHTML='<div class="playlist-loading"><span class="loading-dot"></span> Loading all songs…</div>';
  try{
    const items=await getPlaylistItems(playlist.playlistId);
    if(requestGeneration!==playlistRequestGeneration || requestedFestival!==selected)return;
    renderPlaylistItems(items);
  }catch(e){
    if(requestGeneration!==playlistRequestGeneration || requestedFestival!==selected)return;
    const safeUrl=escapeAttr(playlistUrl||`https://www.youtube.com/playlist?list=${encodeURIComponent(playlist.playlistId)}`);
    box.innerHTML=`<div class="playlist-error"><strong>Could not load the song list inside Utsav.</strong><br><br>${escapeHTML(e.message)}<br><br><small>For the in-site list, deploy <b>api/playlist.js</b> with <b>YOUTUBE_DATA_API_KEY</b> configured in Vercel. You can still open the selected playlist directly:</small><br><a class="playlist-fallback" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Open selected playlist on YouTube ↗</a></div>`;
  }
}
function closePlaylist(){
  $("#playlistModal").hidden=true;
  document.body.style.overflow="";
}

document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    // Keep the normal anchor navigation intact. The new page will initialize
    // its own festival and its own distinct playlist.
    if(tab.dataset.festival==="mahalaya")currentPlaylistKey="iconic";
  });
});

document.querySelectorAll(".playlist-choice").forEach(button=>{
  button.addEventListener("click",()=>{
    if(selected!=="mahalaya")return;
    setPlaylistSelection(button.dataset.playlist);
    document.querySelectorAll(".playlist-choice").forEach(b=>{
      const on=b.dataset.playlist===currentPlaylistKey;
      b.classList.toggle("active",on);
      b.setAttribute("aria-pressed",String(on));
    });
    const f=FESTIVALS.mahalaya;
    $("#playlistName").textContent=f.playlists[currentPlaylistKey].name;
    $("#playlistStatus").textContent="Playlist selected • tap play to begin";
    destroyPlayer();
    createYouTubePlayer("youtubePlayer",currentPlaylistId,185,false);
  });
});

$("#openPlaylist").addEventListener("click",openPlaylist);
$("#closePlaylist").addEventListener("click",closePlaylist);
$("#closeByBackdrop").addEventListener("click",closePlaylist);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&!$("#playlistModal").hidden)closePlaylist();
});

renderFestival();
updateCountdown();
setInterval(updateCountdown,1000);

/* Utsav Mood Mode */
(()=>{
  const btn=document.getElementById("moodMode");
  const countdown=document.querySelector(".countdown");
  if(!btn)return;
  const setMode=on=>{
    document.body.classList.toggle("mood-mode",on);
    btn.setAttribute("aria-pressed",String(on));
    btn.setAttribute("aria-label",on?"Exit mood mode":"Enter mood mode");
    btn.textContent=on?"× Exit":"✦ Mood";
    if(on&&ytPlayer&&typeof ytPlayer.playVideo==="function"){
      try{ytPlayer.playVideo();}catch(e){}
    }
  };
  btn.addEventListener("click",()=>setMode(!document.body.classList.contains("mood-mode")));
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&document.body.classList.contains("mood-mode"))setMode(false);
  });
  let lastTap=0;
  countdown?.addEventListener("click",()=>{
    const now=Date.now();
    if(document.body.classList.contains("mood-mode")&&now-lastTap<350)setMode(false);
    lastTap=now;
  });
})();

/* Creator, support and Aukiyo dialogs */
(()=>{
  const pairs=[
    ["openCreator","creatorModal","creatorClose","creatorBackdrop"],
    ["openChai","chaiModal","chaiClose","chaiBackdrop"],
    ["openAukiyo","aukiyoModal","aukiyoClose","aukiyoBackdrop"]
  ];
  pairs.forEach(([openId,modalId,closeId,backdropId])=>{
    const open=document.getElementById(openId),modal=document.getElementById(modalId);
    const close=document.getElementById(closeId),backdrop=document.getElementById(backdropId);
    if(!open||!modal)return;
    const hide=()=>{modal.hidden=true};
    open.addEventListener("click",()=>{modal.hidden=false});
    close?.addEventListener("click",hide);
    backdrop?.addEventListener("click",hide);
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape")document.querySelectorAll(".creator-modal:not([hidden])").forEach(m=>m.hidden=true);
  });
})();

/* Copyable UPI ID */
(()=>{
  const copyBtn=document.getElementById("copyUpi"),value=document.getElementById("upiIdValue"),status=document.getElementById("upiCopyStatus");
  if(!copyBtn||!value)return;
  copyBtn.addEventListener("click",async()=>{
    const text=value.textContent.trim();
    try{
      await navigator.clipboard.writeText(text);
      copyBtn.textContent="Copied!";
      if(status)status.textContent="UPI ID copied to clipboard.";
    }catch(e){
      const area=document.createElement("textarea");
      area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";
      document.body.appendChild(area);area.select();
      try{document.execCommand("copy");copyBtn.textContent="Copied!";if(status)status.textContent="UPI ID copied to clipboard."}
      catch(_){if(status)status.textContent="Copy failed — please copy the UPI ID manually."}
      area.remove();
    }
    setTimeout(()=>{copyBtn.textContent="Copy";if(status)status.textContent=""},1800);
  });
})();


/* Background playback continuity: never pause the YouTube player merely because the tab/app becomes hidden.
   Audible autoplay is intentionally not forced because mobile browsers may block it until the user interacts. */
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden' && ytPlayer && ytPlayerReady){
    try{
      if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING) document.documentElement.dataset.utsavPlayback='playing';
    }catch(e){}
  }
});
if('mediaSession' in navigator){
  const noop=()=>{try{if(ytPlayer)ytPlayer.playVideo()}catch(e){}};
  try{navigator.mediaSession.setActionHandler('play',noop)}catch(e){}
  try{navigator.mediaSession.setActionHandler('pause',()=>{try{ytPlayer?.pauseVideo()}catch(e){}})}catch(e){}
  try{navigator.mediaSession.setActionHandler('nexttrack',()=>{try{ytPlayer?.nextVideo()}catch(e){}})}catch(e){}
  try{navigator.mediaSession.setActionHandler('previoustrack',()=>{try{ytPlayer?.previousVideo()}catch(e){}})}catch(e){}
}

/* V6.2.1 player branding + compact footer breadcrumb
   Keeps the change isolated to script.js so no other project files need updating. */
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .music-icon{overflow:hidden;padding:0!important;background:rgba(255,255,255,.96)!important;display:grid!important;place-items:center!important}
    .music-icon img{display:block;width:100%;height:100%;object-fit:contain;border-radius:inherit}
    .site-footer.footer-breadcrumb-only{justify-content:center!important;text-align:center!important;padding:10px 14px!important;margin-top:18px!important;margin-bottom:24px!important;min-height:0!important}
    .site-footer.footer-breadcrumb-only .breadcrumbs{margin:0!important;max-width:100%;font-size:.68rem;padding:6px 10px;gap:6px}
    .site-footer.footer-breadcrumb-only .breadcrumbs a,.site-footer.footer-breadcrumb-only .breadcrumbs span{white-space:nowrap}
  `;
  document.head.appendChild(style);

  const musicIcon=document.querySelector('.music-icon');
  if(musicIcon && !musicIcon.querySelector('img')){
    const img=document.createElement('img');
    img.src='/utsav-logo.png';
    img.alt='Utsav logo';
    img.width=39;
    img.height=39;
    img.decoding='async';
    musicIcon.textContent='';
    musicIcon.appendChild(img);
    musicIcon.setAttribute('aria-label','Utsav logo');
  }

  const breadcrumbs=document.querySelector('.breadcrumbs');
  const footer=document.querySelector('.site-footer');
  if(breadcrumbs && footer){
    footer.replaceChildren(breadcrumbs);
    footer.classList.add('footer-breadcrumb-only');
  }
})();

/* V6.2.2 first-use guidance: game-style help + manga speech-bubble tips.
   This module is intentionally isolated in script.js so the rest of the site stays unchanged. */
(()=>{
  const STORAGE_KEY='utsav_help_v1_seen';
  const safeGet=(key)=>{try{return localStorage.getItem(key)==='1'}catch(_){return false}};
  const safeSet=(key)=>{try{localStorage.setItem(key,'1')}catch(_){} };

  const style=document.createElement('style');
  style.textContent=`
    .utsav-help-button{
      border:1px solid rgba(255,255,255,.20);background:rgba(255,255,255,.07);color:#fff;
      min-width:34px;height:34px;border-radius:50%;display:inline-grid;place-items:center;
      font-size:.75rem;font-weight:900;cursor:pointer;margin-left:6px;flex:0 0 auto;
      box-shadow:0 8px 22px rgba(0,0,0,.14);backdrop-filter:blur(10px)
    }
    .utsav-help-button:hover{background:rgba(255,255,255,.13)}
    .utsav-help-overlay{position:fixed;inset:0;z-index:5000;display:grid;place-items:center;padding:20px;background:rgba(7,7,10,.58);backdrop-filter:blur(7px)}
    .utsav-help-overlay[hidden],.utsav-tip[hidden]{display:none}
    .utsav-help-card{position:relative;width:min(520px,calc(100vw - 32px));border:1px solid rgba(255,255,255,.22);border-radius:28px;padding:22px 18px 18px;background:linear-gradient(145deg,rgba(55,43,39,.96),rgba(24,24,29,.97));color:#fff;box-shadow:0 28px 80px rgba(0,0,0,.48);overflow:hidden}
    .utsav-help-card:before{content:"";position:absolute;inset:-80px auto auto -50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.07);filter:blur(8px)}
    .utsav-help-kicker{font-size:.58rem;letter-spacing:.16em;font-weight:900;opacity:.55;text-transform:uppercase}
    .utsav-help-card h2{margin:6px 0 7px;font-size:1.45rem;line-height:1.08}
    .utsav-help-card>p{margin:0 0 16px;font-size:.78rem;line-height:1.5;opacity:.78}
    .utsav-help-list{display:grid;gap:9px;margin:0 0 17px}
    .utsav-help-item{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.055)}
    .utsav-help-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:rgba(255,255,255,.11);font-size:1rem;font-weight:900}
    .utsav-help-item b{display:block;font-size:.72rem}.utsav-help-item span{display:block;margin-top:3px;font-size:.61rem;line-height:1.35;opacity:.62}
    .utsav-help-actions{display:flex;justify-content:flex-end;gap:8px}
    .utsav-help-close{border:0;border-radius:999px;padding:10px 16px;background:rgba(255,255,255,.94);color:#202126;font-weight:900;font-size:.66rem;cursor:pointer}
    .utsav-tip{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(max(16px,env(safe-area-inset-bottom)) + 68px);z-index:4500;width:min(310px,calc(100vw - 32px));padding:13px 14px 13px 15px;border:1px solid rgba(255,255,255,.22);border-radius:19px;background:linear-gradient(145deg,rgba(45,38,39,.97),rgba(21,22,27,.97));color:#fff;box-shadow:0 18px 45px rgba(0,0,0,.38);animation:utsavTipIn .34s cubic-bezier(.2,.9,.25,1.2)}
    .utsav-tip:after{content:"";position:absolute;right:28px;bottom:-11px;width:20px;height:20px;background:rgba(25,24,28,.98);border-right:1px solid rgba(255,255,255,.20);border-bottom:1px solid rgba(255,255,255,.20);transform:rotate(45deg)}
    .utsav-tip.manga-left:after{right:auto;left:28px}
    .utsav-tip-row{display:flex;align-items:flex-start;gap:10px;position:relative;z-index:1}
    .utsav-tip-avatar{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.94);object-fit:contain;flex:0 0 auto;padding:2px}
    .utsav-tip b{display:block;font-size:.68rem;line-height:1.2}.utsav-tip p{margin:4px 0 0;font-size:.61rem;line-height:1.4;opacity:.72}
    .utsav-tip-close{position:absolute;right:8px;top:7px;border:0;background:transparent;color:rgba(255,255,255,.65);font-size:.8rem;cursor:pointer;z-index:2}
    .utsav-tip-arrow{display:inline-block;margin-top:7px;font-size:.55rem;opacity:.45;letter-spacing:.04em}
    .utsav-help-pulse{animation:utsavHelpPulse 1.8s ease-in-out 2}
    .utsav-mood-auto-transition{position:fixed;inset:0;z-index:4900;display:grid;place-items:center;background:rgba(8,8,12,.42);backdrop-filter:blur(5px);animation:utsavAutoIn .38s ease-out}
    .utsav-mood-auto-transition.is-leaving{animation:utsavAutoOut .28s ease-in forwards}
    .utsav-mood-auto-card{display:grid;gap:4px;text-align:center;padding:20px 26px;border:1px solid rgba(255,255,255,.2);border-radius:24px;background:rgba(25,24,29,.94);color:#fff;box-shadow:0 25px 70px rgba(0,0,0,.45)}
    .utsav-mood-auto-card span{font-size:1.2rem}.utsav-mood-auto-card b{font-size:.95rem}.utsav-mood-auto-card small{font-size:.62rem;opacity:.62}
    @keyframes utsavAutoIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    @keyframes utsavAutoOut{from{opacity:1}to{opacity:0}}
    @keyframes utsavTipIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes utsavHelpPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}45%{box-shadow:0 0 0 8px rgba(255,255,255,.08)}}
    @media(max-width:520px){.utsav-help-card{border-radius:23px;padding:18px 14px 14px}.utsav-help-card h2{font-size:1.3rem}.utsav-tip{right:16px;left:16px;width:auto}.utsav-tip:after{right:28px}}
  `;
  document.head.appendChild(style);

  const musicHeading=document.querySelector('.music-heading');
  if(!musicHeading)return;

  // Persistent compact help control. The first visit also gets the full guided preview automatically.
  let helpBtn=document.getElementById('utsavHelpButton');
  if(!helpBtn){
    helpBtn=document.createElement('button');
    helpBtn.id='utsavHelpButton';
    helpBtn.type='button';
    helpBtn.className='utsav-help-button';
    helpBtn.setAttribute('aria-label','Open Utsav quick help');
    helpBtn.title='Quick help';
    helpBtn.textContent='?';
    const playlistBtn=document.getElementById('openPlaylist');
    musicHeading.insertBefore(helpBtn,playlistBtn||null);
  }

  const overlay=document.createElement('div');
  overlay.className='utsav-help-overlay';
  overlay.hidden=true;
  overlay.innerHTML=`
    <section class="utsav-help-card" role="dialog" aria-modal="true" aria-labelledby="utsavHelpTitle">
      <div class="utsav-help-kicker">WELCOME TO UTSAV • QUICK GUIDE</div>
      <h2 id="utsavHelpTitle">Make the most of your Puja countdown</h2>
      <p>A tiny game-style guide so a first-time visitor instantly knows what the controls do.</p>
      <div class="utsav-help-list">
        <div class="utsav-help-item"><div class="utsav-help-icon">▶</div><div><b>Play / Pause</b><span>Start or pause the current Puja song. The player remembers the selected track.</span></div></div>
        <div class="utsav-help-item"><div class="utsav-help-icon">☷</div><div><b>Full playlist</b><span>Open the complete playlist inside Utsav and jump directly to another song.</span></div></div>
        <div class="utsav-help-item"><div class="utsav-help-icon">✦</div><div><b>Mood</b><span>Hide the extra interface and enter the immersive countdown view while the music continues.</span></div></div>
      </div>
      <div class="utsav-help-actions"><button type="button" class="utsav-help-close" id="utsavHelpDone">Got it — let’s go</button></div>
    </section>`;
  document.body.appendChild(overlay);

  const closeHelp=()=>{overlay.hidden=true;safeSet(STORAGE_KEY);helpBtn.classList.remove('utsav-help-pulse')};
  const openHelp=()=>{overlay.hidden=false;safeSet(STORAGE_KEY);helpBtn.classList.remove('utsav-help-pulse');setTimeout(()=>document.getElementById('utsavHelpDone')?.focus(),30)};
  helpBtn.addEventListener('click',openHelp);
  document.getElementById('utsavHelpDone').addEventListener('click',closeHelp);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeHelp()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeHelp()});

  // First-visit preview: automatically teach the three key controls once.
  if(!safeGet(STORAGE_KEY)){
    helpBtn.classList.add('utsav-help-pulse');
    setTimeout(()=>openHelp(),650);
  }

  // Repeating in-player guidance + automatic Mood transition.
  // Uses elapsed wall-clock time while the YouTube player is actually PLAYING,
  // rather than nested setTimeouts. This makes the 60s reminder reliable even
  // when callbacks are slightly delayed by the browser.
  let tip=null;
  let tipTimer=null;
  let tipSongId=null;
  let tipDismissedForSong=false;
  let playingStartedAt=0;
  let accumulatedPlayingMs=0;
  let lastPlayerState=null;
  let monitorTimer=null;
  const TIP_INTERVAL=60000;
  const AUTO_MOOD_AFTER=120000;

  const clearTipTimer=()=>{if(tipTimer){clearTimeout(tipTimer);tipTimer=null}};
  const removeTip=()=>{if(tip){tip.remove();tip=null}};
  const stopSongTips=()=>{clearTipTimer();removeTip()};

  const getPlayerState=()=>{
    try{return window.ytPlayerForTips?.getPlayerState?.() ?? null}catch(_){return null}
  };
  const getSongId=()=>{
    try{return window.ytPlayerForTips?.getVideoData?.()?.video_id||null}catch(_){return null}
  };

  const resetSongGuidance=(songId)=>{
    tipSongId=songId||null;
    tipDismissedForSong=false;
    accumulatedPlayingMs=0;
    playingStartedAt=Date.now();
    clearTipTimer();
    removeTip();
  };

  const showPlayTip=()=>{
    if(document.body.classList.contains('mood-mode')||tipDismissedForSong)return;
    const songId=getSongId();
    if(songId!==tipSongId)resetSongGuidance(songId);
    if(tipDismissedForSong)return;

    removeTip();
    tip=document.createElement('aside');
    tip.className='utsav-tip manga-right';
    tip.setAttribute('role','status');
    tip.innerHTML=`<button type="button" class="utsav-tip-close" aria-label="Dismiss tip">×</button><div class="utsav-tip-row"><img class="utsav-tip-avatar" src="/utsav-logo.png" alt=""><div><b>🎵 Music is playing!</b><p>Try <strong>Mood</strong> ✦ for a more immersive experience. You can also open <strong>Full playlist</strong> to choose another song.</p><span class="utsav-tip-arrow">try Mood →</span></div></div>`;
    document.body.appendChild(tip);

    const dismiss=()=>{
      tipDismissedForSong=true;
      stopSongTips();
    };
    tip.querySelector('.utsav-tip-close').addEventListener('click',dismiss);

    const mood=document.getElementById('moodMode');
    mood?.classList.add('utsav-help-pulse');
    setTimeout(()=>mood?.classList.remove('utsav-help-pulse'),3600);
    setTimeout(()=>{if(tip)removeTip()},9000);
  };

  const enterMoodAutomatically=()=>{
    if(tipDismissedForSong||document.body.classList.contains('mood-mode'))return;
    const mood=document.getElementById('moodMode');
    if(!mood)return;
    removeTip();
    clearTipTimer();
    const transition=document.createElement('div');
    transition.className='utsav-mood-auto-transition';
    transition.setAttribute('role','status');
    transition.innerHTML='<div class="utsav-mood-auto-card"><span>✦</span><b>Mood is ready</b><small>Entering your immersive countdown…</small></div>';
    document.body.appendChild(transition);
    setTimeout(()=>{
      transition.classList.add('is-leaving');
      setTimeout(()=>{
        transition.remove();
        if(!document.body.classList.contains('mood-mode'))mood.click();
      },280);
    },900);
  };

  let lastTipBoundary=0;
  const guidanceMonitor=()=>{
    const now=Date.now();
    const state=getPlayerState();
    const songId=getSongId();
    if(songId && songId!==tipSongId){
      resetSongGuidance(songId);
      lastTipBoundary=0;
    }

    if(state===window.YT?.PlayerState?.PLAYING){
      if(lastPlayerState!==state)playingStartedAt=now;
      accumulatedPlayingMs+=Math.max(0,now-playingStartedAt);
      playingStartedAt=now;
      lastPlayerState=state;

      if(!tipDismissedForSong && !document.body.classList.contains('mood-mode')){
        const boundary=Math.floor(accumulatedPlayingMs/TIP_INTERVAL);
        if(boundary>lastTipBoundary){
          lastTipBoundary=boundary;
          showPlayTip();
        }
        if(accumulatedPlayingMs>=AUTO_MOOD_AFTER){
          enterMoodAutomatically();
          return;
        }
      }
    }else{
      lastPlayerState=state;
    }
  };

  const startGuidanceForCurrentSong=()=>{
    const songId=getSongId();
    // Reset only when the actual video changes. A pause/resume event for the
    // same song must not restart the one-minute reminder or two-minute clock.
    if(songId!==tipSongId){
      resetSongGuidance(songId);
      lastTipBoundary=0;
      showPlayTip();
    }else if(!tipDismissedForSong && !tip){
      // If a browser delayed the first state-change callback, ensure the
      // initial tip is still visible once playback is confirmed.
      showPlayTip();
    }
    if(!monitorTimer)monitorTimer=setInterval(guidanceMonitor,1000);
  };

  const moodButton=document.getElementById('moodMode');
  moodButton?.addEventListener('click',()=>{
    tipDismissedForSong=true;
    stopSongTips();
    if(!document.body.classList.contains('mood-mode')){
      // Manual entry also cancels the automatic 2-minute transition.
      accumulatedPlayingMs=0;
      playingStartedAt=Date.now();
    }
  });

  // Called by the existing YouTube state-change handler when playback begins.
  // Every new song starts a fresh guidance clock: immediate tip, then every
  // 60 seconds, and automatic Mood after 2 minutes of actual playback.
  window.UtsavShowFirstPlayTip=()=>startGuidanceForCurrentSong();
  window.UtsavStopSongTips=()=>{tipDismissedForSong=true;stopSongTips();};

})();
