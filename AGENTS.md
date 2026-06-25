# portfolio_v.2

Static portfolio site deployed on **GitHub Pages** (`orifibla.dev`).

## Dev workflow

No build tools, no dev server. Edit files, open in browser. Deploy by pushing to `main`.

## Key dependencies

- **Tailwind CSS** via CDN (`cdn.tailwindcss.com`) — configured inline in each HTML `<head>` with custom colors (`surface`, `border`, `accent-dim`, `muted`, `faint`) and fonts (`font-space`, `font-inter`)
- **marked.js** via CDN (`cdn.jsdelivr.net/npm/marked/marked.min.js`) — renders markdown notes in vault
- Fonts via `fonts.bunny.net` (Inter, Space Grotesk) and `fonts.googleapis.com` as fallback

## Key structure

- `index.html` — main portfolio page; projects loaded from `projects.json`, quotes from `sentences.json`
- `projects/*.html` — individual project detail pages
- `vault/vault.html` — notes app; renders markdown files from `vault/notes/` via `marked.js`
- `vault/notes.json` — registry of available notes (title, path, date)
- `vault/parser.js` — fetches notes JSON and renders markdown content
- `style.css` — only what Tailwind CDN cannot express (cursor rules, canvas positioning, scroll reveal, markdown-body, project checkmarks, `prefers-reduced-motion`)
- `script.js` — dot grid animation, scroll reveal, project card generation, nav scroll state, email copy, quote loader

## Notable quirks

- Custom cursor via `cursor: none` in CSS — most interactive elements rely on it
- Dot grid uses two layered canvases (`#dotGridBg` z-index: -1, `#dotGridFg` z-index: 99999)
- Nav border toggled via `.navbar-scrolled` class (JS adds on scroll > 20px)
- Project cards built dynamically by JS — uses Tailwind classes for styling, `.project-card` class retained for `::before` hover overlay
- Tailwind config is duplicated in every HTML file — keep it consistent
- `CNAME` file controls the GitHub Pages custom domain — do not delete
