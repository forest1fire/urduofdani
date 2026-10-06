# Changelog

All notable changes to **UrduOfDani** are documented in this file.

## 1.1.0 — 2026-10-06

End-to-end document I/O and PDF export. The libraries existed but were never wired in.

### Added
- **`src/renderer/lib/useDocActions.js`** — central hook providing `newDoc`, `openFile`, `save`, `exportPdf`, `autosaveDoc`. PDF engine is **lazy-loaded** (the 1 MB pdf-lib + fontkit bundle only loads when the user clicks Export), keeping the main bundle at 339 KB.
- **Save / Open / Export PDF buttons** in the top bar with **Cmd/Ctrl+S, Cmd/Ctrl+O, Cmd/Ctrl+E** keyboard shortcuts.
- **Command palette** routes Save / Open / Export through the same hook.
- **Toast** supports `kind` (`ok | info | warn | error`) with per-kind colour and a check / info / warn / error icon, plus an entrance animation.
- **EditorPage** title and body are `contentEditable` — edits flow back into `state.activeDoc` and call `autosaveDoc()` on blur.
- **ExportPage** has a real Export PDF button: lazy-loads the engine, shows a per-page progress bar, surfaces the file size and a success banner.
- **HomePage** has a "Recovered drafts" card (the last 3 autosaves) and an "Open .udani" hero button. Recents table shows an empty state when no documents have been opened.
- **PDF footer** on every exported page: "Created with UrduOfDani - by Muhammad Danish [Dani] - DaniLabs".

### Changed
- **`src/renderer/lib/pdf.js`** — `toWinAnsi()` transliterates non-Latin text to `?` until we ship an embedded TTF (the alternative is a PDF that throws on `WinAnsi cannot encode "ا"`). Page numbers + footer watermark on every page; `meta.credit` toggles the footer.
- **Top bar layout** — `.topbar-btn-primary` emerald-fill variant for the Export PDF button; button text labels collapse to icons at < 900 px so the topbar fits narrow / split-screen widths.
- **Build** — main bundle dropped from 1.3 MB to 339 KB; the PDF engine is now a 1 MB lazy chunk loaded only on Export. Bundle warning is informational.

### Tests
- **23/23 passing** (was 12). 11 new tests cover document round-trip, magic-byte parsing, `emptyDocument()` factory, `buildPdf()` returns `%PDF-`, the 5 useDocActions actions, the topbar Cmd+S binding, command palette routing through useDocActions, home page recovery card, export page real PDF build, and editor contentEditable + autosaveDoc.

## 1.0.2 — 2026-10-06

Real brand assets from the DaniLabs design system.

### Added
- **`design/brands/`** — 7 official brand files from the user:
  - `urduofdani-icon.png` / `urduofdani-wordmark.png` — the actual app icon and wordmark (replacing the SVG approximations)
  - `danilabs-icon.png` / `danilabs-icon-light.png` / `danilabs-wordmark.svg` — the parent DaniLabs brand
  - `muhammad-danish-wordmark.png` / `md-monogram.png` — the personal brand of Muhammad Danish [Dani]
- **`resources/`** now serves the real PNGs:
  - `icon.png` / `icon-{32,48,64,128,256,512}.png` / `favicon-{16,32}.png` / `apple-touch-icon.png` from the real `urduofdani-icon.png`
  - `wordmark-1100.png` / `wordmark-600.png` from the real `urduofdani-wordmark.png`
  - `danilabs-icon.png` / `danilabs-icon-light.png` / `muhammad-danish-wordmark.png`
- **Help/About card** now shows the DaniLabs "D" mark with "A DaniLabs product" line.
- **README** has a "A DaniLabs product · by Muhammad Danish" footer banner.

### Changed
- **`src/renderer/components/Brand.jsx`** rewritten to use the real PNGs and support new modes: `parent` (DaniLabs mark), `personal` (Muhammad Danish wordmark), `light` (alternate bg).
- **`index.html`** no longer references the removed `logo-icon.svg`; uses the real favicon-32/16 PNGs and apple-touch-icon.
- **Removed** the SVG-recreated `resources/logo-icon.svg` and `resources/logo-wordmark.svg` (replaced by the real brand PNGs).

## 1.0.1 — 2026-10-06

Repo hygiene + brand identity + auto-`.exe` release pipeline.

