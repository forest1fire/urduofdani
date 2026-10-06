# Changelog

All notable changes to **UrduOfDani** are documented in this file.

## 1.2.6 — 2026-10-06

**Real template gallery.** The Templates page is now a proper
gallery with 15 production-quality templates that actually open
as fully-formed documents in the editor.

### Added (templates.js)
- **15 production templates** across 6 categories:
  - **Books (2)**: Urdu Book (A5, 4 pages), Poetry Collection (A5, 4 pages)
  - **Magazines (2)**: Editorial Magazine (A4, 4 pages), Tech Magazine (A4, 3 pages)
  - **Cards (2)**: Wedding Invitation (A5, 1 page), Business Card (DL, 1 page)
  - **Newsletters (2)**: School Newsletter (A4, 4 pages), Corporate News (A4, 1 page)
  - **Posters (2)**: Event Poster (A3, 1 page), Mosque Poster (A3, 1 page)
  - **Reports (3)**: Research Report (A4, 4 pages), Annual Report (A4, 4 pages), Professional CV (A4, 1 page), Modern Resume (A4, 1 page), Travel Brochure (A4 landscape, 1 page)
- Each template has:
  - **Multi-page structure** (1-4 pages each)
  - **Multi-frame layout** (cover, contents, body, back cover, etc.)
  - **Real Urdu content** (prose, poetry, articles) + English where applicable
  - **Custom palette** (bg / fg / accent / secondary)
  - **Page size + orientation** (A5 / A4 / A3 / Letter / DL)
  - **Direction** (RTL or LTR)
  - **Featured flag** (3 templates marked as featured)
- **Helper functions**:
  - `getTemplateById(id)` — look up by slug
  - `getFeaturedTemplates()` — get the 3 featured ones
  - `getCategories()` — get categories with counts
  - `templateToDocument(t)` — convert to the emptyDocument-style
    structure used by the editor

### Added (TemplatesPage)
- **Featured row** with 3 large highlighted cards at the top
  (Urdu Book, Wedding Invitation, Editorial Magazine).
- **Category chips with counts** ("All 15", "Books 2",
  "Magazines 2", "Cards 2", "Newsletters 2", "Posters 2",
  "Reports 3").
- **Search input** that matches title, subtitle, and Urdu title.
- **Empty state** when no templates match.
- **Preview modal** — clicking any template (or "Preview" button)
  opens a modal showing:
  - All pages as small previews with their actual frame layouts
  - Page count, size, orientation, palette, and time-to-fill chips
  - Long description
  - "Cancel" and "Create from this template" buttons
- **Two card types**:
  - `FeaturedCard` — large, with hero image area, badge, and
    inline "Use" button.
  - `TemplateCard` — standard grid card with "Preview" + "Use"
    buttons, page size chip, RTL/LTR indicator.
- **"Use template" action** — converts the template to a real
  document and dispatches `open-doc-data` + `set-route: editor`,
  so the user lands in the editor with the document already open.
- **"Want a custom template?" callout** at the bottom inviting
  requests to `hello.danilabs@gmail.com`.

### Added (CSS)
- `.modal-card`, `.modal-header`, `.modal-body`, `.modal-footer`
  with fade-in animation.
- `.tpl-card`, `.tpl-preview`, `.tpl-chip`, `.tpl-lines`,
  `.tpl-line` (long/med/short variants) — polished template
  preview with hover lift + border highlight.
- Responsive: modal collapses to 95vw on mobile; padding shrinks.

### Added (tests)
- 2 new smoke tests: templates.js ships 15 templates across 6
  categories with all helpers; TemplatesPage ships a featured row,
  category filter, search, preview modal, and rich grid.
- **64 / 64 tests pass.**

### Verified
- `npm test` → **64 / 64 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200; HMR
  serving the new templates.

## 1.2.5 — 2026-10-06

**Editor upgrade — Word / InPage / CorelDRAW inspired.** The editor
is now a real publishing workspace with a ribbon, ruler, page canvas,
side panel, and a live status bar.

