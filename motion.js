(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = new WeakSet();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(({isIntersecting, target}) => {
      if (!isIntersecting) return;
      target.classList.add('motion-visible');
      observer.unobserve(target);
    });
  }, {threshold:0.06, rootMargin:'0px 0px -24px 0px'}) : null;
  window.observeMotion = elements => elements.forEach((el, i) => {
    if (seen.has(el) || !observer) return;
    seen.add(el);
    el.style.setProperty('--reveal-delay', (i % 4) * 75 + 'ms');
    el.classList.add('motion-ready');
    observer.observe(el);
  });
  window.observeMotion(document.querySelectorAll('.section-heading,.personalize,.product-summary,.order'));
  const intro = document.querySelector('.intro');
  if (!intro) return;
  let timeout;
  async function playIntro() {
    clearTimeout(timeout);
    intro.getAnimations().forEach(a => a.cancel());
    const logo = intro.querySelector('img');
    logo.getAnimations().forEach(a => a.cancel());
    intro.hidden = false;
    intro.style.opacity = '1';
    intro.style.visibility = 'visible';
    await Promise.race([logo.decode?.().catch(()=>{}), new Promise(resolve=>setTimeout(resolve,250))]);
    if (!intro.animate) { timeout=setTimeout(()=>{intro.hidden=true},1400);return; }
    logo.animate(reduced ? [
      {opacity:0,offset:0},{opacity:1,offset:.2},{opacity:1,offset:.7},{opacity:0,offset:1}
    ] : [
      {opacity:0,transform:'translateY(14px) scale(.92)',offset:0},
      {opacity:1,transform:'translateY(0) scale(1)',offset:.2},
      {opacity:1,transform:'translateY(0) scale(1)',offset:.58},
      {opacity:0,transform:'translateY(-42vh) scale(.48)',offset:1}
    ], {duration:1600,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    intro.animate([{opacity:1},{opacity:0}],{delay:1250,duration:400,fill:'forwards'});
    timeout=setTimeout(()=>{intro.hidden=true},1700);
  }
  playIntro();
  document.querySelectorAll('a[href="#home"]').forEach(a=>a.addEventListener('click',playIntro));
  window.addEventListener('pageshow',e=>{if(e.persisted)playIntro()});
})();
