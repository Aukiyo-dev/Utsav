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
let ytPlayer=null,ytApiLoading=false,shuffle=false,repeat=false,playlistCache={};
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
  playerGeneration++;
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
          $("#playlistStatus").textContent="YouTube playlist ready • tap play to begin";
          syncModes();
        }
      },
      onStateChange:e=>{
        if(!isModal && generation===playerGeneration && expectedPlaylistId===currentPlaylistId){
          const play=$("#ytPlay");
          if(play)play.textContent=e.data===YT.PlayerState.PLAYING?"Ⅱ":"▶";
          updateNowPlaying(e.target);
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

function updateNowPlaying(p){
  try{
    $("#nowPlaying").textContent="Now playing • "+(p.getVideoData()?.title||"YouTube playlist");
  }catch(e){}
}

function syncModes(){
  const sh=$("#ytShuffle"),rp=$("#ytRepeat");
  if(sh){sh.classList.toggle("active",shuffle);sh.setAttribute("aria-pressed",String(shuffle));}
  if(rp){rp.classList.toggle("active",repeat);rp.setAttribute("aria-pressed",String(repeat));}
}

$("#ytPlay").addEventListener("click",()=>{
  if(!ytPlayer)return;
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