### Added (EditorPage)
- **Ribbon toolbar** with 6 tabs (Home / Insert / Layout / Type /
  Review / View) and grouped tools (Clipboard, Font, Paragraph,
  Styles, Pages, Tables, Media, Shapes, etc.). Tabs are toggleable;
  the active tab is highlighted.
- **Menu bar** above the ribbon with 6 file/UI menus (Home, Insert,
  Layout, Type, Review, View) and right-side actions (Find, Hide
  ribbon, Quick command, Export PDF).
- **Ruler** below the ribbon with numbered tick marks.
- **Tool rail** on the left with 8 tools (Select, Text frame, Image,
  Table, Shape, Hyperlink, Pen, Comment) + Undo/Redo at the bottom.
  Each tool has its keyboard shortcut shown in a tiny badge.
- **Side panel** with 4 tabs (Pages / Layers / Assets / Outline).
  Pages tab shows a 2-column grid of page thumbnails with proper
  aspect ratio and Urdu word previews. Outline tab shows the document
  structure.
- **Canvas** with margin guides, page sheet shadow, 3 themes (white
  paper / sepia / dark), and a Page nav (Prev / Next).
- **Find & replace bar** (Ctrl+H) — appears as a sticky bar at the
  top of the canvas with Find, Replace, Replace-all, and a Close
  button.
- **Editor status bar** at the bottom with: save indicator with
  last-saved time, word count, character count, current page,
  line/column, RTL/LTR, canvas theme, zoom controls, page size,
  columns, version.
- **8 page sizes** (A4P, A4L, A3P, A5P, Letter, Legal, B5, Custom)
  with portrait/landscape toggle.
- **3 margin presets** (Narrow 36pt, Normal 64pt, Wide 96pt) plus
  custom.
- **4 column layouts** (1, 2, 3, 4).
- **3 canvas themes** (white paper, sepia, dark page) — toggleable
  from the View ribbon.
- **8 fonts** including Noto Nastaliq Urdu, Noto Naskh Arabic,
  Scheherazade, Amiri, Inter, Roboto, Merriweather, JetBrains Mono.
- **8 paragraph styles** (Body Urdu, Heading 1/2/3, Caption, Quote,
  Subtitle, Code).
- **Real text editing** — contenteditable title + body with proper
  RTL, font selection, font size, bold/italic/underline (via
  `document.execCommand`), alignment (4 options), RTL/LTR toggle,
  multi-column, page break, list (bullet/ordered), indent/outdent,
  blockquote, superscript, subscript, strikethrough.
- **Tool keyboard shortcuts** — V/T/I/G/U/L/P/C without modifier.
- **Zoom controls** — Ctrl+Plus/Ctrl-Minus/Ctrl-0 to reset, plus
  in-ribbon zoom tools, status-bar zoom buttons, and zoom display.
- **4 zoom levels** (40%, 80%, 100%, 200%) with smooth transitions.
- **Persistence** — last saved time is tracked and shown in the
  status bar.

### Added (CSS)
- New dedicated stylesheet `src/renderer/styles/editor.css`.
- `.editor`, `.editor-menu`, `.editor-ribbon`, `.editor-ruler`,
  `.editor-main`, `.editor-rail`, `.editor-side`, `.editor-canvas`,
  `.editor-page-sheet`, `.editor-statusbar`.
- `.ribbon-group`, `.ribbon-group-title`, `.ribbon-tool` (with
  active/hover/disabled states).
- `.editor-tool` with shortcut badge.
- `.editor-side-tab`, `.editor-layer`, `.editor-outline-item`.
- `.editor-findbar` (sticky find/replace bar).
- `.margin-guide` (4 variants for top/bottom/left/right margin guides).
- `.editor-page-nav` (Prev/Next floating button).
- `[contenteditable]:hover` and `[contenteditable]:focus` (visual
  feedback for editable areas).
- Responsive: 3 breakpoints (1200px, 900px, 560px) shrink the ribbon,
  tool rail, and finally hide the side panel on mobile.

### Added (Icons)
- 15 new editor icons: `Strike`, `Super`, `Sub`, `Indent`,
  `Outdent`, `Columns`, `ColumnAdd`, `PageBreak`, `Ruler`,
  `FontSize`, `FontColor`, `Highlight`, `TextColor`, `Spacing`,
  `Increase`, `PageSize`.

