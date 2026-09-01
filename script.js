const FESTIVALS={
 durga:{name:"Durga Puja",mark:"01",subtitle:"The first Puja day is almost here.",target:"2026-10-16T00:00:00+05:30",date:"Friday, 16 October 2026",playlistId:"PLcEXU5KhRttE",background:"/durga-puja.jpg",mobileBackground:"/durga-puja-mobile.jpg"},
 kali:{name:"Kali Puja",mark:"02",subtitle:"A night of lights, devotion and celebration.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistId:"PLHwvw4RcSUnk",background:"/kali-puja.jpg",mobileBackground:"/kali-puja-mobile.jpg"},
 mahalaya:{name:"Mahalaya",mark:"03",subtitle:"The sacred Mahalaya morning is getting closer.",target:"2026-10-10T00:00:00+05:30",date:"Saturday, 10 October 2026",playlistId:"PLZMOb9zpbEKQ",background:"/mahalaya.jpg",mobileBackground:"/mahalaya-mobile.jpg",
   playlists:{
     iconic:{name:"Iconic Mahalaya",playlistId:"PLZMOb9zpbEKQ"},
     collection:{name:"Mahalaya Collection",playlistId:"PLPEyl3dIK7O0"}
   }
 }
};
let selected=(location.pathname.includes("/kali-puja-countdown/")?"kali":location.pathname.includes("/mahalaya-countdown/")?"mahalaya":"durga"),ytPlayer=null,shuffle=false,repeat=false,playlistCache={},currentPlaylistId=null,currentPlaylistKey="iconic";
const $=s=>document.querySelector(s);

let celebrationShown={durga:false,kali:false,mahalaya:false};

const FESTIVE_MESSAGES={
  50:(name)=>`${name} is getting closer. There’s still a little time — enjoy the playlist and set the mood.`,
  20:(name)=>`Start getting ready. ${name} is at the doorstep — your preparations can begin.`,
  10:(name)=>`${name} is knocking on your door. Start your preparations now.`,
  2:(name)=>`Just 2 days to go. ${name} is almost here — let the celebration begin.`,
  1:(name)=>`Tomorrow is the day. One more sleep until ${name}. ✨`
};

function showFestivalMessage(text,hidden=false){
  const el=$("#festivalMessage");
  if(!el)return;
  el.textContent=text||"";
  el.hidden=hidden;
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
    ["days","hours","minutes","seconds"].forEach(id=>{
      const el=$("#"+id);
      if(el)el.textContent="00";
    });

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

  $("#days").textContent=String(days).padStart(2,"0");
  $("#hours").textContent=String(hours).padStart(2,"0");
  $("#minutes").textContent=String(minutes).padStart(2,"0");
  $("#seconds").textContent=String(seconds).padStart(2,"0");

  let msg=null;
  if(days<=1) msg=FESTIVE_MESSAGES[1](f.name);
  else if(days<=2) msg=FESTIVE_MESSAGES[2](f.name);
  else if(days<=10) msg=FESTIVE_MESSAGES[10](f.name);
  else if(days<=20) msg=FESTIVE_MESSAGES[20](f.name);
  else if(days<=50) msg=FESTIVE_MESSAGES[50](f.name);

  showFestivalMessage(msg,!msg);

  const box=$(".countdown");
  if(box)box.classList.remove("arrived");
}

function renderFestival(){
 const f=FESTIVALS[selected];
 const countdown=$(".countdown");
 if(countdown) countdown.innerHTML='<div class="time"><strong id="days">00</strong><span>DAYS</span></div><i></i><div class="time"><strong id="hours">00</strong><span>HOURS</span></div><i></i><div class="time"><strong id="minutes">00</strong><span>MINUTES</span></div><i></i><div class="time"><strong id="seconds">00</strong><span>SECONDS</span></div>';
 celebrationShown[selected]=false; document.body.classList.remove("festival-arrived");
 $("#festivalMark").textContent=f.mark;$("#festivalTitle").textContent=f.name;
 $("#festivalSubtitle").textContent=f.subtitle;$("#targetDate").textContent=f.date;
 $("#playlistName").textContent=f.name;
 const scene=$("#scene");
 if(scene){
   scene.style.setProperty("--desktop-bg",`url("${f.background}")`);
   scene.style.setProperty("--mobile-bg",`url("${f.mobileBackground||f.background}")`);
 }
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.festival===selected));

 const choiceBox=$("#mahalayaPlaylistChoices");
 if(choiceBox){
   const isMahalaya=selected==="mahalaya";
   choiceBox.hidden=!isMahalaya;
   if(isMahalaya){
     const validKeys=["iconic","collection"];
     if(!validKeys.includes(currentPlaylistKey))currentPlaylistKey="iconic";
     document.querySelectorAll(".playlist-choice").forEach(b=>{
       const on=b.dataset.playlist===currentPlaylistKey;
       b.classList.toggle("active",on);
       b.setAttribute("aria-pressed",String(on));
     });
     currentPlaylistId=f.playlists[currentPlaylistKey].playlistId;
   }else{
     currentPlaylistId=f.playlistId;
   }
 }
 if(ytPlayer && typeof ytPlayer.destroy==="function"){
   try{ytPlayer.destroy();}catch(e){}
   ytPlayer=null;
 }
 createYouTubePlayer("youtubePlayer",currentPlaylistId||f.playlistId,185,false);
}
function loadYTAPI(){
 if(window.YT?.Player){createYouTubePlayer("youtubePlayer",currentPlaylistId||FESTIVALS[selected].playlistId,185,false);return;}
 if(document.getElementById("youtube-api"))return;
 window.onYouTubeIframeAPIReady=()=>createYouTubePlayer("youtubePlayer",currentPlaylistId||FESTIVALS[selected].playlistId,185,false);
 const s=document.createElement("script");s.id="youtube-api";s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s);
}
function createYouTubePlayer(containerId,playlistId,height,isModal=false){
 const c=$("#"+containerId);if(!c)return;
 c.innerHTML="";
 const d=document.createElement("div");
 d.id=containerId+"Frame";
 c.appendChild(d);
 if(!window.YT?.Player){loadYTAPI();return;}

 const player=new YT.Player(d.id,{
  height:String(height),width:"100%",
  playerVars:{
    listType:"playlist",list:playlistId,index:0,
    playsinline:1,rel:0,modestbranding:1
  },
  events:{
   onReady:e=>{
    if(!isModal){
      ytPlayer=e.target;
      $("#playlistStatus").textContent="YouTube playlist ready • tap play to begin";
      syncModes();
    }
   },
   onStateChange:e=>{
    if(!isModal){
      $("#ytPlay").textContent=
        e.data===YT.PlayerState.PLAYING?"Ⅱ":"▶";
      updateNowPlaying(e.target);
    }
   },
   onError:e=>{
    if(!isModal){
      $("#nowPlaying").textContent="This YouTube video may not allow embedding.";
    }
   }
  }
 });
 return player;
}

