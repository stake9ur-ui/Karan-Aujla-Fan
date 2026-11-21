import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, OWNER_EMAIL } from "./config.js";
import { initAdmin } from "./admin.js";

const $ = (s)=>document.querySelector(s);
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PASTE_") && !SUPABASE_ANON_KEY.includes("PASTE_");
export const supabase = configured ? createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
let content = [
 {id:"d1",type:"song",title:"On Top",subtitle:"Fan starter pick",description:"Add the verified release details and official listening links in the owner dashboard."},
 {id:"d2",type:"song",title:"Softly",subtitle:"Fan starter pick",description:"Add the verified release details and official listening links in the owner dashboard."},
 {id:"d3",type:"album",title:"Making Memories",subtitle:"Album collection",description:"Album showcase placeholder. Add authorized artwork and track links."},
 {id:"d4",type:"album",title:"Four You",subtitle:"EP collection",description:"Album showcase placeholder. Add authorized artwork and track links."},
 {id:"d5",type:"timeline",title:"Artist journey",subtitle:"Career timeline",description:"Add verified career milestones and dates from reliable sources."},
 {id:"d6",type:"award",title:"Awards & achievements",subtitle:"Recognition",description:"Add verified award names, years and sources."},
 {id:"d7",type:"fan",title:"Welcome to the fan zone",subtitle:"Community",description:"A place for fans to celebrate the music."}
];
function safe(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function ytId(url=""){try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1);return u.searchParams.get("v")||u.pathname.split("/").filter(Boolean).pop()}catch{return ""}}
function link(url,label){return url?`<a class="tiny-link" href="${safe(url)}" target="_blank" rel="noopener">${label} ↗</a>`:""}
function embeds(x){
 let out="";
 const id=ytId(x.youtube_url||"");
 if(id) out+=`<iframe class="music-embed" src="https://www.youtube-nocookie.com/embed/${safe(id)}" title="${safe(x.title)} YouTube player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
 if(x.spotify_url){let u=x.spotify_url;try{const parsed=new URL(u);if(parsed.hostname.endsWith("spotify.com")){const parts=parsed.pathname.split("/").filter(Boolean);if(parts.length>=2)out+=`<iframe class="music-embed spotify-embed" src="https://open.spotify.com/embed/${safe(parts[0])}/${safe(parts[1])}?utm_source=generator" title="${safe(x.title)} Spotify player" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`}}catch{}}
 return out;
}
function empty(msg){return `<div class="empty">${msg}</div>`}
function render(){
 const songs=content.filter(x=>x.type==="song"||x.type==="lyrics");
 $("#musicGrid").innerHTML=songs.length?songs.map(x=>`<article class="music-card" data-kind="${x.type}"><span class="card-kicker">${safe(x.type.toUpperCase())} / ${safe(x.subtitle||"MUSIC")}</span><div><h3>${safe(x.title)}</h3><p class="muted">${safe(x.description||"")}</p>${embeds(x)}</div><div class="card-links">${link(x.youtube_url,"YOUTUBE")}${link(x.spotify_url,"SPOTIFY")}${link(x.link,"MORE")}</div></article>`).join(""):empty("No music added yet. Owner can publish content in Admin.");
 const albums=content.filter(x=>x.type==="album");
 $("#albumGrid").innerHTML=albums.length?albums.map(x=>`<article class="album-card"><div class="cover">${x.image_url?`<img src="${safe(x.image_url)}" alt="${safe(x.title)}">`:`<span class="cover-mark">KA</span>`}</div><h3>${safe(x.title)}</h3><p class="muted">${safe(x.subtitle||"ALBUM")}</p><div class="card-links">${link(x.spotify_url,"LISTEN")}${link(x.youtube_url,"WATCH")}</div></article>`).join(""):empty("Album cards will appear here when added.");
 const vids=content.filter(x=>x.type==="video");
 $("#videoGrid").innerHTML=vids.length?vids.map(x=>{let id=ytId(x.youtube_url);return `<article class="video-card"><div class="thumb">${id?`<a href="${safe(x.youtube_url)}" target="_blank" rel="noopener"><img src="https://img.youtube.com/vi/${safe(id)}/hqdefault.jpg" alt=""><span class="play">▶</span></a>`:x.image_url?`<img src="${safe(x.image_url)}" alt="">`:`<span class="play">▶</span>`}</div><div class="info"><h3>${safe(x.title)}</h3><p class="muted">${safe(x.description||"")}</p>${link(x.youtube_url,"WATCH VIDEO")}</div></article>`}).join(""):empty("Add official music video links from Admin.");
 const pics=content.filter(x=>x.type==="photo");
 $("#galleryGrid").innerHTML=pics.length?pics.map(x=>`<div class="gallery-card" data-image="${safe(x.image_url||"")}">${x.image_url?`<img src="${safe(x.image_url)}" alt="${safe(x.title)}">`:`<div class="cover-mark">KA</div>`}</div>`).join(""):empty("Add photos you own or are licensed to use.");
 const timeline=content.filter(x=>x.type==="timeline").sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 $("#timeline").innerHTML=timeline.length?timeline.map(x=>`<article class="time-item"><strong>${safe(x.date||"MILESTONE")}</strong><h3>${safe(x.title)}</h3><p>${safe(x.description||"")}</p></article>`).join(""):empty("Verified artist milestones will appear here.");
 const awards=content.filter(x=>x.type==="award");
 $("#awards").innerHTML=awards.length?awards.map(x=>`<article class="award-card"><strong>${safe(x.date||"RECOGNITION")}</strong><h3>${safe(x.title)}</h3><p class="muted">${safe(x.description||"")}</p>${link(x.link,"SOURCE")}</article>`).join(""):empty("Add verified awards and achievements.");
 const concerts=content.filter(x=>x.type==="concert");
 $("#concertGrid").innerHTML=concerts.length?concerts.map(x=>`<article class="concert-card"><div><span class="card-kicker">${safe(x.date||"DATE TBA")}</span><h3>${safe(x.title)}</h3><p class="muted">${safe(x.description||"")}</p></div>${link(x.link,"EVENT INFO")}</article>`).join(""):empty("No verified concert dates published. Check official artist channels.");
 const fan=content.filter(x=>x.type==="fan");
 $("#fanPosts").innerHTML=fan.length?fan.map(x=>`<p>✦ <b>${safe(x.title)}</b><br>${safe(x.description||"")}</p>`).join(""):"Fan community highlights will appear here.";
}
async function loadContent(){
 if(supabase){const {data,error}=await supabase.from("fan_content").select("*").order("created_at",{ascending:false});if(!error&&data&&data.length)content=data;else if(error)console.warn("Supabase content:",error.message);}
 render();
}
window.addEventListener("scroll",()=>{let max=document.documentElement.scrollHeight-innerHeight;$("#progress").style.width=(max>0?scrollY/max*100:0)+"%";},{passive:true});
$("#enterBtn").addEventListener("click",()=>$("#intro").classList.add("done"));
setTimeout(()=>$("#intro").classList.add("done"),6500);
$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("show"));
$("#nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("show")));
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".music-card").forEach(c=>c.style.display=b.dataset.filter==="all"||c.dataset.filter===b.dataset.filter?"flex":"none")}));
$("#galleryGrid").addEventListener("click",e=>{const card=e.target.closest(".gallery-card");if(card?.dataset.image){$("#lightboxContent").innerHTML=`<img src="${safe(card.dataset.image)}" alt="">`;$("#lightbox").classList.add("open")}});
$("#lightboxClose").addEventListener("click",()=>$("#lightbox").classList.remove("open"));
$("#adminOpen").addEventListener("click",()=>$("#adminModal").classList.add("open"));
$("#footerAdmin").addEventListener("click",()=>$("#adminModal").classList.add("open"));
$("#closeAdmin").addEventListener("click",()=>$("#adminModal").classList.remove("open"));
initAdmin({supabase,ownerEmail:OWNER_EMAIL,contentRef:()=>content,setContent:(v)=>{content=v;render();}});
function init3D(){
 const canvas=$("#stage");if(!canvas||!window.WebGLRenderingContext)return;
 try{
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x080809,.055);
 const camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.set(0,0,9);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 scene.add(new THREE.AmbientLight(0xffffff,.8));const red=new THREE.PointLight(0xff2638,35,18);red.position.set(3,2,4);scene.add(red);
 const key=new THREE.PointLight(0xffffff,18,20);key.position.set(-4,3,5);scene.add(key);
 const disc=new THREE.Group();scene.add(disc);
 const mat=new THREE.MeshStandardMaterial({color:0x999999,metalness:1,roughness:.22});
 const black=new THREE.MeshStandardMaterial({color:0x171719,metalness:.75,roughness:.3});
 const outer=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.15,.13,96),mat);outer.rotation.x=Math.PI/2;disc.add(outer);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(1.95,1.95,.135,96),black);inner.rotation.x=Math.PI/2;disc.add(inner);
 for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.35+i*.11,.008,6,96),mat);ring.position.z=.08;disc.add(ring)}
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.16,48),mat);hub.rotation.x=Math.PI/2;hub.position.z=.1;disc.add(hub);
 const hole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.18,32),black);hole.rotation.x=Math.PI/2;hole.position.z=.19;disc.add(hole);
 const particles=new THREE.BufferGeometry(),count=900,positions=new Float32Array(count*3);
 for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*17;positions[i*3+1]=(Math.random()-.5)*10;positions[i*3+2]=(Math.random()-.5)*7}
 particles.setAttribute("position",new THREE.BufferAttribute(positions,3));
 const points=new THREE.Points(particles,new THREE.PointsMaterial({color:0xff3442,size:.025,transparent:true,opacity:.8}));scene.add(points);
 let mx=0,my=0;window.addEventListener("pointermove",e=>{mx=(e.clientX/innerWidth-.5)*.7;my=(e.clientY/innerHeight-.5)*.5},{passive:true});
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();window.addEventListener("resize",resize);
 function animate(){requestAnimationFrame(animate);disc.rotation.y+=.003;disc.rotation.x=Math.sin(Date.now()*.0004)*.12+my;disc.rotation.z=mx;points.rotation.y+=.00025;renderer.render(scene,camera)}animate();
 }catch(e){console.warn("3D stage unavailable:",e)}
}
init3D();loadContent();
