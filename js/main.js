// Tenta carregar links de data/links.json — se existir, substitui os links estáticos
async function loadLinks(){
  try{
    const res = await fetch('data/links.json');
    if(!res.ok) return;
    const links = await res.json();
    const container = document.getElementById('links');
    container.innerHTML = '';
    links.forEach(l=>{
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      a.className = 'btn';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      container.appendChild(a);
    });
  }catch(e){console.debug('Nenhum data/links.json encontrado ou erro ao carregar', e)}
}

// Tema simples com localStorage
function applyTheme(t){
  document.documentElement.classList.toggle('dark', t==='dark');
  localStorage.setItem('theme', t);
}
document.getElementById('themeToggle')?.addEventListener('click', ()=>{
  const cur = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
  applyTheme(cur);
});

// Inicialização
(function(){
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  loadLinks();
})();
