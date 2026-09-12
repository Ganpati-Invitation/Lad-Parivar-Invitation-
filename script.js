document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const sealButton = document.getElementById("sealButton");
  const cover = document.getElementById("cover");

  function openInvitation(){
    if(!opening || opening.classList.contains("opened")) return;

    // Never move the document to another invitation page.
    window.scrollTo({top:0,left:0,behavior:"auto"});
    opening.classList.add("opened");

    // Only unlock vertical scrolling. The cover stays at scroll position 0.
    setTimeout(()=>{
      document.body.classList.remove("locked");
      window.scrollTo({top:0,left:0,behavior:"auto"});
    }, 450);
  }

  sealButton?.addEventListener("click", openInvitation);

  document.querySelectorAll(".scroll-button").forEach(button=>{
    button.addEventListener("click",()=>{
      document.querySelector(button.dataset.target)?.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add("visible");
    });
  },{threshold:.18});

  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  document.getElementById("shareButton")?.addEventListener("click",async()=>{
    const shareData={
      title:"लाड परिवार | श्री गणेशोत्सव २०२६",
      text:"लाड परिवाराकडून श्री गणेशोत्सवाचे सस्नेह निमंत्रण. आपण सहकुटुंब बाप्पाच्या दर्शनासाठी आवर्जून यावे.",
      url:window.location.href
    };

    try{
      if(navigator.share){
        await navigator.share(shareData);
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(window.location.href);
        alert("निमंत्रणाची लिंक कॉपी झाली आहे.");
      }
    }catch(e){}
  });
});