### Added
- **Brand assets.** Brand-true SVG logo and wordmark in `resources/`:
  - `logo-icon.svg` — emerald pen, viewBox 0 0 512 512
  - `logo-wordmark.svg` — UrduOfDani + "Created by Dani"
  - `icon.png` (1024×1024) for Electron, plus 32 / 48 / 64 / 128 / 256 / 512 px PNGs
  - `favicon-16/32.png`, `apple-touch-icon.png`
  - 600 / 1100 px wordmark PNGs for the README
- **`src/renderer/components/Brand.jsx`** — `<Brand size />` and `<Brand wordmark twoTone />` ship the brand inline, recolourable, and free of PNG dependencies.
- **Auto-release pipeline.** `.github/workflows/release.yml` now also:
  - Adds a `build-mac` job (skips cleanly when no `macos` runner is available)
  - Publishes a GitHub Release with `softprops/action-gh-release@v2` on every `v*` tag, attaching all three OS installers
  - Supports `workflow_dispatch` for manual dry-runs
- **`<Brand>` used in the UI.** Top bar logo slot, Home page hero, Help/About card.

### Changed
- **Repository layout.** 26 mockup PNGs moved from the repo root into `design/` (with semantic names) and the inventory doc moved to `design/INVENTORY.md`. Old source ZIPs and `Readmefirst` moved to `archive/`. The repo root now contains only top-level config.
- **`.gitignore`** now ignores `dist/`, `release/`, `node_modules/`, OS/editor cruft, Python caches.
- **`package.json` `build.icon`** points at `resources/icon.png` for Windows, macOS, and Linux.
- **`index.html`** now links the SVG favicon, PNG fallbacks, and the apple-touch-icon.
- **`README.md`** rewritten with the new banner, restructured layout, and a "How to cut a release" section.

### Tests
- 12/12 smoke tests pass (6 spell + engine + 6 responsive CSS / App).

## 1.0.0 — 2026-10-06

First end-to-end release. Built by Arena Agent in a single session.

### Highlights

- 26 reference screens from the design pack implemented as clickable React pages.
- Real document model: `.udani` JSON format with versioning (`docs/UDANI-FORMAT.md`).
- Vendored **urduofdani-dictionry** engine (15,848 audited Urdu words) as the spell-checker, called from Electron via a Python sidecar.
- Plugin SDK: `.udaniplugin` zip spec with manifest + sandboxed JS. Three working samples ship: punctuation fixer, diacritics remover, statistics.
- Cross-platform build: `npm run dist:win` produces an NSIS-based `.exe` installer; `dist:linux` produces AppImage + `.deb`; `dist:mac` produces a `.dmg`. CI workflows in `.github/workflows/`.
- Offline-first: no network calls; dictionary databases vendored at `vendor/urdu_database*.compact.gz`.
- App shell: top bar (navy + emerald), side nav, command palette (Ctrl+K), inspector panel, status bar, modal system.
- Settings: theme (light/dark/system), UI scale, UI language, keyboard layout, autosave & recovery toggles, performance switches.
- Keyboard shortcuts editor with conflict detection and import/export.

### Stack

| Layer    | Choice                          |
|----------|---------------------------------|
| Desktop  | Electron 33                     |
| UI       | React 18 + Vite 5 (vanilla CSS) |
| Packager | electron-builder 25 (NSIS)      |
| Spell    | urduofdani-dictionry 3.1.0      |
| Python   | 3.9+ (stdlib only)              |

### What is *not* in this release (honest)

- **Real Nastaliq shaping engine.** We render Urdu via Unicode Naskh (Noto Nastaliq Urdu when the system has it). A full calligraphic Nastaliq shaper is a multi-year project; this release is honest about that.
- **Mac `.dmg`.** Not built in CI from this Linux sandbox; `dist:mac` is wired but the user must run it on macOS or in a macOS runner.
- **Real PDF print path.** Export is wired but uses the browser PDF print which embeds system fonts. A true PostScript-level PDF with embedded OpenType is the next milestone.

### Verification

- `npm run build` → green (66 modules, 325 KB JS, 80 KB gzipped).
- `python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --spell …` returns real suggestions: `خوبصو → خوبصورت | خوبصورتپن | خوبصورتی`.
- Dev server runs on port 5173 (vite preview; load it in any browser).

### Credits

- Concept, design, direction, and product spec: **Muhammad Danish [Dani] · DaniLabs**.
- Original spell-check engine (`spell.js`): same author, MIT-licensed.
- Dictionry engine: forest1fire/urduofdani-dictionry, MIT.
- Noto Nastaliq Urdu / Noto Naskh Arabic: SIL Open Font License 1.1.