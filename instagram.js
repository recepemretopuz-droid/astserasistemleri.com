/* =========================================================
   Instagram embed listeleyici (statik site için)
   Dosya: assets/js/instagram.js

   Kullanım:
   - data/instagram.json dosyasına gönderi linklerini ekleyin.
   - Sayfa, linkleri kategori bazlı filtreleyerek embed eder.
   ========================================================= */

(function(){
  const filtersEl = document.getElementById('ig-filters');
  const itemsEl = document.getElementById('ig-items');

  if(!filtersEl || !itemsEl) return;

  const DATA_URL = 'data/instagram.json';
  let allItems = [];
  let categories = [];
  let active = 'Tümü';

  function uniq(arr){
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function processEmbeds(){
    // Instagram embed script yüklüyse içerikleri işler
    try{
      if(window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function'){
        window.instgrm.Embeds.process();
      }
    }catch(e){}
  }

  function setActive(cat){
    active = cat;
    document.querySelectorAll('[data-ig-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-ig-filter') === cat);
    });
    render();
  }

  function buildFilters(){
    filtersEl.innerHTML = '';

    const btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'filter-btn active';
    btnAll.textContent = 'Tümü';
    btnAll.setAttribute('data-ig-filter', 'Tümü');
    btnAll.addEventListener('click', () => setActive('Tümü'));
    filtersEl.appendChild(btnAll);

    categories.forEach(cat => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'filter-btn';
      b.textContent = cat;
      b.setAttribute('data-ig-filter', cat);
      b.addEventListener('click', () => setActive(cat));
      filtersEl.appendChild(b);
    });
  }

  function makeEmptyState(message){
    itemsEl.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'ig-empty';
    box.innerHTML = `
      <strong>Gösterilecek içerik yok.</strong>
      <div style="height:6px"></div>
      <div class="ig-empty-text">${message}</div>
    `;
    itemsEl.appendChild(box);
  }

  function render(){
    itemsEl.innerHTML = '';

    const list = (active === 'Tümü')
      ? allItems
      : allItems.filter(x => (x.category || '').trim() === active);

    if(!list.length){
      makeEmptyState('Instagram gönderi linklerini <code>data/instagram.json</code> dosyasına ekleyin (kategori + permalink).');
      return;
    }

    list.forEach(item => {
      const wrap = document.createElement('div');
      wrap.className = 'ig-card';

      const permalink = (item.permalink || '').trim();
      const cat = (item.category || '').trim() || 'Diğer';
      const title = (item.title || '').trim();

      // Embed bloğu
      const block = document.createElement('blockquote');
      block.className = 'instagram-media';
      block.setAttribute('data-instgrm-permalink', permalink);
      block.setAttribute('data-instgrm-version', '14');

      // Instagram embed script, içte bir link bulunmasını önerir
      const a = document.createElement('a');
      a.href = permalink || '#';
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Instagram içeriğini görüntüle';
      block.appendChild(a);

      const meta = document.createElement('div');
      meta.className = 'ig-meta';
      meta.innerHTML = `
        <div><strong>${escapeHtml(cat)}</strong>${title ? ` • ${escapeHtml(title)}` : ''}</div>
        <div style="margin-top:4px"><a href="${escapeAttr(permalink)}" target="_blank" rel="noopener">Gönderiyi Instagram&apos;da aç</a></div>
      `;

      wrap.appendChild(block);
      wrap.appendChild(meta);
      itemsEl.appendChild(wrap);
    });

    // Embed script sonradan yüklendiyse diye birkaç kez dene
    processEmbeds();
    window.setTimeout(processEmbeds, 400);
    window.setTimeout(processEmbeds, 1200);
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  }
  function escapeAttr(str){
    return escapeHtml(str).replaceAll('`','&#96;');
  }

  fetch(DATA_URL, { cache: 'no-store' })
    .then(r => {
      if(!r.ok) throw new Error('JSON okunamadı');
      return r.json();
    })
    .then(data => {
      allItems = Array.isArray(data.items) ? data.items : [];
      const catsFromItems = uniq(allItems.map(x => (x.category || '').trim()).filter(Boolean));
      categories = Array.isArray(data.categories) && data.categories.length ? data.categories : catsFromItems;

      // Boş/yanlış permalinkleri süz
      allItems = allItems.filter(x => typeof x.permalink === 'string' && x.permalink.trim().startsWith('http'));

      buildFilters();

      if(!allItems.length){
        makeEmptyState('Henüz link eklenmedi. <code>data/instagram.json</code> dosyasına gönderi linklerini ekledikten sonra sayfayı yenileyin.');
        return;
      }

      render();
    })
    .catch(() => {
      makeEmptyState('Bu sayfa çalışmak için <code>data/instagram.json</code> dosyasına ihtiyaç duyar. Hosting&apos;de yayınladıktan sonra tekrar deneyin.');
    });
})();
