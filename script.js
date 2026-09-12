document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const seal = document.getElementById("sealButton");
  let locked = false;

  function openInvite(){
    if(!opening || opening.classList.contains("opened")) return;

    locked = true;

    // Before the doors open, park the document on the real cover page.
    const coverPage = document.getElementById("p0");
    window.scrollTo({top:0,left:0,behavior:"auto"});
    if(coverPage){
      coverPage.scrollIntoView({behavior:"auto",block:"start"});
    }

    opening.classList.add("opened");

    // Unlock page scrolling only after the door animation has started.
    setTimeout(()=>{
      document.body.classList.remove("locked");
      window.scrollTo({top:0,left:0,behavior:"auto"});
      if(coverPage){
        coverPage.scrollIntoView({behavior:"auto",block:"start"});
      }
    }, 520);

    // Do not allow the opening tap to trigger automatic page snapping.
    setTimeout(()=>{
      locked = false;
    }, 1650);
  }

  seal?.addEventListener("click", openInvite);

  document.querySelectorAll(".next").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelector(btn.dataset.next)?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle("visible",entry.isIntersecting));
  },{threshold:.22});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  const pages=[...document.querySelectorAll(".page")];
  let sy=0,sx=0,st=0;

  function nearest(){
    const center=scrollY+innerHeight/2;
    let idx=0,dist=Infinity;
    pages.forEach((p,i)=>{
      const d=Math.abs((p.offsetTop+p.offsetHeight/2)-center);
      if(d<dist){dist=d;idx=i;}
    });
    return idx;
  }

  function snapTo(i){
    if(locked||!pages.length)return;
    i=Math.max(0,Math.min(pages.length-1,i));
    locked=true;
    pages[i].scrollIntoView({behavior:"smooth",block:"start"});
    setTimeout(()=>locked=false,620);
  }

  document.addEventListener("touchstart",e=>{
    if(!e.touches?.length)return;
    sy=e.touches[0].clientY;
    sx=e.touches[0].clientX;
    st=Date.now();
  },{passive:true});

  document.addEventListener("touchend",e=>{
    if(document.body.classList.contains("locked")||locked)return;
    const t=e.changedTouches?.[0]; if(!t)return;
    const dy=sy-t.clientY, dx=sx-t.clientX, dt=Date.now()-st;
    if(Math.abs(dy)>=25 && Math.abs(dy)>Math.abs(dx)*1.15 && dt<950){
      const i=nearest();
      snapTo(dy>0?i+1:i-1);
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
      else if(navigator.clipboard){
        await navigator.clipboard.writeText(location.href);
        alert("निमंत्रणाची लिंक कॉपी झाली आहे.");
      }
    }catch(e){}
  });
});
