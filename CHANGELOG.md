# Changelog

All notable changes to **UrduOfDani** are documented in this file.

## 1.1.7 — 2026-10-06

Re-published with correctly-versioned artifacts. The v1.1.6 release shipped
the right code but with `1.1.5` in the artifact filenames (the bump to
1.1.6 happened in the same commit that fixed the release workflow, so the
build had already used 1.1.5 by the time the workflow ran). v1.1.7
re-builds the installers with the correct 1.1.6 version embedded.

### Changed
- `package.json` version: `1.1.5` → `1.1.6`.
- `index.html` `generator` meta: `1.1.5` → `1.1.6`.

### Published artifacts

Tag `v1.1.7` published at
https://github.com/forest1fire/urduofdani/releases/tag/v1.1.7:

- 🪟 **UrduOfDani-Setup-1.1.6.exe** — Windows NSIS installer (88 MB)
- 🐧 **UrduOfDani-1.1.6.AppImage** — Linux portable (117 MB)
- 🐧 **urduofdani_1.1.6_amd64.deb** — Debian/Ubuntu (76 MB)

## 1.1.6 — 2026-10-06

**First published release.** The release pipeline was working, but no
`v*` tag had ever been pushed, so the workflow had never fired. Pushed
`v1.1.6` and verified that the Windows NSIS installer, Linux AppImage,
and Linux .deb all build and ship to a real GitHub Release. The macOS
.dmg step cannot run from a non-macOS runner; that job is correctly
marked `continue-on-error: true` and does not block the release.

### Fixed
- `extraResources` referenced `templates/`, which doesn't exist in the
  repo. `electron-builder` would have failed the very first build.
  Replaced with the real directories: `plugins/`, `samples/`, `brands/`.
- The build jobs didn't verify the tree was green before spending CI
  minutes on three cross-platform builds. Added a **Pre-flight** job
  that runs `npm run audit` and `npm test` first; all three build jobs
  now `need: [preflight]`.

### Added
- **Pre-flight job** in `.github/workflows/release.yml` — `npm ci
  --ignore-scripts` + `npm run audit` + `npm test`. Fails the whole
  release in seconds if the tree is dirty.
- **Linux build dependencies** installed explicitly via
  `apt-get install -y libarchive-tools fakeroot rpm` so the AppImage
  and .deb can be packaged on a clean `ubuntu-22.04` runner.
- **3 new smoke tests** guarding the release-pipeline invariants
  (extraResources paths exist, release workflow has the expected
  triggers, ci workflow runs audit + tests + build).

### First published artifacts

Tag `v1.1.6` published at
https://github.com/forest1fire/urduofdani/releases/tag/v1.1.6:

- 🪟 **UrduOfDani-Setup-1.1.5.exe** — Windows NSIS installer (88 MB)
- 🐧 **UrduOfDani-1.1.5.AppImage** — Linux portable (117 MB)
- 🐧 **urduofdani_1.1.5_amd64.deb** — Debian/Ubuntu (76 MB)

## 1.1.5 — 2026-10-06

Free-for-everyone round. The MIT License text grants the right to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software free of charge — but the project's intent (free as in
price *and* free as in freedom, no paywall, no premium edition) was only
documented implicitly. Made it explicit in three places: a new
[`NOTICE`](./NOTICE) file, a top-of-README banner, and a rewritten
"Support" card in Help → About.

### Added
- **[`NOTICE`](./NOTICE)** — plain-English statement of intent. The MIT
  License is on the right; the project's wish is on the left: *UrduOfDani
  is free for everyone*. Covers download, study, modification,
  redistribution, forking, and resale; lists the only asks (keep the
  credit; if you improve it, share it; if you sell it, don't lock the
  free edition down).
- **README banner** — a single line under the tagline, in bold:
  *"100% free for everyone — forever. No paywall, no upsell, no premium
  edition."*
- **README License section** now points at both `LICENSE` and `NOTICE`.
- **3 new smoke tests** guarding the intent:
  - `LICENSE` still says "MIT License", "free of charge", grants the
    right to sell, and keeps the DaniLabs credit.
  - `NOTICE` exists, says "free for everyone", references MIT, and keeps
    the contact email + creator credit.
  - `README` surfaces "free for everyone" and links to `NOTICE`.

