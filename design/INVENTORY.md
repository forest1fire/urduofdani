# UrduOfDani — Reference design inventory

The 26 PNG files in this folder are the UI mockups that drive the UrduOfDani design.
Each file maps 1-to-1 to a screen shipped as a real, clickable React page in
`src/renderer/pages/`.

| # | File | Screen | Implemented in |
|---|---|---|---|
| 01 | `01-home-and-quick-start.png` | Home / quick start (with the original concept art) | `HomePage.jsx` |
| 02 | `02-contents-and-footnotes.png` | Contents & footnotes | `ContentsPage.jsx` |
| 03 | `03-keyboard-practice.png` | Urdu keyboard practice | `KeyboardPracticePage.jsx` |
| 04 | `04-pages-manager.png` | Page manager (drag-reorder) | `PagesManagerPage.jsx` |
| 05 | `05-text-flow.png` | Text flow / linked frames | `TextFlowPage.jsx` |
| 06 | `06-tables.png` | Table editor | `TablesPage.jsx` |
| 07 | `07-unicode-converter.png` | Unicode converter | `UnicodeConverterPage.jsx` |
| 08 | `08-document-styles.png` | Document styles | `StylesPage.jsx` |
| 09 | `09-find-and-replace.png` | Find & replace | `FindReplacePage.jsx` |
| 10 | `10-fonts.png` | Font manager | `FontsPage.jsx` |
| 11 | `11-master-pages.png` | Master pages | `MastersPage.jsx` |
| 12 | `12-print-export.png` | Print & export | `ExportPage.jsx` |
| 13 | `13-spell-check.png` | Spell check | `SpellCheckPage.jsx` |
| 14 | `14-colors-shapes.png` | Colors & shapes | `ColorsShapesPage.jsx` |
| 15 | `15-images-assets.png` | Images & assets | `ImagesPage.jsx` |
| 16 | `16-keyboard-shortcuts.png` | Keyboard shortcuts | `ShortcutsPage.jsx` |
| 17 | `17-new-document.png` | New document setup | `NewDocPage.jsx` |
| 18 | `18-performance.png` | Performance settings | `PerformancePage.jsx` |
| 19 | `19-qr-generator.png` | QR generator | `QRPage.jsx` |
| 20 | `20-editor.png` | Editor — Design mode | `EditorPage.jsx` |
| 21 | `21-recovery.png` | Document recovery | `RecoveryPage.jsx` |
| 22 | `22-help.png` | Help & about | `HelpPage.jsx` |
| 23 | `23-home-recents.png` | Home / recents (recents table view) | `HomePage.jsx` (recents tab) |
| 24 | `24-shapes.png` | Shape builder | `ShapesPage.jsx` |
| 25 | `25-templates.png` | Template selection | `TemplatesPage.jsx` |
| 26 | `26-settings.png` | Settings | `SettingsPage.jsx` |

## Visual language

- **Palette** — navy `#102A43`, emerald `#008F76`, ivory `#F7F5EF`, slate `#64748B`, gold accent `#C69B47`.
- **Typography** — system sans for UI; Noto Nastaliq Urdu / Noto Naskh Arabic for Urdu body text.
- **Direction** — RTL for Urdu, LTR for English; ⌘K / Ctrl+K command palette.
- **Credit** — "Muhammad Danish [Dani] · DaniLabs" in every page footer and the Help/About panel.

The mockups are reference only — they are not used at runtime. The shipped UI is
fully built in React + CSS and renders identically across the 26 screens.