### Added (tests)
- 3 new smoke tests: EditorPage ships a ribbon + 6 tabs + 8 page
  sizes + 8 fonts + 3 themes + ruler; editor.css has the full
  component + 3 responsive breakpoints; Icons.jsx exports
  15 new editor icons.
- **61 / 61 tests pass.**

### Verified
- `npm test` → **61 / 61 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200; HMR serving
  the new editor.

## 1.2.4 — 2026-10-06

**Full responsive audit.** The app now adapts cleanly from 320px
phones up to 4K displays. The big fix: at half-screen widths
(900-1399px), the inspector is now a **toggleable drawer** (Ctrl+.)
instead of always-on, so the main content has room to breathe on
laptop screens.

### Fixed
- **Inspector at half-screen (900-1399px) was eating too much space**
  — squeezed the main area to ~360px. Now the inspector is hidden by
  default and slides in as a right-side drawer when the user clicks
  the new Layers icon in the topbar. A semi-transparent backdrop
  appears behind the drawer; clicking it closes.
- **Inline 3-column grids in pages were hardcoded** — `HelpPage`,
  `NewDocPage`, `SpellCheckPage`, `ShortcutsPage`, `HomePage` all
  had `style={{ gridTemplateColumns: '240px minmax(0, 1fr) 320px' }}`
  which broke the responsive 2col/3col rules. Now CSS attribute
  selectors `div[style*="grid-template-columns: 240px"]` etc.
  collapse them to a single column at < 1200px.
- **Topbar overflowed on narrow screens** — text labels on tab names,
  Open/Save/PDF buttons, and even the search box were eating
  horizontal space. At < 1200px the labels hide, the search shrinks
  to 180px, and the avatar moves closer.
- **Statusbar was too long for half-screen** — the right-side credits
  and the language chip wrapped or pushed everything. Now the
  lesser-used status items (`Page N of N`, `Auto-save`, `UTF-8 · RTL`)
  hide at narrow widths.
- **Hero stats wrapped awkwardly on small viewports** — 4 stats
  became 2×2 at < 1200px instead of 4-across.

### Added
- **`Ctrl+.` keyboard shortcut** to toggle the inspector drawer.
- **Layers icon button** in the topbar that highlights when the
  inspector is open (`.active` state with primary-soft background).
- **Inspector backdrop** — semi-transparent dark overlay that closes
  the drawer on click.
- **`@media (prefers-reduced-motion: reduce)`** — disables all
  animations and transitions for users who request it.
- **`@media (max-height: 480px) and (max-width: 900px)`** — landscape
  phone mode: hides the statusbar, shrinks the hero, makes the
  bottom-bar room larger.
- **`half-screen` class on `.app-shell`** — programmatically applied
  when `isNarrow || (isWide && !isXWide)`, hides the 7th status item
  and switches hero stats to 2×2.
- **More explicit breakpoints** in `responsive.css`:
  - `< 560px` — tiny / mobile (bottom-sheet sidenav, mobile bottom bar)
  - `560-899px` — tablet (no activity bar, single-column sidenav)
  - `900-1199px` — narrow / half-screen at 1080p
  - `1200-1399px` — standard laptop / half-screen at 1440p (inspector = drawer)
  - `1400-1919px` — standard desktop (full inspector)
  - `≥ 1920px` — wide desktop (wide inspector, max-width 1600px content)
- **`div[style*="..."]` CSS overrides** for hardcoded inline 3-column
  grids on pages like HelpPage, NewDocPage, SpellCheckPage, ShortcutsPage.

### Added (tests)
- 3 new smoke tests: App.jsx inspector drawer + Ctrl+. binding;
  TopBar ships the inspector toggle button; responsive.css ships
  6 breakpoints + reduced-motion + landscape phones + inline-style
  collapse.
- **59 / 59 tests pass.**

### Verified
- `npm test` → **59 / 59 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200; HMR
  serving the new layout.

## 1.2.3 — 2026-10-06

