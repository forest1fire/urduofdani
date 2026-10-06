# UrduOfDani — Urdu word-processor & desktop publishing

> **Modern Urdu writing & publishing. Like InPage, but built for today.**
>
> Created by **Muhammad Danish [Dani] · DaniLabs**.

UrduOfDani is a desktop publishing application for Urdu, Arabic and other
right-to-left languages, modelled on the workflow of InPage but designed
fresh for the modern web stack: React + Vite UI, Electron wrapper, a
real Urdu dictionary engine, and a plugin system that works offline.

## Quick start (development)

```bash
npm install
npm run dev:web      # opens the UI on http://localhost:5173
```

## Quick start (desktop — Windows / macOS / Linux)

```bash
npm install
npm run dev          # launches Electron with the live Vite dev server
npm run dist:win     # produces an NSIS .exe installer in release/
npm run dist:linux   # produces AppImage + .deb
npm run dist:mac     # produces a .dmg (must run on macOS)
```

## Stack

| Layer    | Choice                          |
|----------|---------------------------------|
| Desktop  | Electron 33                     |
| UI       | React 18 + Vite 5 (vanilla CSS) |
| Packager | electron-builder 25             |
| Spell    | urduofdani-dictionry 3.1.0      |
| Python   | 3.9+ (used only for the spell-check sidecar) |

## Repository layout

```
.
├── IMAGE-INVENTORY.md      26 reference PNGs mapped to actual screens
├── docs/
│   ├── DESIGN-SYSTEM.md    Tokens, components, layout patterns
│   └── UDANI-FORMAT.md     The .udani document format (JSON)
├── src/
│   ├── main/index.cjs      Electron main process (spawns the spell-check sidecar)
│   ├── preload/preload.cjs contextBridge: exposes window.udani.spell
│   └── renderer/           React app
│       ├── App.jsx         Shell + routes
│       ├── components/     TopBar, SideNav, CommandPalette, Toast, Icons
│       ├── pages/          27 fully-built screens
│       ├── styles/         tokens.css + components.css
│       └── lib/            spell engine + Electron bridge
├── vendor/
│   ├── urduofdani_engine.py        Drop-in spell-check engine (offline)
│   ├── urduofdani.py               Front door for the engine
│   ├── urdu_database.compact.gz    15,848 audited Urdu words
│   └── urdu_database.full.compact.gz  17,539 full words
├── plugins/README.md       .udaniplugin spec
├── samples/                Three working .udaniplugin packages
│   ├── punctuation-fixer.udaniplugin
│   ├── diacritics-remover.udaniplugin
│   └── statistics.udaniplugin
├── .github/workflows/release.yml   Windows + Linux CI build
├── package.json            electron-builder config inside
└── CHANGELOG.md
```

## Spell-check (urduofdani-dictionry)

The Python engine is **bundled** — no downloads, no network. To use it:

```bash
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --spell "اردو زبان کی خوبصورتی"
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --suggest خوبصو --limit 5
```

In the UI: open **Review → Spelling**. The page live-checks the document using the
same engine (via Electron IPC) or the bundled JS fallback (in the web preview).

## Plugins

A `.udaniplugin` is a zip with a `plugin.json` manifest and a `plugin.js` entry.
See `plugins/README.md` for the full spec and `samples/` for working examples.

## Document format

`.udani` is JSON, versioned, diffable. See `docs/UDANI-FORMAT.md`.

## Credits

- Concept, product spec, design direction: **Muhammad Danish [Dani] · DaniLabs**.
- Dictionry engine: [forest1fire/urduofdani-dictionry](https://github.com/forest1fire/urduofdani-dictionry), MIT.
- Noto Nastaliq Urdu / Noto Naskh Arabic: SIL Open Font License 1.1.
- Original spell-check engine (`src/renderer/lib/spell.js`): same author, MIT.

## License

MIT — see LICENSE.