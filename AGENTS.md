# portfolio_v.2

Static portfolio site deployed on **GitHub Pages** (`orifibla.dev`).

## Dev workflow

No build tools, no dependencies, no CDNs. Edit files, preview with `python3 -m http.server`, deploy by pushing to `main`.

## Structure

- `index.html`: home page (hero, projects, experience, vault, freelance note, contact). The random quote list lives in its inline script.
- `projects/*.html`: one detail page per project.
- `vault/vault.html` + `vault/parser.js`: notes app. Lists `vault/notes.json` and renders the note in the URL hash (`vault.html#slug`) with the self-hosted `vault/marked.min.js`.
- `vault/notes.json`: registry of notes (`slug`, `title`, `content` path, `date`). Adding a note = drop a `.md` in `vault/notes/` and add an entry here.
- `site.css`: the only stylesheet, hand-written. Colours and fonts are CSS variables at the top.
- `assets/fonts/`: self-hosted Schibsted Grotesk (SIL OFL, licence in `OFL.txt`).

## Conventions

- Spanish (Spain) for all visible text.
- Every page links `site.css`, preloads the font, and includes the favicon and a `<meta name="description">`.
- `CNAME` controls the GitHub Pages custom domain. Do not delete it.