**Collapsible sidebar with three modes.** The sidebar can now be in
"full" (default), "icon-only" (52px wide with hover tooltips), or
"hidden" (only the activity bar shows). Brand mark + collapse button
in the activity bar; Ctrl+B to cycle; state persisted to localStorage.

### Added (ActivityBar)
- **Brand mark button** at the top of the activity bar — clicking it
  toggles the sidebar. Has a tiny pulsing dot to show it's clickable.
- **Collapse button** (an arrow) beneath the brand mark — visible
  when the sidebar is visible. Clicking it cycles the sidebar mode.
- **Expand button** in the activity bar — only shown when the sidebar
  is hidden. Has a pulsing emerald ring animation to draw attention.
- `:active` scale-down (0.94) for tactile feedback.

### Added (SideNav)
- **Brand header** at the top of the full sidebar — UrduOfDani logo
  + "UrduOfDani" + "Urdu · Arabic · RTL" tagline.
- **Inline search** with a clear button (×) that appears when there's
  text. Has a focus ring and a sunken background.
- **Icon-only mode** — sidebar collapses to 52px wide, items become
  40×40 rounded buttons. Hovering an item reveals a dark tooltip with
  the item label (CSS-only, no JS).
- **Mini footer** in icon mode — just a green status dot, indicating
  "Offline ready".

### Added (App.jsx)
- `sidenavMode` state: `'full' | 'icon' | 'hidden'`.
- `cycleSidenav()` function that cycles the mode and persists it to
  `localStorage` under `uod:sidenavMode`.
- **Ctrl+B keyboard shortcut** to cycle.
- `app-shell` gets a `sidenav-{mode}` class so CSS can adjust the grid
  template (full = 240px sidebar, icon = 52px sidebar, hidden = no
  sidebar).
- `ActivityBar` now receives `sidenavMode` + `onToggleSidenav` props.
- `SideNav` now receives a `mode` prop.

### Added (CSS)
- `.activitybar-top` (flex column for brand + collapse).
- `.activitybar-brand` (40×40 button with hover scale + status dot).
- `.activitybar-collapse` (small arrow under the brand).
- `.activitybar-expand` (pulsing green ring, only when hidden).
- `.sidenav-brand` (logo + name + tagline block).
- `.sidenav-search` + `.sidenav-search-icon` + `.sidenav-search-input`
  + `.sidenav-search-clear` (full search input with focus ring).
- `.sidenav.sidenav-icon` (52px-wide icon mode).
- `.sidenav-icon .sidenav-item::after` (CSS-only hover tooltip with
  dark background and shadow).
- `.sidenav-icon .sidenav-footer-mini` (compact footer in icon mode).
- `.app-shell.sidenav-icon .app-shell-body` (52px column in icon mode).
- `@keyframes pulse` (1.5s ease-in-out infinite, used by `.activitybar-expand`).

### Added (Brand.jsx)
- The `mark` variant now uses the real UrduOfDani icon PNG (instead
  of a CSS gradient) so the brand mark in the activity bar is the
  actual logo, not a styled letter.

### Added (tests)
- 3 new smoke tests: ActivityBar ships a brand mark + collapse button;
  App.jsx supports sidebar collapse via Ctrl+B; SideNav supports
  icon-only mode with hover tooltips.
- **56 / 56 tests pass.**

### Verified
- `npm test` → **56 / 56 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200; HMR serving
  the new components.

## 1.2.2 — 2026-10-06

**Rich home dashboard.** The Home page is now a real dashboard with
greeting, quick stats, today's-focus callout, pinned documents, recent
activity timeline, clickable keyboard shortcuts, build-info footer,
and a fully animated gradient hero.

### Added (HomePage)
- **Animated gradient hero** with mesh background, animated glow, and
  radial gradients (Pakistani emerald → navy → gold).
- **Time-of-day greeting** that switches by hour in both English and
  Urdu (e.g. "Good afternoon, Dani" + "دوپہر بخیر", with a sun/moon
  emoji).
- **Live date/time + platform** in the top-right of the hero.
- **Hero status chips**: version (v1.2.2), channel (stable), live
  autosave count.