### Changed
- **Help → About → Support card** now leads with *"UrduOfDani is — and
  always will be — free for everyone"* and clarifies that Buy-a-Coffee /
  Sponsor are an *optional* way to say thanks, not a feature unlock.
- `docs/BRANDS.md` adds a short "Licensing" section pointing at NOTICE.

## 1.1.4 — 2026-10-06

Brand consolidation + support round. The repo had two parallel brand folders
(`brands/` and `resources/`), which caused duplicate PNGs, broken
`/resources/...` references in the renderer, and a stale `apple-touch-icon`
404. Everything now lives under `brands/` and ships correctly to the .exe.

### Changed
- **`brands/` is now the single source of truth for brand assets.** The
  duplicate `resources/` folder is removed (`git rm`). `src/renderer/Brand.jsx`,
  `index.html`, and `package.json` (electron-builder `icon` / `win.icon` /
  `linux.icon` / `mac.icon`) all point at `brands/urduofdani-icon.png` /
  `brands/urduofdani-wordmark.png` now.
- **`package.json` author email** is now `hello.danilabs@gmail.com`.
- **README, `docs/BRANDS.md`, `docs/DESIGN-SYSTEM.md`** all updated to point
  at the canonical paths. Added a "Contact" section in `docs/BRANDS.md`.
- **`scripts/copy-assets.mjs`** — new build step. `npm run build` now runs
  `vite build && node scripts/copy-assets.mjs`, which copies `brands/`,
  `samples/`, and `plugins/` into `dist/` so the renderer can load them at
  runtime (Vite only inlines files it imports as modules).
- **`electron-builder` `files` glob** now includes `brands/**/*` and
  `samples/**/*` so the icon and the sample plugin packages ship in the
  Windows .exe, Linux AppImage/.deb, and macOS .dmg.

### Added
- **Donate section in Help → About.** Buy a coffee / Sponsor links +
  `hello.danilabs@gmail.com` contact. Uses new `Icon.Coffee`, `Icon.Mail`,
  `Icon.Heart` components in `src/renderer/components/Icons.jsx`.

## 1.1.3 — 2026-10-06

Quality round. Synced the version reported by the build to match the latest
CHANGELOG entry, added a CI workflow that runs on every push, and tightened
the smoke-test coverage so future refactors cannot silently regress the
spell-check, document format, or electron-builder config.

### Fixed
- **`package.json` was at `1.1.1` while `CHANGELOG.md` already documented `1.1.2`.**
  Bumped to `1.1.2` and updated `index.html`'s `generator` meta to match. The
  in-app version is now what the changelog claims.
- **Two smoke tests were over-specific.** Both pinned a hard-coded `1.1.1` in
  the version regex. They now match any semver, so a future `npm version`
  won't break CI.

### Added
- **`.github/workflows/ci.yml`** — runs `npm run audit`, `npm test`, and
  `npm run build` on every push to `main` and on every pull request. Also
  verifies the built artifacts exist and the Python spell-check sidecar
  loads. Catches regressions that local checks would miss.
- **10 new smoke tests** covering:
  - `spell.js` does not throw on empty / punctuation / whitespace input.
  - `spell.js` returns correct word positions and offsets for unknown tokens.
  - `.udani` round-trip preserves `meta.title`, `page.size`, `page.orientation`,
    and the DaniLabs credit.
  - `emptyDocument()` ships an Urdu sample so a new doc is never blank.
  - `package.json`'s `electron-builder` config bundles `LICENSE` / `CHANGELOG.md`
    and declares both Windows + Linux icons.
  - `vite.config.js` uses a relative `base: "./"` (so the .exe runs from
    `Program Files` without 404s on `/assets/...`).
  - `index.html` actually loads `src/renderer/main.jsx`.
  - `App.jsx` mounts `<Toast/>` so the user sees save / open / PDF feedback.
  - Every script referenced in `README.md` is actually defined in `package.json`.
  - `CHANGELOG.md`'s top version heading matches `package.json`.
- **`docs/DESIGN-SYSTEM.md`** updated to reference the real `brands/` and
  `resources/` paths (the old text mentioned deleted SVG files).

