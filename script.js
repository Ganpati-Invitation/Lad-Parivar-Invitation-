document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("openingGate");
  const openInvitation = document.getElementById("openInvitation");

  function openGate(){
    if(!gate || gate.classList.contains("opened")) return;
    gate.classList.add("opened");
    setTimeout(()=>document.body.classList.remove("intro-lock"),650);
  }

  openInvitation?.addEventListener("click",openGate);
  openInvitation?.addEventListener("keydown",(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openGate();}});

  document.querySelectorAll(".scroll-cue").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelector(btn.dataset.next)?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle("visible",entry.isIntersecting));
  },{threshold:.24});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  // Light swipe auto-snap
  const pages=[...document.querySelectorAll(".page")];
  let sy=0,sx=0,st=0,locked=false;
  const nearest=()=>{
    const c=window.scrollY+innerHeight/2;
    let bi=0,bd=Infinity;
    pages.forEach((p,i)=>{const d=Math.abs(p.offsetTop+p.offsetHeight/2-c);if(d<bd){bd=d;bi=i;}});
    return bi;
  };
  const snap=i=>{
    if(locked||!pages.length)return;
    i=Math.max(0,Math.min(pages.length-1,i));
    locked=true;
    pages[i].scrollIntoView({behavior:"smooth",block:"start"});
    setTimeout(()=>locked=false,650);
  };

  document.addEventListener("touchstart",e=>{
    if(!e.touches?.length)return;
    sy=e.touches[0].clientY;sx=e.touches[0].clientX;st=Date.now();
  },{passive:true});

  document.addEventListener("touchend",e=>{
    if(document.body.classList.contains("intro-lock")||locked)return;
    const t=e.changedTouches?.[0];if(!t)return;
    const dy=sy-t.clientY,dx=sx-t.clientX,dt=Date.now()-st;
    if(Math.abs(dy)>26&&Math.abs(dy)>Math.abs(dx)*1.15&&dt<950){
      const i=nearest();snap(dy>0?i+1:i-1);
    }
  },{passive:true});

  document.getElementById("shareButton")?.addEventListener("click",async()=>{
    const data={
      title:"लाड परिवार | श्री गणेशोत्सव २०२६",
      text:"लाड परिवाराकडून श्री गणेशोत्सवाचे सस्नेह निमंत्रण. बाप्पाच्या दर्शनासाठी आपण सहकुटुंब आवर्जून यावे.",
      url:location.href
    };
    try{
      if(navigator.share) await navigator.share(data);
      else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);alert("निमंत्रणाची लिंक कॉपी झाली आहे.");}
    }catch(e){}
  });
});
