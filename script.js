const FESTIVALS={
 durga:{name:"Durga Puja",mark:"01",subtitle:"The first Puja day is almost here.",target:"2026-10-16T00:00:00+05:30",date:"Friday, 16 October 2026",playlistId:"PLcEXU5KhRttE",background:"durga-puja.jpg"},
 kali:{name:"Kali Puja",mark:"02",subtitle:"A night of lights, devotion and celebration.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistId:"PLHwvw4RcSUnk",background:"kali-puja.jpg"},
 diwali:{name:"Diwali",mark:"03",subtitle:"The festival of lights is getting closer.",target:"2026-11-08T00:00:00+05:30",date:"Sunday, 8 November 2026",playlistId:"PLVJ3mfjGvnXU",background:"diwali.jpg"}
};
let selected="durga",ytPlayer=null,ytReady=false,shuffle=false,repeat=false;

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
 $("#festivalMark").textContent=f.mark;
 $("#festivalTitle").textContent=f.name;
 $("#festivalSubtitle").textContent=f.subtitle;
 $("#targetDate").textContent=f.date;
 $("#playlistName").textContent=f.name;
 $("#scene").style.backgroundImage=`url("${f.background}")`;
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.festival===selected));
 createYouTubePlayer("youtubePlayer",f.playlistId,185);
}

function loadYTAPI(){
 if(window.YT&&window.YT.Player){createYouTubePlayer("youtubePlayer",FESTIVALS[selected].playlistId,185);return;}
 if(document.getElementById("youtube-api"))return;
 window.onYouTubeIframeAPIReady=()=>{ytReady=true;createYouTubePlayer("youtubePlayer",FESTIVALS[selected].playlistId,185);};
 const s=document.createElement("script");s.id="youtube-api";s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s);
}

function createYouTubePlayer(containerId,playlistId,height){
 const container=$("#"+containerId);
 if(!container)return;
 container.innerHTML="";
 const div=document.createElement("div");
 div.id=containerId+"Frame";
 container.appendChild(div);
 if(!window.YT||!window.YT.Player){loadYTAPI();return;}
 new YT.Player(div.id,{
   height:String(height),width:"100%",
   playerVars:{listType:"playlist",list:playlistId,playsinline:1,rel:0,modestbranding:1},
   events:{
    onReady:e=>{
      if(containerId==="youtubePlayer"){
        ytPlayer=e.target;ytReady=true;
        $("#playlistStatus").textContent="YouTube playlist ready • full videos where embedding is allowed";
        syncModes();
      }
    },
    onStateChange:e=>{
      if(containerId!=="youtubePlayer")return;
      if(e.data===YT.PlayerState.PLAYING) $("#ytPlay").textContent="Ⅱ";
      else $("#ytPlay").textContent="▶";
      updateNowPlaying(e.target);
    },
    onError:e=>{
      if(containerId==="youtubePlayer") $("#nowPlaying").textContent="This YouTube video may not allow embedding.";
    }
   }
 });
}

function updateNowPlaying(p){
 try{
   const d=p.getVideoData();
   const title=d&&d.title?d.title:"YouTube playlist";
   $("#nowPlaying").textContent="Now playing • "+title;
 }catch(e){}
}

function syncModes(){
 $("#ytShuffle").classList.toggle("active",shuffle);
 $("#ytShuffle").setAttribute("aria-pressed",String(shuffle));
 $("#ytRepeat").classList.toggle("active",repeat);
 $("#ytRepeat").setAttribute("aria-pressed",String(repeat));
}

$("#ytPlay").addEventListener("click",()=>{
 if(!ytPlayer)return;
 if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING)ytPlayer.pauseVideo();else ytPlayer.playVideo();
});
$("#ytPrev").addEventListener("click",()=>{if(ytPlayer)ytPlayer.previousVideo();});
$("#ytNext").addEventListener("click",()=>{if(ytPlayer)ytPlayer.nextVideo();});
$("#ytShuffle").addEventListener("click",()=>{
 shuffle=!shuffle;syncModes();
 if(ytPlayer)ytPlayer.setShuffle(shuffle);
});
$("#ytRepeat").addEventListener("click",()=>{
 repeat=!repeat;syncModes();
 if(ytPlayer)ytPlayer.setLoop(repeat);
});

function openPlaylist(){
 const f=FESTIVALS[selected];
 $("#modalTitle").textContent=f.name;
 createYouTubePlayer("modalYoutube",f.playlistId,520);
 $("#playlistModal").hidden=false;
 document.body.style.overflow="hidden";
}
function closePlaylist(){
 $("#playlistModal").hidden=true;
 document.body.style.overflow="";
 const c=$("#modalYoutube");if(c)c.innerHTML="";
}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
 selected=b.dataset.festival;renderFestival();
}));
$("#openPlaylist").addEventListener("click",openPlaylist);
$("#closePlaylist").addEventListener("click",closePlaylist);
$("#closeByBackdrop").addEventListener("click",closePlaylist);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#playlistModal").hidden)closePlaylist();});

renderFestival();
updateCountdown();
setInterval(updateCountdown,1000);
