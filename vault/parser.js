const NOTES_JSON = './notes.json';
const main = document.getElementById('main');

async function loadNotes() {
  try {
    const res = await fetch(NOTES_JSON);
    if (!res.ok) throw new Error(`No se pudo cargar ${NOTES_JSON} (${res.status})`);
    const data = await res.json();
    return data.notes || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function renderNote(note, btn) {
  main.innerHTML = '<p class="text-muted mt-20">Cargando...</p>';
  console.log(`Cargando nota: ${note.title} (${note.content})`);
  try {
    const res = await fetch(note.content);
    if (!res.ok) throw new Error(`No se pudo cargar ${note.content} (${res.status})`);
    const mdText = await res.text();
    const htmlContent = marked.parse(mdText);

    rebuildNav([{ href: '#', text: 'Vault', id: 'back-to-vault' }]);

    main.innerHTML = `
      <div class="mt-20 text-muted text-sm">${note.date}</div>
      <article class="markdown-body">${htmlContent}</article>
    `;

    main.scrollTop = 0;
    document.getElementById('back-to-vault').addEventListener('click', async (e) => {
      e.preventDefault();
      await unRenderNote();
    });

  } catch (err) {
    main.innerHTML = `
      <div class="mt-20 text-accent-dim">
        <strong class="text-white">No se pudo cargar el archivo</strong><br>
        ${err.message}
      </div>`;
  }
}

async function unRenderNote() {
  rebuildNav();
  main.innerHTML = `
    <section id="vault" class="py-24">
      <div class="max-w-[860px] mx-auto">
        <p class="text-xs tracking-widest uppercase text-muted font-space mb-3">Vault</p>
        <h2 class="font-space text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.03em] leading-tight mb-14">Apuntes y recursos</h2>
        <div class="grid gap-5"></div>
      </div>
    </section>
  `;
  await init();
}

async function init() {
  const notes = await loadNotes();
  if (!notes.length) return;

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'project-card bg-surface border border-border rounded-[10px] p-5 text-inherit transition-all duration-200 hover:border-muted hover:-translate-y-1 cursor-none';
    div.innerHTML = `
      <h3 class="font-space text-white font-semibold text-lg mb-1">${note.title}</h3>
      <p class="text-muted text-sm">${note.date}</p>
    `;
    div.addEventListener('click', () => renderNote(note));
    document.querySelector('.grid.gap-5').appendChild(div);
  });
}
init();
