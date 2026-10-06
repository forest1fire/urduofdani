# Brand assets

The 6 official brand files live in `brands/` at the repo root. They are the
single source of truth and ship in three places:

1. **GitHub README** — GitHub renders `brands/urduofdani-wordmark.png` directly from the repo.
2. **The web / Electron renderer** — `npm run build` runs `scripts/copy-assets.mjs`,
   which copies `brands/`, `samples/`, and `plugins/` into `dist/`. The renderer
   loads them from `/brands/*` via `src/renderer/components/Brand.jsx`.
3. **The packaged .exe / .dmg / .AppImage** — `electron-builder`'s `files` glob
   in `package.json` includes `brands/**/*`, so the icon at
   `brands/urduofdani-icon.png` is the icon for the Windows NSIS installer,
   the Linux AppImage, the macOS .dmg, the Linux .deb, the dock icon, and
   the `appId` entry.

| File | Purpose | Used as |
|---|---|---|
| `urduofdani-icon.png` | App icon (emerald pen, rounded plate) | `brands/urduofdani-icon.png` for Electron / favicon / apple-touch |
| `urduofdani-wordmark.png` | "UrduOfDani — Created by Dani" banner | README banner, OG image, in-app Brand component |
| `danilabs-icon.png` | DaniLabs "D" mark on navy | About card, parent-brand badge |
| `danilabs-icon-light.png` | DaniLabs "D" mark on dark | About card, light-background variant |
| `danilabs-wordmark.svg` | "DaniLabs" animated header SVG | Marketing site (not currently in app) |
| `muhammad-danish-wordmark.png` | "Muhammad Danish — WordPress Developer" | About card personal credit |

## Visual language

- **Palette** — navy `#102A43`, emerald `#008F76`, ivory `#F7F5EF`, slate `#64748B`, gold accent `#C69B47`.
- **Typography** — system sans for UI; Noto Nastaliq Urdu / Noto Naskh Arabic for Urdu body text.
- **Direction** — RTL for Urdu, LTR for English; ⌘K / Ctrl+K command palette.
- **Credit** — "Muhammad Danish [Dani] · DaniLabs" in every page footer, the Help/About panel, and the PDF export footer.

## Contact

- **Support & feedback** — [hello.danilabs@gmail.com](mailto:hello.danilabs@gmail.com)
- **GitHub** — [forest1fire/urduofdani](https://github.com/forest1fire/urduofdani)

## Licensing

UrduOfDani is **free for everyone** under the MIT License. The full intent
(why, what is and isn't restricted, the credit ask) is in [`NOTICE`](../NOTICE)
at the repo root.