function updateNowPlaying(p){
 try{$("#nowPlaying").textContent="Now playing • "+(p.getVideoData()?.title||"YouTube playlist");}catch(e){}
}
function syncModes(){
 $("#ytShuffle").classList.toggle("active",shuffle);$("#ytShuffle").setAttribute("aria-pressed",String(shuffle));
 $("#ytRepeat").classList.toggle("active",repeat);$("#ytRepeat").setAttribute("aria-pressed",String(repeat));
}
$("#ytPlay").addEventListener("click",()=>{if(!ytPlayer)return;if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING)ytPlayer.pauseVideo();else ytPlayer.playVideo();});
$("#ytPrev").addEventListener("click",()=>ytPlayer?.previousVideo());
$("#ytNext").addEventListener("click",()=>ytPlayer?.nextVideo());
$("#ytShuffle").addEventListener("click",()=>{shuffle=!shuffle;syncModes();ytPlayer?.setShuffle(shuffle);});
$("#ytRepeat").addEventListener("click",()=>{repeat=!repeat;syncModes();ytPlayer?.setLoop(repeat);});

async function getPlaylistItems(playlistId){
 if(playlistCache[playlistId])return playlistCache[playlistId];

 if(!Object.values(FESTIVALS).some(f=>f.playlistId===playlistId) && !Object.values(FESTIVALS).some(f=>f.playlists && Object.values(f.playlists).some(p=>p.playlistId===playlistId))){
   throw new Error("Playlist is not configured.");
 }

 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),12000);

 try{
   const u=new URL("/api/playlist",window.location.origin);
   u.searchParams.set("playlistId",playlistId);

   const r=await fetch(u.toString(),{
     method:"GET",
     headers:{Accept:"application/json"},
     cache:"no-store",
     signal:controller.signal
   });

   const text=await r.text();
   let d={};
   try{d=JSON.parse(text)}catch(_){}

   if(!r.ok){
     throw new Error(d.error||`Playlist service returned HTTP ${r.status}.`);
   }

   if(!Array.isArray(d.items)){
     throw new Error("Playlist service returned an invalid response.");
   }

   playlistCache[playlistId]=d.items;
   return d.items;
 }catch(e){
   if(e.name==="AbortError"){
     throw new Error("The playlist took too long to load. Check the Vercel API deployment and try again.");
   }
   throw e;
 }finally{
   clearTimeout(timeout);
 }
}

