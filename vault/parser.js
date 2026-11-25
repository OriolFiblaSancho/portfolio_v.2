// Vault: lists notes from notes.json and renders the one in the URL hash (vault.html#slug).
const main = document.getElementById('main');
const back = document.getElementById('back');
const listHTML = main.innerHTML;
let notes = [];

async function show() {
  const note = notes.find(n => n.slug === location.hash.slice(1));
  if (!note) {
    main.innerHTML = listHTML;
    back.href = '../index.html#vault';
    back.textContent = 'inicio';
    document.title = 'Vault · Oriol Fibla';
    document.getElementById('list').innerHTML = notes.map(n =>
      `<li><a href="#${n.slug}">${n.title}</a><span class="meta">${n.date}</span></li>`).join('');
    return;
  }
  back.href = '#';
  back.textContent = 'vault';
  document.title = `${note.title} · Oriol Fibla`;
  try {
    const res = await fetch(note.content);
    if (!res.ok) throw new Error(`${res.status}`);
    main.innerHTML = `<div class="page-head"><p class="kicker">Vault · ${note.date}</p></div>
      <article class="prose">${marked.parse(await res.text())}</article>`;
  } catch (err) {
    main.innerHTML = `<div class="page-head"><h1>No se pudo cargar la nota</h1><p class="lead">${err.message}</p></div>`;
  }
  window.scrollTo(0, 0);
}

fetch('notes.json')
  .then(r => r.json())
  .then(data => { notes = data.notes || []; show(); })
  .catch(err => console.error('Error al cargar notes.json:', err));

window.addEventListener('hashchange', show);
document.getElementById('year').textContent = new Date().getFullYear();
