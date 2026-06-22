// ─── Año automático ───
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Listar proyectos en base a JSON ───
const projects_grid = document.querySelector(".projects-grid");

// Declaramos el observer aquí arriba para configurar cómo actúa
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Calculamos el delay usando los elementos reales que hay en el DOM en este momento
            const currentReveals = document.querySelectorAll('.reveal');
            const delay = Array.from(currentReveals).indexOf(entry.target) % 4 * 80;

            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        const data = await res.json();

        // Asegúrate de que tu JSON tiene la propiedad "projects" (ej: data.projects)
        data.projects.forEach((project) => {
            // 1. Crear el contenedor principal (el enlace <a>)
            const projectCard = document.createElement('a');
            projectCard.href = project.url || '#';
            projectCard.classList.add('project-card', 'reveal');

            // 2. Crear el div contenedor de la izquierda
            const mainContent = document.createElement('div');

            // 3. Crear el header del proyecto y sus hijos
            const projectHeader = document.createElement('div');
            projectHeader.classList.add('project-header');

            const projectDot = document.createElement('div');
            projectDot.classList.add('project-dot');

            const projectName = document.createElement('span');
            projectName.classList.add('project-name');
            projectName.textContent = project.name;
            projectHeader.appendChild(projectDot);
            projectHeader.appendChild(projectName);

            const projectDate = document.createElement('span');
            projectDate.classList.add('project-date');
            projectDate.textContent = project.date;
            projectHeader.appendChild(projectDate);

            // 4. Crear la descripción
            const projectDesc = document.createElement('p');
            projectDesc.classList.add('project-desc');
            projectDesc.textContent = project.description;

            // 5. Crear la sección del stack de tecnologías
            const projectStack = document.createElement('div');
            projectStack.classList.add('project-stack');

            // Bucle para añadir TODAS las tecnologías que tenga este proyecto en el JSON
            if (project.stack && Array.isArray(project.stack)) {
                project.stack.forEach(tech => {
                    const stackTag = document.createElement('span');
                    stackTag.classList.add('stack-tag');
                    stackTag.textContent = tech;
                    projectStack.appendChild(stackTag);
                });
            }

            // 6. Armar el bloque de contenido izquierdo
            mainContent.appendChild(projectHeader);
            mainContent.appendChild(projectDesc);
            mainContent.appendChild(projectStack);

            // 7. Crear la flecha derecha
            const projectArrow = document.createElement('span');
            projectArrow.classList.add('project-arrow');
            projectArrow.textContent = '↗';

            // 8. Unir todo dentro de la tarjeta principal
            projectCard.appendChild(mainContent);
            projectCard.appendChild(projectArrow);

            // 9. Inyectar la tarjeta en tu grid
            projects_grid.appendChild(projectCard);
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    } catch (error) {
        console.error("Error al cargar el JSON:", error);

        // Por si falla el JSON, activamos el observer para los elementos estáticos (el título, etc.)
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
}

// Ejecutar la carga de proyectos
loadProjects();

// ─── Nav scroll border ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Smooth scroll para links internos ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const canvas = document.getElementById('dotGrid');
const ctx = canvas.getContext('2d');

const SPACING = 20;
const RADIUS = 1;
const MAX_DIST = 110;

const LERP = 0.09;

let target = { x: -9999, y: -9999 };
let smooth = { x: -9999, y: -9999 };

function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', e => {
    target.x = e.clientX;
    target.y = e.clientY;
    if (smooth.x < 0) { smooth.x = target.x; smooth.y = target.y; }
});
window.addEventListener('mouseleave', () => {
    target.x = -9999; target.y = -9999;
    smooth.x = -9999; smooth.y = -9999;
});

function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function draw() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    if (target.x > 0) {
        smooth.x = lerp(smooth.x, target.x, LERP);
        smooth.y = lerp(smooth.y, target.y, LERP);
    }

    ctx.clearRect(0, 0, W, H);

    const offX = (W % SPACING) / 2;
    const offY = (H % SPACING) / 2;
    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = offX + c * SPACING;
            const y = offY + r * SPACING;
            const dist = Math.hypot(x - smooth.x, y - smooth.y);
            if (dist >= MAX_DIST) continue;
            const alpha = easeOut(1 - dist / MAX_DIST) * 0.7;
            ctx.beginPath();
            ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.fill();
        }
    }

    requestAnimationFrame(draw);
}

draw();

// Busca esta sección al final de tu script.js y envuélvela en este "if"
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