- **4-card stats row** at the bottom of the hero: Documents · Pages ·
  Pinned · Drafts (Drafts highlights in gold when there are unsaved
  drafts).
- **"Today's focus" callout** — a hero-coloured card that adapts:
  - If there are unsaved drafts → "Pick up where you left off" with
    a "Restore latest draft" button.
  - Else if there's a recent doc → "Continue with {name}" with an
    "Open" button.
- **Pinned documents section** — a row of pin-styled thumbs with
  per-card pin/unpin toggle. Pin state is persisted in
  `localStorage` under `uod.pinned`.
- **Recent activity timeline** — list of last 5 documents with
  coloured dot, language chip, and "open" arrow.
- **Clickable keyboard shortcuts** — 6 cards (New / Open / Save /
  Cmd-K / PDF / Settings) that actually trigger their action when
  clicked.
- **Tip-of-the-day card** in the right rail.
- **2-column bottom layout** — keyboard shortcuts (2-col grid) on the
  left, recovered-drafts + tip card stacked on the right.
- **Build-info footer** — `v1.2.2 · a37f41c · stable · © 2026
  Muhammad Danish [Dani] · DaniLabs · MIT — free for everyone` with
  GitHub + email links.
- **2 new template cards** (Travel Brochure, Restaurant Menu) for a
  total of 8 on the home page.
- **Better empty state** for the recent documents grid — different
  copy when the search returns nothing vs. when there are no docs at
  all.

### Added (CSS)
- `.hero` rich variant (`.hero-rich`, `.hero-pattern`,
  `.hero-pattern-mesh`, `.hero-pattern-grid`, `.hero-pattern-glow`,
  `.hero-greeting`, `.hero-stats`, `.hero-stat`).
- `.activity-row` + `.activity-dot` for the timeline.
- `.shortcut-card` for the clickable keyboard chips.
- `.grid-auto` now respects a `--min` CSS custom property so callers
  can override the column min-width inline.
- `@keyframes hero-glow` for the 8s animated glow.

### Added (tests)
- 2 new smoke tests: HomePage ships the rich dashboard markers; the
  HomePage supports pinned documents via `localStorage`.
- **53 / 53 tests pass.**

### Verified
- `npm test` → **53 / 53 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200; new HomePage
  served via HMR.

## 1.2.1 — 2026-10-06

**Polish every page.** 1.2.0 redid the chrome (TitleBar, TopBar, SideNav,
ActivityBar, CommandPalette, Onboarding, Inspector, 5 shell pages). 1.2.1
applies the same design system to the other 17 inner pages and replaces
every legacy CSS-var token with the new semantic aliases.

### Changed
- **17 inner pages converted to `<PageHeader />`** (SpellCheck, Shortcuts,
  Recovery, PagesManager, Tables, TextFlow, Contents, Styles, Fonts,
  FindReplace, Images, ColorsShapes, Shapes, Export, KeyboardPractice,
  UnicodeConverter, QR, Plugins, Performance, Masters). The legacy
  inline `<div className="page-header">…<h1>…</h1></div>` pattern is gone.
- **Legacy CSS tokens rewritten.** 22 files, 291 substitutions:
  - `--emerald-500/600/700/400` → `--color-primary` / `--color-primary-hover` / `--color-primary-active` / `--color-primary-soft`
  - `--navy-900/700/500` → `--color-text` / `--color-text-strong` / `--color-text-muted`
  - `--slate-*` → `--color-text-muted` / `--color-text-subtle` / `--color-border`
  - `--ivory-*` → `--color-bg-sunken` / `--color-border`
  - `--info-500/50`, `--warning-500/50`, `--danger-500/50` → `--color-info` / `--color-warning` / `--color-danger` (+ soft variants)
- **Icon library expanded** from 52 to ~100 entries (added Pointer,
  TextBox, Rect, Circle, Line, PenTool, StickyNote, Comment, Folder,
  File, PDF, NewFile, Export, RTL, LTR, List, ListOrdered, Quote,
  Video, Audio, Camera, Mic, Volume, Play, Pause, Stop, Filter, Sort,
  More, MoreV, Drag, Bell, Calendar, User, Users, Lock, Unlock, Power,
  Info, Warning, Error, StarOutline, GitHub, Send, External, Share,
  Copy, Cut, Paste, Undo, Redo, ZoomIn, ZoomOut, Pin, Tag, Bookmark,
  Flag, Bulb, Moon, Sun, …).
