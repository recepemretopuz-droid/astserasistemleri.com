/* =========================================================
   Topuz Sera & Yapı - Basit etkileşimler
   Dosya: assets/js/main.js
   ========================================================= */

(function(){
  // nav active
  try{
    const current = (location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
    document.querySelectorAll('.nav-links a[href]').forEach(a => {
      const hrefRaw = a.getAttribute('href') || '';
      const href = hrefRaw.split('?')[0].split('#')[0];
      if(!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) return;

      if(href === current){
        a.classList.add('active');
        a.setAttribute('aria-current','page');
      }else{
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }
    });
  }catch(e){}

  // Tema: koyu mod iptal (sadece aydınlık tema)
  // Daha önceki koyu mod denemeleri mobilde okunabilirliği bozduğu için kaldırıldı.
  // Bu yüzden data-theme hiçbir zaman "dark" olarak set edilmez.
  document.documentElement.removeAttribute('data-theme');


  const header = document.querySelector('header.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const toTop = document.querySelector('[data-to-top]');

  if(toggle && header){
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Scroll-to-top
  const onScroll = () => {
    if(!toTop) return;
    if(window.scrollY > 500) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if(toTop){
    toTop.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }


  // Carousel (kayar galeri)
  try{
    document.querySelectorAll('.carousel').forEach(car => {
      const track = car.querySelector('[data-carousel]');
      const prev = car.querySelector('.car-btn.prev');
      const next = car.querySelector('.car-btn.next');
      if(!track) return;

      const scrollByAmount = () => Math.max(240, Math.floor(track.clientWidth * 0.85));

      const go = (dir) => {
        track.scrollBy({ left: dir * scrollByAmount(), behavior: 'smooth' });
      };

      if(prev) prev.addEventListener('click', () => go(-1));
      if(next) next.addEventListener('click', () => go(1));

      // Mouse drag / touch drag (desktop)
      let isDown = false, startX = 0, startScroll = 0;
      track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX;
        startScroll = track.scrollLeft;
        track.classList.add('dragging');
      });
      window.addEventListener('mouseup', () => {
        isDown = false;
        track.classList.remove('dragging');
      });
      window.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        const dx = e.pageX - startX;
        track.scrollLeft = startScroll - dx;
      }, { passive: true });
    });
  }catch(e){}

  
  // Slider (tek görsel görünür) - Ürünler sayfası
  try{
    document.querySelectorAll('[data-slider]').forEach(sl => {
      const track = sl.querySelector('.s-track');
      const slides = Array.from(sl.querySelectorAll('.s-slide'));
      const prev = sl.querySelector('.s-btn.prev');
      const next = sl.querySelector('.s-btn.next');
      const dotsWrap = sl.querySelector('.s-dots');
      if(!track || slides.length <= 1) return;

      let index = 0;

      const buildDots = () => {
        if(!dotsWrap) return;
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 's-dot' + (i === 0 ? ' active' : '');
          b.setAttribute('aria-label', (i+1) + '. görsel');
          b.addEventListener('click', () => go(i));
          dotsWrap.appendChild(b);
        });
      };

      const setActiveDot = () => {
        if(!dotsWrap) return;
        dotsWrap.querySelectorAll('.s-dot').forEach((d,i) => d.classList.toggle('active', i === index));
      };

      const go = (i) => {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        setActiveDot();
      };

      if(prev) prev.addEventListener('click', () => go(index - 1));
      if(next) next.addEventListener('click', () => go(index + 1));

      // Swipe (touch)
      let sx = 0, sy = 0, moved = false;
      const onStart = (e) => {
        const t = e.touches ? e.touches[0] : e;
        sx = t.clientX; sy = t.clientY; moved = false;
      };
      const onMove = (e) => {
        if(!e.touches) return;
        const t = e.touches[0];
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        if(Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) moved = true;
      };
      const onEnd = (e) => {
        if(!e.changedTouches) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        if(Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return;
        if(dx < 0) go(index + 1);
        else go(index - 1);
      };

      sl.addEventListener('touchstart', onStart, {passive:true});
      sl.addEventListener('touchmove', onMove, {passive:true});
      sl.addEventListener('touchend', onEnd, {passive:true});

      buildDots();
      go(0);
    });
  }catch(e){}

// Lightbox for gallery (ESC / tıklama / swipe / ok tuşları)
  const lbNodes = Array.from(document.querySelectorAll('[data-lightbox], [data-src]'))
    .filter(el => (el.getAttribute('data-lightbox') || el.getAttribute('data-src') || el.getAttribute('href')));

  if(lbNodes.length){
    // normalize items list
    const items = lbNodes.map(el => {
      const src = el.getAttribute('data-lightbox') || el.getAttribute('data-src') || el.getAttribute('href') || '';
      const caption = el.getAttribute('data-caption') || el.getAttribute('aria-label') || '';
      return { el, src, caption };
    }).filter(it => it.src);

    // build overlay
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.tabIndex = -1;
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'none';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.style.background = 'rgba(0,0,0,.72)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.zIndex = '9999';

    const frame = document.createElement('div');
    frame.className = 'lb-frame';
    frame.style.maxWidth = '1040px';
    frame.style.width = '100%';
    frame.style.borderRadius = '18px';
    frame.style.overflow = 'hidden';
    frame.style.border = '1px solid rgba(255,255,255,.18)';
    frame.style.background = 'rgba(10,14,28,.96)';
    frame.style.boxShadow = '0 30px 90px rgba(0,0,0,.45)';

    const img = document.createElement('img');
    img.alt = '';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.touchAction = 'pan-y';

    const bar = document.createElement('div');
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.justifyContent = 'space-between';
    bar.style.gap = '12px';
    bar.style.padding = '12px 14px';
    bar.style.borderTop = '1px solid rgba(255,255,255,.12)';
    bar.style.color = 'rgba(255,255,255,.86)';

    const captionEl = document.createElement('div');
    captionEl.style.fontSize = '13px';
    captionEl.style.lineHeight = '1.3';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.alignItems = 'center';
    controls.style.gap = '10px';

    const btnBase = (text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      b.style.cursor = 'pointer';
      b.style.border = '1px solid rgba(255,255,255,.18)';
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.color = 'rgba(255,255,255,.92)';
      b.style.borderRadius = '999px';
      b.style.padding = '10px 12px';
      b.style.fontWeight = '600';
      return b;
    };

    const prevBtn = btnBase('←');
    prevBtn.setAttribute('aria-label','Önceki');
    const nextBtn = btnBase('→');
    nextBtn.setAttribute('aria-label','Sonraki');
    const closeBtn = btnBase('Kapat');
    closeBtn.setAttribute('aria-label','Kapat (ESC)');

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(closeBtn);

    bar.appendChild(captionEl);
    bar.appendChild(controls);

    frame.appendChild(img);
    frame.appendChild(bar);
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    let currentIndex = 0;
    let lastFocus = null;

    const isOpen = () => overlay.style.display !== 'none';

    const render = () => {
      const it = items[currentIndex];
      img.src = it.src;
      captionEl.textContent = it.caption || 'Proje Fotoğrafı';
      prevBtn.disabled = (items.length <= 1);
      nextBtn.disabled = (items.length <= 1);
    };

    const openAt = (index, focusEl) => {
      currentIndex = (index + items.length) % items.length;
      lastFocus = focusEl || null;
      render();
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // focus overlay for reliable ESC on some browsers
      try{ overlay.focus(); }catch(e){}
      closeBtn.focus();
    };

    const close = () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      if(lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    const next = () => { currentIndex = (currentIndex + 1) % items.length; render(); };
    const prev = () => { currentIndex = (currentIndex - 1 + items.length) % items.length; render(); };

    // bind
    items.forEach((it, idx) => {
      const el = it.el;

      // click
      el.addEventListener('click', (e) => {
        // stop link navigation
        if(el.tagName && el.tagName.toLowerCase() === 'a') e.preventDefault();
        openAt(idx, el);
      });

      // keyboard open
      el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          el.click();
        }
      });

      // accessibility
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
      if(!el.getAttribute('role')) el.setAttribute('role','button');
      if(!el.getAttribute('aria-label')) el.setAttribute('aria-label','Görseli büyüt');
      el.style.cursor = 'zoom-in';
    });

    // overlay close
    overlay.addEventListener('click', (e) => {
      if(e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    // ESC + arrows (robust)
    const onKey = (e) => {
      if(!isOpen()) return;
      const k = e.key;
      if(k === 'Escape' || k === 'Esc') { e.preventDefault(); close(); }
      if(k === 'ArrowRight') { e.preventDefault(); next(); }
      if(k === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('keydown', onKey, true);

    // mobile swipe
    let touchX = null;
    img.addEventListener('touchstart', (e) => {
      if(!e.touches || !e.touches.length) return;
      touchX = e.touches[0].clientX;
    }, { passive: true });

    img.addEventListener('touchend', (e) => {
      if(touchX == null) return;
      const endX = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0].clientX : null;
      if(endX == null) { touchX = null; return; }
      const dx = endX - touchX;
      touchX = null;
      if(Math.abs(dx) > 45){
        if(dx < 0) next(); else prev();
      }
    }, { passive: true });
  }
})();

/* Hero background slider (auto-rotates) */
(function(){
  const slides = Array.from(document.querySelectorAll('.hero-bg .hero-slide'));
  if(!slides.length) return;
  let i = slides.findIndex(s => s.classList.contains('is-active'));
  if(i < 0) i = 0;

  function show(next){
    slides[i].classList.remove('is-active');
    i = (next + slides.length) % slides.length;
    slides[i].classList.add('is-active');
  }

  let t = window.setInterval(()=> show(i+1), 6500);

  // Pause on hover (desktop)
  const hero = document.querySelector('.hero');
  if(hero){
    hero.addEventListener('mouseenter', ()=> { clearInterval(t); t = null; }, { passive: true });
    hero.addEventListener('mouseleave', ()=> {
      if(t) return;
      t = window.setInterval(()=> show(i+1), 6500);
    }, { passive: true });
  }
})();

/* TPZ featured slider (iOS-safe)
   - Uses an auto-width flex track (no "500%" track that causes page drift)
   - translateX(-N * 100%)
   - Swipe on mobile, arrows on desktop
*/
(function(){
  const root = document.querySelector('[data-tpz-slider]');
  if(!root) return;

  const viewport = root.querySelector('.tpz-viewport');
  const track = root.querySelector('.tpz-track');
  const slides = Array.from(root.querySelectorAll('.tpz-slide'));
  const dotsWrap = root.querySelector('.tpz-dots');

  if(!viewport || !track || slides.length === 0) return;

  let idx = 0;
  let timer = null;
  const AUTOPLAY_MS = 5200;

  function render(){
    if(idx < 0) idx = slides.length - 1;
    if(idx >= slides.length) idx = 0;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';

    if(dotsWrap){
      dotsWrap.querySelectorAll('button').forEach((b,i)=>{
        const active = i === idx;
        b.classList.toggle('active', active);
        b.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }
  }

  function stopAuto(){
    if(timer){ window.clearInterval(timer); timer = null; }
  }
  function startAuto(){
    stopAuto();
    timer = window.setInterval(()=>{ idx += 1; render(); }, AUTOPLAY_MS);
  }

  // Build dots
  if(dotsWrap){
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      if(i === 0) b.classList.add('active');
      b.setAttribute('aria-label', 'Proje ' + (i+1));
      b.addEventListener('click', () => { idx = i; render(); startAuto(); });
      dotsWrap.appendChild(b);
    });
  }

  // Prev/Next
  const prev = root.querySelector('[data-tpz-prev]');
  const next = root.querySelector('[data-tpz-next]');
  if(prev) prev.addEventListener('click', ()=>{ idx -= 1; render(); startAuto(); });
  if(next) next.addEventListener('click', ()=>{ idx += 1; render(); startAuto(); });

  // Pause on hover / touch
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  root.addEventListener('touchstart', stopAuto, {passive:true});
  root.addEventListener('touchend', startAuto, {passive:true});

  // Swipe
  let x0 = null;
  viewport.addEventListener('touchstart', (e)=>{ x0 = e.touches?.[0]?.clientX ?? null; }, {passive:true});
  viewport.addEventListener('touchmove', (e)=>{
    if(x0 == null) return;
    const x1 = e.touches?.[0]?.clientX ?? null;
    if(x1 == null) return;
    const dx = x1 - x0;
    if(Math.abs(dx) > 40){
      idx += (dx < 0) ? 1 : -1;
      x0 = null;
      render();
      startAuto();
    }
  }, {passive:true});
  viewport.addEventListener('touchend', ()=>{ x0 = null; }, {passive:true});

  // Safety: ensure we don't cause horizontal scroll on iOS
  viewport.style.overflow = 'hidden';

  render();
  startAuto();
})();


/* Premium reveal on scroll */
(function(){
  const els = document.querySelectorAll('.card, .product-card, .gallery-item, .section-head');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
