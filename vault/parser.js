const NOTES_JSON = './notes.json';
const main = document.getElementById('main');
const nav = document.getElementById('navbar');

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
    main.innerHTML = '<p class="loading">Cargando...</p>';
    console.log(`Cargando nota: ${note.title} (${note.content})`);
    try {
        const res = await fetch(note.content);
        if (!res.ok) throw new Error(`No se pudo cargar ${note.content} (${res.status})`);
        const mdText = await res.text();
        const htmlContent = marked.parse(mdText);

        nav.innerHTML = `
            <a href="../index.html#hero" class="nav-logo">
                <img src="../assets/lambda.svg" alt="Lambda">
            </a>
            <ul class="nav-links">
                <li><a href="../index.html">Volver</a></li>
                <li><a href="#" id="back-to-vault">Vault</a></li>
            </ul>
        `;

        main.innerHTML = `
        <div class="note-meta" style="margin-top: 5rem;">
          <span>${note.date}</span>
        </div>
        <article class="markdown-body">${htmlContent}</article>
      `;

        main.scrollTop = 0;
        document.getElementById('back-to-vault').addEventListener('click', async (e) => {
            e.preventDefault();
            await unRenderNote();
        });

    } catch (err) {
        main.innerHTML = `
        <div class="error-msg">
          <strong>No se pudo cargar el archivo</strong><br>
          ${err.message}
        </div>`;
    }
}

async function unRenderNote() {
    nav.innerHTML = `
        <a href="../index.html#hero" class="nav-logo">
            <img src="../assets/lambda.svg" alt="Lambda">
        </a>
        <ul class="nav-links">
            <li><a href="../index.html">Volver</a></li>
        </ul>
    `;
    main.innerHTML = `
        <section id="vault">
            <div class="container">
                <p class="section-label">Vault</p>
                <h2 class="section-title">Apuntes y recursos</h2>
                <div class="projects-grid"></div>
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
        div.classList.add('project-card');
        div.innerHTML = `
            <h3 class="project-title">${note.title}</h3>
            <p class="project-date">${note.date}</p>
        `;
        div.addEventListener('click', () => renderNote(note));
        document.querySelector('.projects-grid').appendChild(div);
    });
}
init();