const FESTIVALS={
 durga:{name:"Durga Puja",mark:"01",subtitle:"The first Puja day is almost here.",target:"2026-10-16T00:00:00+05:30",date:"Friday, 16 October 2026",playlistId:"PLcEXU5KhRttE",background:"durga-puja.jpg"},
 kali:{name:"Kali Puja",mark:"02",subtitle:"A night of lights, devotion and celebration.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistId:"PLHwvw4RcSUnk",background:"kali-puja.jpg"},
 diwali:{name:"Diwali",mark:"03",subtitle:"The festival of lights is getting closer.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistId:"PLVJ3mfjGvnXU",background:"diwali.jpg"}
};
let selected="durga",ytPlayer=null,shuffle=false,repeat=false,playlistCache={};
const $=s=>document.querySelector(s);

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
 $("#festivalMark").textContent=f.mark;$("#festivalTitle").textContent=f.name;
 $("#festivalSubtitle").textContent=f.subtitle;$("#targetDate").textContent=f.date;
 $("#playlistName").textContent=f.name;$("#scene").style.backgroundImage=`url("${f.background}")`;
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.festival===selected));
 createYouTubePlayer("youtubePlayer",f.playlistId,185,false);
}
function loadYTAPI(){
 if(window.YT?.Player){createYouTubePlayer("youtubePlayer",FESTIVALS[selected].playlistId,185,false);return;}
 if(document.getElementById("youtube-api"))return;
 window.onYouTubeIframeAPIReady=()=>createYouTubePlayer("youtubePlayer",FESTIVALS[selected].playlistId,185,false);
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

 const allowed = Object.values(FESTIVALS).some(f=>f.playlistId===playlistId);
 if(!allowed) throw new Error("Playlist is not configured.");

 const u = new URL("/api/playlist", window.location.origin);
 u.searchParams.set("playlistId", playlistId);

 const r = await fetch(u, {headers: {"Accept":"application/json"}});
 const d = await r.json().catch(()=>({}));
 if(!r.ok) throw new Error(d.error || "Unable to load the playlist.");

 playlistCache[playlistId] = d.items || [];
 return playlistCache[playlistId];
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
function escapeAttr(v){
 return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function openPlaylist(){
 const f=FESTIVALS[selected];
 $("#modalTitle").textContent=f.name;
 $("#playlistModal").hidden=false;
 document.body.style.overflow="hidden";
 $("#playlistItems").innerHTML='<div class="playlist-loading">Loading all songs…</div>';

 try{
   const items=await getPlaylistItems(f.playlistId);
   renderPlaylistItems(items);
 }catch(e){
   $("#playlistItems").innerHTML=
     `<div class="playlist-error">${escapeHTML(e.message)}<br><br>
      Check that <strong>api/playlist.js</strong> is in GitHub and
      <strong>YOUTUBE_DATA_API_KEY</strong> is set in Vercel, then redeploy.</div>`;
 }
}

function closePlaylist(){
 $("#playlistModal").hidden=true;
 document.body.style.overflow="";
}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{selected=b.dataset.festival;renderFestival();}));
$("#openPlaylist").addEventListener("click",openPlaylist);$("#closePlaylist").addEventListener("click",closePlaylist);$("#closeByBackdrop").addEventListener("click",closePlaylist);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#playlistModal").hidden)closePlaylist();});
renderFestival();updateCountdown();setInterval(updateCountdown,1000);