- **CommandPalette** now shows 5 result groups: Actions · Open
  documents · Recent documents · Settings · Pages & tools. Added 8 new
  commands (theme-light, theme-dark, templates, fonts, plugins, recovery,
  feedback, settings).
- **SpellCheckPage** redesigned with the new design system — proper
  PageHeader, three-column grid, live engine-status banner, RTL preview
  card, personal-dictionary chip list.
- **ShortcutsPage** redesigned with the new design system — full
  search/filter, two-column grid, real keyboard recording (press your
  new keys; conflict detection against every other command), preset
  schemes (UrduOfDani default, InPage, Word, Photoshop, Custom),
  import/export.

### Added
- **Three migration scripts** under `scripts/`:
  - `scripts/upgrade-pages.mjs` — replaces legacy `<div className="page-header">` blocks with `<PageHeader />` and adds the import.
  - `scripts/normalize-pages.mjs` — strips inline `padding: 32` from `.page` wrappers, strips inline `padding: '16px 32px'` from `.page-2col`/`.page-3col`, rewrites `<h2>+<p>` "section description" pairs into a consistent `<header>` block.
  - `scripts/migrate-vars.mjs` — maps legacy CSS tokens to new semantic aliases.
- **5 new smoke tests** (51 total, all green):
  - `Icons.jsx: ships a rich icon library (≥ 40 icons)` — spot-checks 10 critical icons.
  - `ActivityBar: groups all 7 views and binds Ctrl+1..6`.
  - `design system tokens: new semantic aliases are present`.
  - `component library: ships modern primitives`.
  - `all 23 inner pages use the new design system` — walks every page, asserts no legacy `<div className="page-header">`, no legacy CSS-var tokens, and that `PageHeader` is imported.

### Verified
- `npm test` → **51 / 51 pass**.
- `npm run build` → green.
- Live preview at `http://localhost:5173/` → HTTP 200.

## 1.2.0 — 2026-10-06

## 1.2.0 — 2026-10-06

**Major UX upgrade.** The whole shell — title bar, top bar, side nav,
command palette, command palette results, home dashboard, onboarding tour,
inspector, and 5 of the most-used pages (Home, New, Templates, Settings,
Help, Editor) — has been redesigned with inspiration from CorelDRAW,
Photoshop, VS Code, Word, Notion, Figma, and InPage.

### New design system
- **`src/renderer/styles/tokens.css`** rewritten. The new system has a
  Pakistani palette (navy + emerald + gold + ivory), a 4px-base spacing
  scale (`--sp-1`..`--sp-24`), 7 shape radii, 5 shadow levels, a
  full motion system (`--ease-out`, `--ease-bounce`, `--t-fast/med/slow`),
  and a dark theme that mirrors every token.
- **`src/renderer/styles/components.css`** rewritten with modern
  component primitives: `.btn-primary/secondary/ghost/danger` with
  `.btn-sm/lg/xl` modifiers, `.card-*` variants, `.chip-*` color
  variants, `.btn-group` (segmented), `.avatar-*`, `.kbd`, `.progress`,
  `.spinner`, `.tabs`, `.empty-state`, `.hero`, `.tpl-card`,
  `.doc-thumb`, `.cmdk`, `.toast`, `.toolbar`, `.statusbar`.
- **`src/renderer/styles/responsive.css`** rewritten. Breakpoints:
  < 560 / 560-899 / 900-1199 / 1200-1919 / 1920+. Each page reflows
  gracefully; the activity bar hides on phones (becomes a bottom bar);
  the side nav becomes a slide-in sheet; the inspector hides on
  narrow viewports.

### New components
- **`TitleBar.jsx`** — window chrome with app name, current doc name,
  and OS window controls (min / max / close).
- **`ActivityBar.jsx`** — VS Code–style vertical icon strip on the
  far left, with `Home / Edit / Review / Design / Insert / Publish /
  Settings` views. Each click is also bound to `Ctrl+1..6`.