function renderPlaylistItems(items){
 const box=$("#playlistItems");
 box.innerHTML="";
 if(!items.length){
   box.innerHTML='<div class="playlist-error">No songs were found in this playlist.</div>';
   return;
 }

 items.forEach((item,i)=>{
   const vid=item.videoId;
   if(!vid)return;

   const b=document.createElement("button");
   b.type="button";
   b.className="playlist-row";
   b.dataset.videoId=vid;

   const thumb=item.thumbnails?.medium?.url ||
                item.thumbnails?.high?.url ||
                item.thumbnails?.default?.url ||
                `https://i.ytimg.com/vi/${encodeURIComponent(vid)}/mqdefault.jpg`;

   b.innerHTML=`
     <span class="playlist-number">${String(i+1).padStart(2,"0")}</span>
     <img class="playlist-thumb" src="${escapeAttr(thumb)}" alt="" loading="lazy">
     <span class="playlist-meta">
       <span class="playlist-title">${escapeHTML(item.title||"Untitled")}</span>
       <span class="playlist-channel">${escapeHTML(item.channel||"YouTube")}</span>
     </span>`;

   b.addEventListener("click",()=>{
     // Use the main compact player so the selected song plays inside Utsav.
     if(ytPlayer){
       ytPlayer.loadVideoById(vid);
       document.querySelectorAll(".playlist-row").forEach(x=>x.classList.remove("active"));
       b.classList.add("active");
       closePlaylist();
     }else{
       closePlaylist();
       // The main YouTube player is initialized by renderFestival().
       setTimeout(()=>{
         if(ytPlayer){
           ytPlayer.loadVideoById(vid);
           ytPlayer.playVideo();
         }
       },500);
     }
   });

   box.appendChild(b);
 });
}
function escapeHTML(v){
 const d=document.createElement("div");
 d.textContent=String(v??"");
 return d.innerHTML;
}
function escapeAttr(v){
 return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function openPlaylist(){
 const f=FESTIVALS[selected];
 $("#modalTitle").textContent=f.name;
 $("#playlistModal").hidden=false;
 document.body.style.overflow="hidden";

 const box=$("#playlistItems");
 box.innerHTML='<div class="playlist-loading"><span class="loading-dot"></span> Loading all songs…</div>';

 try{
   const items=await getPlaylistItems(currentPlaylistId||f.playlistId);
   renderPlaylistItems(items);
 }catch(e){
   box.innerHTML=
    `<div class="playlist-error">
      <strong>Could not load the playlist.</strong>
      <br><br>${escapeHTML(e.message)}
      <br><br><small>Make sure <b>api/playlist.js</b> is committed to GitHub, <b>YOUTUBE_DATA_API_KEY</b> is set in Vercel, and the latest deployment is live.</small>
    </div>`;
 }
}

function closePlaylist(){
 $("#playlistModal").hidden=true;
 document.body.style.overflow="";
}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{selected=b.dataset.festival; if(selected!=="mahalaya")currentPlaylistKey="iconic"; renderFestival();}));

