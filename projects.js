/* =========================================================
   Proje filtreleme (Projeler sayfası)
   ========================================================= */
(function(){
  const filters = document.getElementById('project-filters');
  const grid = document.getElementById('project-grid');
  if(!filters || !grid) return;

  const buttons = Array.from(filters.querySelectorAll('[data-filter]'));
  const items = Array.from(grid.querySelectorAll('[data-cat]'));

  function setActive(name){
    buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === name));
    items.forEach(it => {
      const cat = it.getAttribute('data-cat') || '';
      const show = (name === 'Tümü') || (cat === name);
      it.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.getAttribute('data-filter')));
  });

  setActive('Tümü');
})();