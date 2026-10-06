# Getting started

## What is UrduOfDani?

UrduOfDani is a desktop publishing application for **Urdu, Arabic and other
right-to-left languages**. It is built around three ideas:

1. **Modern technology** — Electron + React + Vite, not 1993-era Win32.
2. **Offline-first** — no account, no cloud, no network required.
3. **Real Urdu language support** — a 15,848-word audited spell-checker and
   live shaping of Urdu text via OpenType.

## Quick start

### Run the app (web preview)

```bash
npm install
npm run dev:web
# open http://localhost:5173
```

The web preview uses the **bundled JavaScript spell engine** so you don't
need Python or any Electron binary to play with the UI.

### Run the desktop app (Windows, macOS, Linux)

```bash
npm install
npm run dev          # launches the Electron shell with live Vite dev server
```

### Build a release

```bash
npm run dist:win     # → release/UrduOfDani-Setup-1.0.0.exe (NSIS)
npm run dist:linux   # → release/*.AppImage and *.deb
npm run dist:mac     # → release/*.dmg
```

### Run the spell-check engine from the CLI

```bash
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --info
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --spell "اردو زبان کی خوبصورتی"
python3 vendor/urduofdani_engine.py --db vendor/urdu_database.compact.gz --suggest خوبصو --limit 5
```

## Where to start in the UI

| Goal                                | Start here                             |
|-------------------------------------|----------------------------------------|
| Create a new document               | Home → New document                    |
| Open a sample template              | Home → Templates                       |
| Edit an existing document           | Editor → top bar tabs                  |
| Add Urdu text                       | Editor → type into a frame             |
| Insert a page                       | Editor → Page manager                  |
| Set up header/footer                | Editor → Master pages                  |
| Apply heading styles                | Editor → Document styles               |
| Change fonts                        | Tools → Fonts                          |
| Find / replace                      | Editor → Find & replace (Ctrl+F)       |
| Spell-check the document            | Editor → Spelling (F7)                 |
| Convert legacy Urdu encodings       | Tools → Unicode converter              |
| Generate a QR code                  | Tools → QR generator                   |
| Recover an autosaved document       | Home → Document recovery               |
| Customize the keyboard shortcuts    | Tools → Keyboard shortcuts             |
| Install a plugin                    | Tools → Plugins                        |
| Export to PDF                       | Editor → Export PDF (Ctrl+E)           |
| Change theme / language / scale     | Tools → Settings                       |
| Tune performance                    | Tools → Performance                    |
| Read the help                       | Help (?) or Tools → Help & about       |

## What you should NOT expect from this release

These are explicitly out of scope for 1.0.0. They are listed so you don't
think we hid them:

- **A true Nastaliq calligraphic shaper.** Urdu text is rendered via the
  system's Nastaliq/Naskh OpenType fonts. Hand-calligraphy-grade shaping
  is a multi-year font-engineering project; this release is honest about
  not shipping one.
- **Mac `.dmg` from this Linux build.** `npm run dist:mac` is wired but
  you must run it on macOS (or a macOS CI runner).
- **Real PDF print with embedded OpenType.** Export currently uses the
  browser's print-to-PDF, which embeds the system fonts. A proper
  print-pipeline PDF is on the roadmap.

## File format

`.udani` is JSON, versioned, diffable, and designed to round-trip with the
editor without loss. See `docs/UDANI-FORMAT.md`.

## Plugins

A `.udaniplugin` is a `.zip` with a `plugin.json` manifest and a `plugin.js`
entry. The host installs, runs, enables, disables, updates, rolls back, and
uninstalls. See `plugins/README.md`. Working samples are in `samples/`.