## 1.1.2 — 2026-10-06

Audit round. The repo was working but had a few quiet issues: a couple of
production dependencies were missing from `package.json`, theme/scale choices
were not persisted across reloads, and there was no quick way to re-audit the
codebase. All fixed.

### Fixed
- **`pdf-lib` and `@pdf-lib/fontkit` were used by `src/renderer/lib/pdf.js` but
  were not declared in `package.json`.** A fresh `npm ci` install would have
  left PDF export broken. Both are now real `dependencies`.
- **Theme and UI scale did not survive a reload.** `Store.jsx` always booted
  with `theme: 'light'` and `scale: 100`, regardless of the user's last
  choice. They now read `udani:theme` and `udani:scale` from `localStorage`
  on mount, and `App.jsx` writes them back whenever they change.
- **The PDF export catch block logged bare `console.error(e)`.** Now prefixed
  with `[udani]` so the message can be filtered in dev consoles and won't be
  swallowed by strict production error reporters.

### Added
- **`scripts/audit.mjs`** — `npm run audit` walks `src/`, checks for orphan
  pages, missing dependencies, console calls, TODO/FIXME markers, missing
  `alt=` attributes, and `.gitignore` coverage. Fails non-zero on real
  issues. The audit confirmed the codebase is clean before this commit.
- **`index.html`** now declares `theme-color` (light + dark media queries),
  Open Graph (`og:title`, `og:description`, `og:image`), `application-name`,
  and a `generator` meta pointing to the running version. The app icon will
  now tint the system status bar / browser chrome correctly.
- **6 new tests** in `tests/smoke.test.mjs` (now **29 / 29 passing**), covering:
  the theme/scale persistence round-trip, the meta-tag presence,
  `pdf-lib` + `@pdf-lib/fontkit` in `dependencies`, the audit script
  itself, and the `[udani]`-prefixed PDF error log.

### Housekeeping
- `package.json` `version` bumped to **1.1.1** (was `1.0.0`).
- `electron-builder` `files` list now includes `LICENSE`, `README.md`, and
  `CHANGELOG.md` so the built installer carries the same metadata that ships
  in the repo.

## 1.1.1 — 2026-10-06

Aggressive repo cleanup. Repo shrunk from ~80 MB to 9.9 MB.

### Removed
- **`archive/`** — old InPage 2012 reference zip, old UrduOfDani-0.6.0 source zip, the original `Readmefirst` text.
- **All 26 reference mockup PNGs** (the design/01-…26-…png files, ~36 MB). They were conceptual-only; the React pages are the actual delivered UI.
- **`design/brands/md-monogram.png`** — 1.8 MB, never referenced by any code.
- **`resources/icon-source.png`** and **`resources/wordmark-source.png`** — duplicate copies of the brand files.
- **`resources/icon-{32,48,64,128,256,512}.png`** — sizes that no code referenced (the app uses the 1024×1024 `icon.png` everywhere).

### Renamed / moved
- **`design/INVENTORY.md`** → `docs/BRANDS.md` (the file was about brand assets, not mockups; rewrote it to match the now-6 brand files).
- **`design/brands/`** → `brands/` (top-level; the `design/` parent was emptied so we removed the indirection).
- `md-monogram.png` references removed from `CHANGELOG.md` and `docs/BRANDS.md`.
- `design/brands/...` references updated to `brands/...` in `README.md`, `CHANGELOG.md`, and `docs/BRANDS.md`.

### Result
- Repo size: **~80 MB → 9.9 MB** (excluding `node_modules/` and `.git/`).
- Repo layout: 9 top-level entries (was 12). Brand assets live at `brands/`, the running app pulls them from `resources/`.

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
- **`brands/`** — 6 official brand files from the user:
  - `urduofdani-icon.png` / `urduofdani-wordmark.png` — the actual app icon and wordmark (replacing the SVG approximations)
  - `danilabs-icon.png` / `danilabs-icon-light.png` / `danilabs-wordmark.svg` — the parent DaniLabs brand
  - `muhammad-danish-wordmark.png` — the personal brand of Muhammad Danish [Dani]
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