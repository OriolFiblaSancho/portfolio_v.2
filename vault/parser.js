const NOTES_JSON = './notes.json';

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

    const main = document.getElementById('main');
    main.innerHTML = '<p class="loading">Cargando...</p>';
    console.log(`Cargando nota: ${note.title} (${note.content})`);
    try {
        const res = await fetch(note.content);
        if (!res.ok) throw new Error(`No se pudo cargar ${note.content} (${res.status})`);
        const mdText = await res.text();
        const htmlContent = marked.parse(mdText);

        main.innerHTML = `
        <div class="note-meta">
          <span>${note.date}</span> · <span>${note.content}</span>
        </div>
        <article class="markdown-body">${htmlContent}</article>
      `;

        main.scrollTop = 0;
    } catch (err) {
        main.innerHTML = `
        <div class="error-msg">
          <strong>No se pudo cargar el archivo</strong><br>
          ${err.message}
        </div>`;
    }
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