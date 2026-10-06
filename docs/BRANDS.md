# Brand assets

The 6 official brand files live in `brands/` at the repo root. The production
assets are copied to `resources/` so Vite can serve them from `/resources/*`
at runtime, and `electron-builder` can pick them up for the desktop installer.

| File | Purpose | Used as |
|---|---|---|
| `urduofdani-icon.png` | App icon (emerald pen, rounded plate) | `resources/icon.png` for Electron / favicon / apple-touch |
| `urduofdani-wordmark.png` | "UrduOfDani — Created by Dani" banner | `resources/wordmark-1100.png`, README banner |
| `danilabs-icon.png` | DaniLabs "D" mark on navy | About card, parent-brand badge |
| `danilabs-icon-light.png` | DaniLabs "D" mark on dark | About card, light-background variant |
| `danilabs-wordmark.svg` | "DaniLabs" animated header SVG | Marketing site (not currently in app) |
| `muhammad-danish-wordmark.png` | "Muhammad Danish — WordPress Developer" | About card personal credit |

## Visual language

- **Palette** — navy `#102A43`, emerald `#008F76`, ivory `#F7F5EF`, slate `#64748B`, gold accent `#C69B47`.
- **Typography** — system sans for UI; Noto Nastaliq Urdu / Noto Naskh Arabic for Urdu body text.
- **Direction** — RTL for Urdu, LTR for English; ⌘K / Ctrl+K command palette.
- **Credit** — "Muhammad Danish [Dani] · DaniLabs" in every page footer, the Help/About panel, and the PDF export footer.
