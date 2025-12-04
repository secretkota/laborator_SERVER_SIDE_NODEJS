async function poll(){
 const res=await fetch("/webhook-receiver");
 const events=await res.json();
 const box=document.getElementById("events");
 box.innerHTML="";
 events.forEach(e=>{
  const d=document.createElement("div");
  d.textContent=JSON.stringify(e);
  box.appendChild(d);
 });
 setTimeout(poll,1500);
}
poll();