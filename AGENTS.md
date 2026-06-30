# portfolio_v.2

Static portfolio site deployed on **GitHub Pages** (`orifibla.dev`).

## Dev workflow

No build tools, no dev server. Edit files, open in browser. Deploy by pushing to `main`.

## Key dependencies

- **Tailwind CSS** via CDN (`cdn.tailwindcss.com`) — configured inline in each HTML `<head>` with custom colors (`surface`, `border`, `accent-dim`, `muted`, `faint`) and fonts (`font-space`, `font-inter`)
- **marked.js** via CDN (`cdn.jsdelivr.net/npm/marked/marked.min.js`) — renders markdown notes in vault
- Fonts via `fonts.bunny.net` (Inter, Space Grotesk)

## Key structure

- `index.html` — main portfolio page; projects loaded from `projects.json`, quotes from `sentences.json`
- `projects/*.html` — individual project detail pages
- `vault/vault.html` — notes app; renders markdown files from `vault/notes/` via `marked.js`
- `vault/notes.json` — registry of available notes (title, path, date)
- `vault/parser.js` — fetches notes JSON and renders markdown content
- `style.css` — only what Tailwind CDN cannot express (scroll reveal, markdown-body, project checkmarks, `prefers-reduced-motion`)
- `script.js` — project card generation, email copy, quote loader
- `shared.js` — nav build via `rebuildNav()`, year auto-update, scroll border, smooth scroll, reveal observer
- Nav border toggled via `.navbar-scrolled` class (JS adds on scroll > 20px)
- Project cards built dynamically by JS — uses Tailwind classes for styling, `.project-card` class retained for `::before` hover overlay
- `rebuildNav(extraLinks)` in `shared.js` rebuilds the nav from `window.__navLinks` + optional extra links — `parser.js` uses it to add a temporary "Vault" back button when viewing a note
- `window.__navLinks` is declared in each page before loading `shared.js` — array of `{href, text, download?, id?}`
- Every HTML page must include: `<link rel="icon" href="../favicon.ico">` (or `favicon.ico` at root), `<meta name="description">`, and the bunny.net font link
- Tailwind config is duplicated in every HTML file — keep it consistent
- `CNAME` file controls the GitHub Pages custom domain — do not delete