- **`Inspector.jsx`** — Photoshop/Word–style right panel with
  tabbed sections (Page / Text / Object / Pages / Filters / Tip).
  Each tab renders real form controls.
- **`Onboarding.jsx`** — 5-step intro tour that fires on first launch
  (and on demand via the command palette). The user sees the popover
  over the app; "Skip" dismisses forever (saved in `localStorage`).
- **`PageHeader.jsx`** — uniform back / title / subtitle / actions
  header used by every inner page.
- **`CommandPalette`** rewritten with grouped results (Actions / Open
  documents / Pages & tools), real keyboard navigation (↑/↓/↵/Esc),
  footer with counts, and a rich empty state.

### Reworked pages
- **HomePage** — full redesign. Hero with the brand mark, value prop,
  and three big CTAs (New / Open / Quick start). Quick-start pills.
  Searchable recent-docs grid with proper thumbnails (one per kind:
  book, magazine, card, newsletter, etc). Visual template gallery.
  Recovered-drafts card (only if autosaves exist). Learn-the-basics
  tips grid.
- **NewDocPage** — type selector with mini preview swatches, form
  fields grouped into cards (Document / Page / Layout / Writing), a
  live page preview on the right.
- **TemplatesPage** — category filters, search, visual template
  gallery with 12 templates (Urdu Book, Editorial Magazine, Wedding
  Invitation, School Newsletter, Research Report, Poetry Collection,
  Event Poster, Tech Magazine, Business Card, Corporate News, Annual
  Report, Mosque Poster).
- **SettingsPage** — unified tabbed layout (General / Editing /
  Saving / Performance) using the new card + field + toggle pattern.
- **HelpPage** — sidebar of topics with search, guided-tutorial
  cards, popular-articles list, and a redesigned About card.
- **EditorPage** — full editor with menu bar, style toolbar, tool
  rail, page list, and zoomable canvas. All buttons restyled with
  the new `.toolbar-btn` and `.btn-group` primitives.
- **TopBar** — modernised with new doc tabs, real Ctrl+S/O/E/N
  shortcuts, language toggle, profile chip.
- **SideNav** — replaced with grouped sections (Create / Edit /
  Review / Design / Insert / Publish / Settings), each with a search
  input at the top. Backed by the new activity-bar view system.

### Store improvements
- `toast` action now queues toasts (up to 3 at once) with auto-dismiss
  after 4 s. The `Toast` component renders the queue with kind-coloured
  left borders (ok / warn / err / info).
- New reducer cases: `start-tour`, `end-tour` (persists `udani:tourDone`
  to localStorage), `dismiss-toast`, `set-doc` (replaces the active
  document body — fixes a regression in EditorPage), `mark-saved`
  (now also sets `lastSavedAt` for the status bar), `mark-dirty`,
  `open-doc-data` (load from a .udani / autosave).

### Audit / tests
- 2 stale smoke tests for the old responsive.css were updated to the
  new breakpoint / grid-helper conventions.
- 46/46 tests pass. `npm run audit` is clean.

## 1.1.8 — 2026-10-06

**White-screen fix.** The Electron app was launching but the renderer
displayed nothing because `App.jsx`, `HelpPage.jsx`, `PerformancePage.jsx`,
and `SettingsPage.jsx` all used `useState()` without importing it from
`react`. The component threw `ReferenceError: useState is not defined`
on the very first render, React bailed, and the user saw only the
title bar.

### Fixed
- `App.jsx` — added `useState` to the React import.
- `HelpPage.jsx` — added `useState` to the React import.
- `PerformancePage.jsx` — added `useState` to the React import.
- `SettingsPage.jsx` — added `useState` to the React import.

### Added
- **New regression test** in `tests/smoke.test.mjs` that walks every
  `.jsx` file under `src/renderer/` and fails if any React hook
  (`useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`,
  `useLayoutEffect`, `useReducer`, `useContext`, `useImperativeHandle`)
  is called without being imported from `react`. This is the kind of
  bug `npm test` cannot catch on its own; only a static check on
  every component file catches it.

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