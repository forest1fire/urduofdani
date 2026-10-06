<div align="center">

 <img src="brands/urduofdani-wordmark.png" alt="UrduOfDani" width="600"/>

**Modern Urdu word-processor & desktop publishing. Like InPage, but built for today.**

***100% free for everyone — forever. No paywall, no upsell, no premium edition.***

*Created by **Muhammad Danish [Dani] · DaniLabs***

[Live preview](https://5173-ce10610a.e2b.app) ·
[Releases](https://github.com/forest1fire/urduofdani/releases) ·
[Issues](https://github.com/forest1fire/urduofdani/issues)

</div>

---

<div align="center">

<img src="brands/danilabs-icon.png" alt="DaniLabs" width="64"/>

**A DaniLabs product · by [Muhammad Danish](https://github.com/forest1fire)**

<img src="brands/muhammad-danish-wordmark.png" alt="Muhammad Danish" width="220"/>

</div>

---

UrduOfDani is a desktop publishing application for Urdu, Arabic and other
right-to-left languages. The workflow is modelled on InPage, but the
stack is modern: React + Vite for the UI, Electron for the desktop
wrapper, a real Urdu dictionary engine for spell-check, and a plugin
system that runs fully offline.

## Quick start (development)

```bash
npm install
npm run dev:web     # UI on http://localhost:5173
```

## Quick start (desktop — Windows / macOS / Linux)

```bash
npm run dev         # launches Electron with the live Vite dev server
npm run dist:win    # produces an NSIS .exe installer in release/
npm run dist:linux  # produces AppImage + .deb
npm run dist:mac    # produces a .dmg (must run on macOS)
```

## Health checks

```bash
npm test            # 29 smoke tests, no fixtures needed
npm run audit       # walk src/ for missing deps, orphan pages, console.*, TODO/FIXME, alt=, .gitignore
npm run build       # production build into dist/
```

A `ci` workflow runs all three on every push and every pull request
(`.github/workflows/ci.yml`).

## What you get

- **26 fully-implemented screens** — every screen called for in the spec is a real, clickable React page (see `src/renderer/pages/`).
- **Offline Urdu spell-check** — the vendored `urduofdani-dictionry` engine with 15,848 audited words.
- **Real PDF export** — `.udani` documents can be saved, re-opened, and exported to PDF with metadata, margins, and a credit footer.
- **Responsive layout** — fluid grids at 560 / 900 / 1200 / 1920 px breakpoints for split-screen and narrow windows.
- **Plugin system** — `.udaniplugin` zip packages with a documented manifest format and three working sample plugins.
- **Auto-built installers** — GitHub Actions builds the Windows `.exe`, Linux AppImage + `.deb` and macOS `.dmg` on every `v*` tag.

## Stack

| Layer    | Choice                          |
|----------|---------------------------------|
| Desktop  | Electron 33                     |
| UI       | React 18 + Vite 5 (vanilla CSS) |
| PDF      | pdf-lib + @pdf-lib/fontkit      |
| Packager | electron-builder 25             |
| Spell    | urduofdani-dictionry 3.1.0 (offline) |
| Python   | 3.9+ (used only for the spell-check sidecar in the Electron build) |

## Repository layout

```
.
├── brands/                       6 official brand PNGs (icon, wordmark, parent, personal) — single source of truth
├── docs/
│   ├── BRANDS.md                 Brand catalogue + usage rules
│   ├── DESIGN-SYSTEM.md          Tokens, components, layout patterns
│   ├── GETTING-STARTED.md        User guide
│   └── UDANI-FORMAT.md           The .udani document format (JSON)
├── samples/                      3 working .udaniplugin packages
├── src/
│   ├── main/index.cjs            Electron main (spawns the spell-check sidecar)
│   ├── preload/preload.cjs       contextBridge: exposes window.udani.spell
│   └── renderer/
│       ├── App.jsx               Shell + routes
│       ├── components/           TopBar, SideNav, CommandPalette, Brand, …
│       ├── pages/                26 fully-built screens
│       ├── styles/               tokens, components, responsive
│       └── lib/                  spell engine, PDF, .udani I/O, Electron bridge
├── vendor/                       urduofdani-dictionry engine + 15,848-word DB
├── plugins/README.md             .udaniplugin spec
├── tests/smoke.test.mjs          29 smoke tests (spell, engine, PDF, .udani, App)
├── scripts/audit.mjs             Static analyser (npm run audit)
├── .github/workflows/
│   ├── ci.yml                    audit + tests + build on every push
│   └── release.yml               Auto-build Windows / Linux / macOS on `v*` tag
├── package.json                  electron-builder config inside
└── CHANGELOG.md
```

## Spell-check

The engine is **bundled** — no downloads, no network. To use it from the CLI:

```bash
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --spell "اردو زبان کی خوبصورتی"
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --suggest خوبصو --limit 5
```

In the UI: open **Review → Spelling**. The page live-checks the document using
the same engine (via Electron IPC) or the bundled JS fallback (in the web preview).

## Auto-`.exe` release system

The `.github/workflows/release.yml` workflow produces installers on every `v*` tag
and auto-publishes a GitHub Release with the attached artifacts.

| Trigger                                       | Result                              |
|-----------------------------------------------|-------------------------------------|
| `git tag v1.0.0 && git push --tags`           | Windows .exe + Linux AppImage + .deb + macOS .dmg built, then published as `v1.0.0` |
| Manual `workflow_dispatch`                    | Same, without a tag or release      |

To cut a release:

```bash
npm test && npm run audit && npm run build   # make sure the tree is green
# update CHANGELOG.md, then:
git tag v1.0.1
git push origin v1.0.1
# GitHub Actions will build, attach, and publish.
```

## Credits

- Concept, product spec, design direction: **Muhammad Danish [Dani] · DaniLabs**.
- Dictionry engine: [forest1fire/urduofdani-dictionry](https://github.com/forest1fire/urduofdani-dictionry), MIT.
- Noto Nastaliq Urdu / Noto Naskh Arabic: SIL Open Font License 1.1.

## License

**UrduOfDani is free for everyone** — MIT License, see [`LICENSE`](./LICENSE)
for the legal text and [`NOTICE`](./NOTICE) for the project's intent (no
paywall, no premium edition, no resale restrictions beyond keeping the
credit intact).
