async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    const data = await res.json();
    const projects_grid = document.querySelector(".projects-grid");
    if (!projects_grid) return;

    data.projects.forEach((project) => {
      const projectCard = document.createElement('a');
      projectCard.href = project.url || '#';
      projectCard.className = 'project-card reveal group bg-black border border-border rounded-[10px] p-8 grid grid-cols-[1fr_auto] gap-4 items-start text-inherit no-underline transition-all duration-200 hover:border-muted hover:-translate-y-1';

      const mainContent = document.createElement('div');

      const projectHeader = document.createElement('div');
      projectHeader.className = 'flex items-center gap-3 mb-3';

      const projectDot = document.createElement('div');
      projectDot.className = 'w-2 h-2 rounded-full bg-white shrink-0';

      const projectName = document.createElement('span');
      projectName.className = 'font-space text-lg font-semibold tracking-[-0.01em]';
      projectName.textContent = project.name;
      projectHeader.appendChild(projectDot);
      projectHeader.appendChild(projectName);

      const projectDate = document.createElement('span');
      projectDate.className = 'text-muted';
      projectDate.textContent = project.date;
      projectHeader.appendChild(projectDate);

      const projectDesc = document.createElement('p');
      projectDesc.className = 'text-muted text-sm leading-relaxed mb-5';
      projectDesc.textContent = project.description;

      const projectStack = document.createElement('div');
      projectStack.className = 'flex flex-wrap gap-1';

      if (project.stack && Array.isArray(project.stack)) {
        project.stack.forEach(tech => {
          const stackTag = document.createElement('span');
          stackTag.className = 'text-xs font-space text-muted bg-white/5 border border-border px-[0.6rem] py-[0.2rem] rounded-full';
          stackTag.textContent = tech;
          projectStack.appendChild(stackTag);
        });
      }

      mainContent.appendChild(projectHeader);
      mainContent.appendChild(projectDesc);
      mainContent.appendChild(projectStack);

      const projectArrow = document.createElement('span');
      projectArrow.className = 'text-faint group-hover:text-white transition-colors duration-200';
      projectArrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`;

      projectCard.appendChild(mainContent);
      projectCard.appendChild(projectArrow);

      projects_grid.appendChild(projectCard);
    });

    document.querySelectorAll('.reveal').forEach(el => __revealObserver.observe(el));

  } catch (error) {
    console.error("Error al cargar el JSON:", error);
    document.querySelectorAll('.reveal').forEach(el => __revealObserver.observe(el));
  }
}

loadProjects();

const copyEmailBtn = document.getElementById('copyEmail');

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'oriolfibla06@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = '✓ Copiado';
      copyEmailBtn.style.background = '#2a2a2a';
      copyEmailBtn.style.color = '#fff';
      setTimeout(() => {
        copyEmailBtn.textContent = email;
        copyEmailBtn.style.background = '';
        copyEmailBtn.style.color = '';
      }, 2000);
    } catch {
      window.prompt('Copia este email:', email);
    }
  });
}

function loadQuote() {
  fetch('sentences.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.sentences.length);
      const quote = data.sentences[randomIndex];
      document.getElementById('quoteSentence').textContent = quote.sentence;
      document.getElementById('quoteAuthor').textContent = quote.author;
      document.getElementById('quoteSource').textContent = quote.source;
    })
    .catch(error => console.error("Error al cargar la cita:", error));
}
loadQuote();
