async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    const data = await res.json();
    const projects_grid = document.querySelector(".projects-grid");
    if (!projects_grid) return;

    /* Bento grid: 3 cols en desktop, 1 col en mobile */
    projects_grid.className = 'grid gap-5 projects-grid grid-cols-1 sm:grid-cols-3';

    /* Layout fijo por índice: portalcliente featured, fleetly half, homelab+otros squares apilados */
    const bentoConfigs = [
      { cols: 'sm:col-span-3 sm:row-span-2', compact: false, minimal: false, pad: '', mediaBelow: false },
      { cols: 'sm:col-span-2 sm:row-span-2', compact: true, minimal: false, pad: '', mediaBelow: true },
      { cols: 'sm:col-span-1', compact: false, minimal: true },
      { cols: 'sm:col-span-1', compact: false, minimal: true },
    ];

    data.projects.forEach((project, i) => {
      const cfg = bentoConfigs[i] || bentoConfigs[0];
      const card = document.createElement('a');
      card.href = project.url || '#';
      card.className = `project-card reveal group bg-black border border-border rounded-[10px] text-inherit no-underline transition-all duration-200 ${cfg.cols}`;

      /* Cards pequeñas (Home Lab, Otros): solo nombre + indicador */
      if (cfg.minimal) {
        card.className += ' flex flex-col items-center justify-center text-center gap-2 p-10';
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 rounded-full bg-white';
        const name = document.createElement('span');
        name.className = 'font-space text-sm font-semibold tracking-[-0.01em]';
        name.textContent = project.name;
        card.append(dot, name);
        if (project.date) {
          const date = document.createElement('span');
          date.className = 'text-muted text-[10px]';
          date.textContent = project.date;
          card.appendChild(date);
        }
      /* Cards grandes (Portal Cliente, Fleetly): contenido completo */
      } else {
        const hasMedia = project.media && Array.isArray(project.media) && project.media.length > 0;

        /* Layout vertical con media abajo (Fleetly) */
        if (hasMedia && cfg.mediaBelow) {
          card.className += ` ${cfg.pad || 'p-10'} flex flex-col gap-4`;

          const topRow = document.createElement('div');
          topRow.className = 'grid grid-cols-[1fr_auto] items-start gap-3';

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

          topRow.appendChild(mainContent);
          topRow.appendChild(projectArrow);
          card.appendChild(topRow);

          const wrapper = document.createElement('div');
          wrapper.className = 'rounded-[8px] overflow-hidden border border-border';
          const video = document.createElement('video');
          video.src = project.media[0];
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.className = 'w-full h-auto block';
          wrapper.appendChild(video);
          card.appendChild(wrapper);

        } else {
          card.className += ` ${cfg.pad || 'p-10'} grid items-start ${cfg.compact ? 'gap-3' : 'gap-5'} ${hasMedia ? 'grid-cols-[1fr_1.5fr]' : 'grid-cols-[1fr_auto]'}`;

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

          card.appendChild(mainContent);

          if (hasMedia) {
            const mediaCol = document.createElement('div');
            mediaCol.className = 'flex items-start h-full';
            const wrapper = document.createElement('div');
            wrapper.className = 'rounded-[8px] overflow-hidden border border-border w-full';
            const video = document.createElement('video');
            video.src = project.media[0];
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.className = 'w-full h-auto block';
            wrapper.appendChild(video);
            mediaCol.appendChild(wrapper);
            card.appendChild(mediaCol);
          } else {
            card.appendChild(projectArrow);
          }
        }
      }

      projects_grid.appendChild(card);
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
