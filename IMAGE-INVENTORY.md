# UrduOfDani — Reference Image Inventory

Every PNG in the repo root is a UI mockup for a stage of the UrduOfDani desktop-publishing app.
This file is the contract between the reference designs and the implemented UI.

**App:** UrduOfDani — a modern, offline-first Urdu word-processor & desktop publishing suite.
**Inspiration source:** `ChatGPT Image Oct 3, 2026, 06_54_33 PM.png` (the original concept render).
**Style:** navy + emerald + white + ivory, emerald accents, system-sans UI, Nastaliq/Naskh Urdu body.
**Credit:** Muhammad Danish [Dani] · DaniLabs.

| # | File | Screen / Stage | Notes |
|---|---|---|---|
| 1 | `UrduOfDani home and quick start.png` | **Home / Quick start** | Recent documents table, Quick start cards (Blank A4, Book A5, Poster A4), Templates grid, UR/EN switcher. |
| 2 | `UrduOfDani New Document Setup.png` | **New Document** | Document type picker, page / layout / writing controls, live preview pane. |
| 3 | `UrduOfDani template selection workspace.png` | **Templates** | Category chips (All / Books / Magazines / Posters / Invitations / Saved), card preview, "Use template" CTA. |
| 4 | `UrduOfDani Urdu Magazine Workspace.png` | **Editor — Design mode** | Spread view, left rail (Pages/Layers/Assets), toolbar (font/size/align/RTL), right inspector (Crop/Fit, Dimensions, Wrap, Position, Effects, Print check). |
| 5 | `Urdu Magazine Page Organizer.png` | **Page manager** | Drag-reorder, Add/Duplicate/Move, Pages vs Spreads toggle, Insert pages side panel. |
| 6 | `Urdu magazine master page manager.png` | **Master pages** | Master list (A/B/C), spread preview, header/footer/section/guides panels. |
| 7 | `Urdu Magazine Text Flow Manager.png` | **Text flow** | Story frames list, linked-frame diagram, overflow badge. |
| 8 | `Urdu Contents & Footnotes Manager.png` | **ToC & Footnotes** | Title, level picker, page-number toggle, live preview, document headings list, footnote summary. |
| 9 | `Urdu document styles manager.png` | **Document styles** | Paragraph/character styles list, full editor for one style, live preview. |
| 10 | `Urdu font manager with live preview-2.png` | **Fonts** | Font cards with star/favorite, category chips, live preview controls (size, style, line spacing), drag-drop area. |
| 11 | `Urdu editor find and replace.png` | **Find & Replace** | Find/Replace tabs, scope, whole-words / diacritics toggles, match list with page jumps. |
| 12 | `Urdu spell check review workspace.png` | **Spell check** | Pages list, "Not in dictionary" panel, suggestions, Replace / Ignore / Add-to-dictionary. |
| 13 | `UrduOfDani Images & Assets Manager.png` | **Images & assets** | Asset grid, image details side panel (type/dim/size, insert, locate-on-page). |
| 14 | `UrduOfDani Colors & Shapes Manager.png` | **Colors & Shapes** | Two tabs (Colors / Shapes), swatch grid, edit color side panel. |
| 15 | `UrduOfDani shape builder interface.png` | **Shape builder** | Shape picker (rect / rounded / circle / triangle / line / arrow / diamond / star), property panel. |
| 16 | `Urdu Table Editing Workspace.png` | **Tables** | Insert row/column, merge/split, header row, padding, borders, table-style gallery. |
| 17 | `Urdu magazine print and export.png` | **Print & export** | PDF / Print tabs, presets, page range, output, image quality, embed fonts, document check, output panel. |
| 18 | `Urdu Keyboard Typing Practice Screen.png` | **Urdu keyboard** | On-screen keyboard, try-it textarea, font/size/hints/diacritics controls. |
| 19 | `Urdu Unicode Converter Workspace.png` | **Unicode converter** | Side-by-side original/Unicode preview, paste/clear, "Insert into document". |
| 20 | `UrduOfDani QR code generator concept.png` | **QR generator** | Link/text tabs, URL input, fg/bg colors, size, error correction, summary, insert. |
| 21 | `UrduOfDani document recovery workspace.png` | **Recovery** | Document list, available copies list, preview pane, restore-as-copy. |
| 22 | `UrduOfDani Keyboard Shortcuts Manager.png` | **Shortcuts** | Searchable command list, category chips, edit side panel with conflict warning, import/export. |
| 23 | `urdu setting.png` | **Settings** | General / Editing / Saving / Performance tabs, Appearance (Light/Dark/System + scale), Editing defaults (keyboard, direction, default font), Saving & recovery. |
| 24 | `UrduOfDani Performance Settings Panel.png` | **Performance settings** | Editing, Large documents, Rendering, Diagnostics sections with toggles/dropdowns. |
| 25 | `UrduOfDani help and about screen.png` | **Help & about** | Side nav (Getting started / Editing Urdu / Page design / Fonts & plugins / Export & printing / About), guide cards, popular topics list, branded right pane with "Created by Dani". |
| 26 | `UrduOfDani Plugins.png` | **Plugins** (synthesized from inventory; see also the screen list) | Installed/Browse tabs, plugin cards with enable toggle + Settings, font library at bottom. |

## Groupings used in the app shell

```
Home & document creation
  └ Home, New document, Templates, Recent files, Document recovery

Editor
  └ Write / Design / Print modes
       — Toolbar (File/Edit/Insert/Layout/Typography/Review/Help)
       — Spread view, page navigator, master pages, text flow, ToC/footnotes
       — Inspector (selection / object properties / styles)

Workspace manager (left-rail tools)
  └ Colors & shapes, Images & assets, Fonts, Templates, Shortcuts, Settings, Plugins

Tools & conversion
  └ Find & replace, Spell check, Unicode converter, Urdu keyboard, QR generator

Recovery, print, performance, help
  └ Document recovery, Print & export, Performance, Settings, Help & about
```

## Visual language locked in

| Token | Hex | Role |
|---|---|---|
| `--navy-900`   | `#102A43` | Brand color, top bar, headings |
| `--navy-800`   | `#1E3A5F` | Hover on navy |
| `--emerald-500`| `#008F76` | Primary action, links, success |
| `--emerald-100`| `#D1F2EB` | Selected row, hover bg |
| `--emerald-50` | `#E7F8F4` | Subtle highlight |
| `--ivory-50`   | `#F7F5EF` | Document paper color |
| `--gold-500`   | `#C69B47` | Accent (borders, dividers) |
| `--slate-500`  | `#64748B` | Secondary text |
| `--slate-100`  | `#E2E8F0` | Divider, control border |
| `--white`      | `#FFFFFF` | Surfaces |
| `--danger`     | `#C53030` | Errors |
| `--warning`    | `#D69E2E` | Conflict warning |

Type: system sans for UI; Noto Nastaliq Urdu / Noto Naskh Arabic for content.
RTL honored throughout; UR/EN toggle in title bar; ⌘K (Ctrl+K) command palette.