document.querySelectorAll(".playlist-choice").forEach(b=>b.addEventListener("click",()=>{
  if(selected!=="mahalaya")return;
  currentPlaylistKey=b.dataset.playlist;
  const f=FESTIVALS.mahalaya;
  currentPlaylistId=f.playlists[currentPlaylistKey].playlistId;
  document.querySelectorAll(".playlist-choice").forEach(x=>{
    const on=x.dataset.playlist===currentPlaylistKey;
    x.classList.toggle("active",on);
    x.setAttribute("aria-pressed",String(on));
  });
  if(ytPlayer && typeof ytPlayer.destroy==="function"){
    try{ytPlayer.destroy();}catch(e){}
    ytPlayer=null;
  }
  createYouTubePlayer("youtubePlayer",currentPlaylistId,185,false);
  $("#playlistName").textContent=f.name+" • "+f.playlists[currentPlaylistKey].name;
  $("#playlistStatus").textContent="Playlist selected • tap play to begin";
}));
$("#openPlaylist").addEventListener("click",openPlaylist);$("#closePlaylist").addEventListener("click",closePlaylist);$("#closeByBackdrop").addEventListener("click",closePlaylist);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#playlistModal").hidden)closePlaylist();});
renderFestival();updateCountdown();setInterval(updateCountdown,1000);


/* Utsav Mood Mode */
(()=>{
  const btn=document.getElementById("moodMode");
  const countdown=document.querySelector(".countdown");
  if(!btn) return;
  const setMode=(on)=>{
    document.body.classList.toggle("mood-mode",on);
    btn.setAttribute("aria-pressed",String(on));
    btn.setAttribute("aria-label",on?"Exit mood mode":"Enter mood mode");
    btn.textContent=on?"× Exit":"✦ Mood";
    if(on && ytPlayer && typeof ytPlayer.playVideo==="function"){
      try{ytPlayer.playVideo();}catch(e){}
    }
  };
  btn.addEventListener("click",()=>setMode(!document.body.classList.contains("mood-mode")));
  document.addEventListener("keydown",e=>{if(e.key==="Escape" && document.body.classList.contains("mood-mode")) setMode(false);});
  // Double-tap the countdown on mobile to restore the interface after it is hidden.
  let lastTap=0;
  countdown?.addEventListener("click",()=>{
    const now=Date.now();
    if(document.body.classList.contains("mood-mode") && now-lastTap<350) setMode(false);
    lastTap=now;
  });
})();


/* Creator, support and Aukiyo dialogs */
(() => {
  const pairs = [
    ["openCreator","creatorModal","creatorClose","creatorBackdrop"],
    ["openChai","chaiModal","chaiClose","chaiBackdrop"],
    ["openAukiyo","aukiyoModal","aukiyoClose","aukiyoBackdrop"]
  ];
  pairs.forEach(([openId, modalId, closeId, backdropId]) => {
    const open=document.getElementById(openId);
    const modal=document.getElementById(modalId);
    const close=document.getElementById(closeId);
    const backdrop=document.getElementById(backdropId);
    if(!open || !modal) return;
    const hide=()=>{modal.hidden=true};
    open.addEventListener("click",()=>{modal.hidden=false});
    close?.addEventListener("click",hide);
    backdrop?.addEventListener("click",hide);
  });
  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
      document.querySelectorAll(".creator-modal:not([hidden])").forEach(m=>m.hidden=true);
    }
  });
})();

/* Copyable UPI ID */
(()=>{
  const copyBtn=document.getElementById("copyUpi");
  const value=document.getElementById("upiIdValue");
  const status=document.getElementById("upiCopyStatus");
  if(!copyBtn || !value)return;
  copyBtn.addEventListener("click",async()=>{
    const text=value.textContent.trim();
    try{
      await navigator.clipboard.writeText(text);
      copyBtn.textContent="Copied!";
      if(status)status.textContent="UPI ID copied to clipboard.";
    }catch(e){
      const area=document.createElement("textarea");
      area.value=text;
      area.setAttribute("readonly","");
      area.style.position="fixed";
      area.style.opacity="0";
      document.body.appendChild(area);
      area.select();
      try{
        document.execCommand("copy");
        copyBtn.textContent="Copied!";
        if(status)status.textContent="UPI ID copied to clipboard.";
      }catch(_){
        if(status)status.textContent="Copy failed — please copy the UPI ID manually.";
      }
      area.remove();
    }
    setTimeout(()=>{copyBtn.textContent="Copy"; if(status)status.textContent="";},1800);
  });
})();
