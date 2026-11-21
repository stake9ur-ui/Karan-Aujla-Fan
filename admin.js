const $ = (s)=>document.querySelector(s);
const safe=(s="")=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initAdmin({supabase,ownerEmail,contentRef,setContent}){
 const modal=$("#adminModal"),login=$("#loginView"),dash=$("#dashboard");
 function msg(id,t){$(id).textContent=t}
 function showUser(user){if(user&&ownerEmail&&user.email?.toLowerCase()===ownerEmail.toLowerCase()){login.hidden=true;dash.hidden=false;$("#adminEmail").textContent=user.email;refreshList()}else{login.hidden=false;dash.hidden=true;if(user)msg("#loginMsg","This account is not the configured owner account.");}}
 async function refreshList(){const rows=contentRef();$("#contentList").innerHTML=rows.map(x=>`<div class="content-row"><span><b>${safe(x.type)}</b> — ${safe(x.title)}</span><span><button data-edit="${safe(x.id)}">EDIT</button> <button data-delete="${safe(x.id)}">DELETE</button></span></div>`).join("")||"No content yet."}
 $("#loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!supabase){msg("#loginMsg","Add Supabase URL, anon key and owner email in config.js, then reload.");return}const {data,error}=await supabase.auth.signInWithPassword({email:$("#email").value.trim(),password:$("#password").value});if(error){msg("#loginMsg",error.message);return}if(data.user?.email?.toLowerCase()!==ownerEmail.toLowerCase()){await supabase.auth.signOut();msg("#loginMsg","Access denied: owner account only.");return}showUser(data.user);});
 $("#logoutBtn").addEventListener("click",async()=>{await supabase?.auth.signOut();login.hidden=false;dash.hidden=true;});
 $("#contentForm").addEventListener("submit",async e=>{e.preventDefault();if(!supabase){msg("#saveMsg","Supabase is not configured.");return}const {data:{user}}=await supabase.auth.getUser();if(!user||user.email?.toLowerCase()!==ownerEmail.toLowerCase()){msg("#saveMsg","Owner session required.");return}
 const row={type:$("#type").value,title:$("#title").value.trim(),subtitle:$("#subtitle").value.trim(),description:$("#description").value.trim(),image_url:$("#image").value.trim()||null,youtube_url:$("#youtube").value.trim()||null,spotify_url:$("#spotify").value.trim()||null,date:$("#date").value.trim()||null,link:$("#link").value.trim()||null};
 const {error}=await supabase.from("fan_content").insert(row);if(error){msg("#saveMsg",error.message);return}e.target.reset();msg("#saveMsg","Published successfully.");await reload();
 });
 $("#contentList").addEventListener("click",async e=>{
  if(!supabase)return;
  const editId=e.target.dataset.edit;
  if(editId){
   const item=contentRef().find(x=>String(x.id)===String(editId));if(!item)return;
   const title=prompt("Edit title",item.title);if(title===null)return;
   const description=prompt("Edit description",item.description||"");if(description===null)return;
   const {error}=await supabase.from("fan_content").update({title:title.trim(),description:description.trim()}).eq("id",editId);
   if(error){msg("#saveMsg",error.message);return}await reload();return;
  }
  const id=e.target.dataset.delete;if(!id)return;if(!confirm("Delete this content item?"))return;
  const {error}=await supabase.from("fan_content").delete().eq("id",id);if(error){msg("#saveMsg",error.message);return}await reload()
 });
 async function reload(){const {data,error}=await supabase.from("fan_content").select("*").order("created_at",{ascending:false});if(error){msg("#saveMsg",error.message);return}setContent(data||[]);refreshList()}
 if(supabase)supabase.auth.getSession().then(({data})=>showUser(data.session?.user||null));
}
