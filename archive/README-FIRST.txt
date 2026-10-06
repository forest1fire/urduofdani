Continue upgrading UrduOfDani using the master prompt, existing source, and Interface Prompt Pack. One AI must handle core development, interface, integration, and testing.

First verify Stage 1 foundation fixes. If incomplete, finish them before proceeding. Use the latest working source throughout; do not restart from the original archive after each stage.

Preserve **Muhammad Danish [Dani] · DaniLabs** credit, existing documents, and working features.

## Stage 2 — Application shell and navigation

Implement the consistent navy, white, and emerald interface:
- Home, recent documents, New Document setup.
- Main editor with Write / Design / Print modes.
- Document tabs with independent state and unsaved-change handling.
- Contextual toolbar and selection-aware inspector.
- Urdu/English localization, light/dark/system themes.
- Focus mode, command search, keyboard access, and display scaling.

Connect controls through the Stage 1 editor command interface. Preserve cursor and selection when opening panels. Keep interface styling separate from document and export styling.

Do not display unsupported publishing modes as completed functionality.

## Stage 3 — Fonts, settings, shortcuts, and help

Implement separate pages for:
- Font import, search, favorites, live Urdu preview, default font, missing-font detection, and embedding status.
- Settings for language, theme, keyboard, autosave, and recovery.
- Custom shortcuts with conflict detection, reset, and import/export.
- Searchable help and About with creator credit and third-party notices.

Preserve existing font formats and keyboard features. Validate imported fonts and respect redistribution and embedding restrictions.

## Stage 4 — Self-contained plugin system

Implement the full plugin specification supplied in my plugin prompt.

Required user workflow:
**Download `.udaniplugin` from any website → Install in UrduOfDani → Use**

Provide file/drop installation, details, search, enable/disable, update, rollback, and uninstall. No end-user Python, Node.js, npm, pip, terminal commands, or account requirement.

Use a restricted versioned JavaScript API with validated messages, permissioned document access, previewed replacements, undoable edits, panels, commands, and error handling.

Validate archives and compatibility. Keep dependencies inside packages. Do not run installation scripts. Network access is disabled unless explicitly permitted.

Deliver the SDK and installable punctuation-fixer, diacritics-remover, and statistics plugins. Clearly handle migration of existing Python plugins.

## Stage 5 — Document model and real pagination

Design and implement the structured publishing model before adding page-dependent screens.

Support stable IDs for:
- Pages, sections, and masters.
- Text stories and linked frames.
- Images, shapes, tables, and layers.
- Styles and assets.

Migrate existing `.udani` documents without losing content or formatting. Preserve old-file compatibility through explicit version handling.

Implement real pagination and facing pages. Keep screen and export layout consistent. Continuous content with approximate page guides must not be presented as completed pagination.

## Stage 6 — Pages, frames, layers, and masters

Implement:
- Page Manager: add, duplicate, reorder, sections, numbering, export inclusion.
- Text frames and RTL-linked story flow.
- Overflow detection and link-cycle prevention.
- Layers, ordering, visibility, locks, grouping, and alignment.
- Master Pages: common headers, footers, margins, and automatic numbering.
- Guides and snapping.

Make document operations undoable. Verify no text is lost when resizing frames, changing page dimensions, or reordering pages.

## Stage 7 — Elements, images, shapes, and tables

Implement a drag-and-drop Elements panel with keyboard alternatives:
- Headings, Urdu text, frames, images, tables, shapes, dividers, captions, and page numbers.

Implement:
- Assets manager with import, previews, search, usage, and locate-on-page.
- Image crop, fit, aspect ratio, and text wrapping.
- Shapes with fill, border, dimensions, corners, opacity, and alignment.
- Document colors and reusable palettes.
- Tables with RTL order, rows/columns, merge/split, headers, padding, borders, and styles.

Reuse working insertion features where practical. Do not claim Elementor plugin compatibility.

## Stage 8 — Styles and book tools

Implement:
- Paragraph and character styles with inheritance and live preview.
- Document-wide style updates with undo.
- Heading-based Urdu table of contents.
- Accurate page-number updates after layout changes.
- Footnotes with references, navigation, and automatic numbering.

Test Urdu/English mixed content, long headings, multiple columns, and page transitions.

## Stage 9 — Language and editing tools

Implement or improve:
- Find/Replace with scope, whole words, result navigation, and undo.
- Verified phonetic and custom keyboard layouts.
- On-screen keyboard, symbols, diacritics, and typing preview.
- Existing smart Roman-Urdu and poetry tools.
- Spell-check suggestions, ignore, and personal dictionary.
- Unicode conversion with side-by-side preview.

Bundle a spelling word list only when its license permits redistribution. Do not claim grammar accuracy or legacy encoding support without verification. Do not invent proprietary `.inp` import.

## Stage 10 — Templates and saved blocks

Provide editable templates for books, magazines, posters, invitations, and poetry.

Include:
- Category search and previews.
- Page size and required-font information.
- Favorites.
- Save current layout as a template.
- Reusable saved blocks.

Using a template creates a new document and must not silently replace unsaved work.

## Stage 11 — Recovery, print, and export

Implement versioned recovery with previews and restoration into a separate copy.

Improve:
- PDF preview from the actual export path.
- Page ranges and pages/spreads.
- Image quality and licensed font embedding.
- Overflow, missing-font, and image checks.
- Printing and output selection.

Preserve TXT, HTML, and EPUB export. Validate EPUB before claiming standards compliance. Generate real QR codes and decode-test exported results.

## Stage 12 — Performance

Measure real behavior on a named Windows reference computer using 10-, 100-, and 500-page documents containing Urdu, English, images, fonts, tables, and columns.

Measure:
- Cold startup.
- Open and first usable view.
- Typing latency p50/p95.
- Scrolling and memory.
- Saving, recovery, PDF export.

Implement incremental layout, visible-page rendering, lazy thumbnails/assets, bounded caches, and background processing where appropriate.

Targets are goals, not guaranteed results:
- Startup ≤ 2 seconds.
- Typing p95 ≤ 16 ms.
- Open 100 pages ≤ 1 second.
- Export 100 pages to PDF ≤ 10 seconds.

Keep performance controls understandable and show only real diagnostics.

## Stage 13 — Final verification and delivery

Verify complete workflows, not only individual functions:
- Create → edit → save → reopen → export.
- Old-file migration and metadata preservation.
- Urdu selection, cursor, shaping, and mixed bidi text.
- Undo/redo across core tools and plugins.
- Recovery after interrupted writes.
- Font import and missing-font handling.
- Plugin install/update/rollback/removal.
- Page flow, masters, tables, contents, and footnotes.
- Windows installer, portable build, uninstall, and file associations.

Deliver:
- Updated source.
- Windows installer and portable build when supported.
- Plugin SDK and example packages.
- User guides and developer documentation.
- Changelog, feature-status list, and measured test results.

If GitHub write access is available, use focused commits on a feature branch, open a pull request, and merge within my authorization after required checks pass. Preserve unrelated changes. If access is unavailable, provide the files and identify the blocker.

## Rules for every stage

- Continue from the previous verified build.
- Keep a runnable checkpoint after each stage.
- Fix regressions before proceeding.
- Never replace real functionality with mockup behavior.
- Clearly label incomplete features.
- Never claim an unrun test, successful build, commit, or merge.
- Make routine implementation decisions autonomously.
- Ask only for information genuinely required to proceed.

Begin implementation now and proceed through the stages until the deliverables are complete.
Inspect ALL attached UrduOfDani interface images and my existing source code, then implement a coherent, working UI based on them.

Do not depend on an earlier ZIP, unavailable file paths, or images you cannot actually access.

## 1. Check every attachment

Create an inventory of every available image:
- Actual filename.
- Screen name and purpose.
- Main sections, navigation, controls, and layout.
- Whether it is a duplicate, earlier variation, or preferred reference.

Inspect images visually, not only by filename or OCR. If an image is unreadable or missing, identify it precisely. Continue work on available screens.

Do not claim to have reviewed an image you could not open.

## 2. Understand the complete interface structure

Group the screens into:
- Home and document creation.
- Writing and publishing editor.
- Pages, layers, frames, and master pages.
- Fonts, styles, keyboard, and language tools.
- Elements, images, tables, shapes, and colors.
- Plugins, templates, shortcuts, and settings.
- Recovery, print/export, performance, and help.

Map how users move between screens. Resolve duplicate designs into one consistent interface. Use the latest clearly identifiable reference; if ordering is unknown, explain your selection.

## 3. Build one consistent design system

Extract and standardize:
- Navy, emerald, white, and neutral colors.
- Typography, spacing, control sizes, borders, and corners.
- Icons, tabs, sidebars, dialogs, buttons, and inspectors.
- Loading, empty, disabled, error, and success states.
- Keyboard focus and accessible contrast.
- Urdu/English localization and RTL behavior.

Preserve **Muhammad Danish [Dani] · DaniLabs** credit.

Use the supplied approved logo/icon consistently. If unavailable, use a clearly identified temporary asset.

Correct mistakes in generated references, including Urdu spelling, keyboard mappings, page counts, duplicated controls, inconsistent selections, and contradictory status messages.

Do not reproduce mockup document text, photographs, or sample results as real user data.

## 4. Inspect the existing implementation

Before changing code, determine:
- Existing technology and application entry points.
- Working editor commands and services.
- Current document format and persistence.
- Available functionality behind each proposed control.
- Which features need new core implementation.

Preserve existing save/open, exports, fonts, typing, plugins, and document compatibility.

Use a shared command/state interface. Avoid duplicating editor logic inside individual screens. Keep interface CSS separate from document and print CSS.

## 5. Implement the UI

Build reusable components and implement the screens in a sensible order.

Connect every enabled button to a real operation. Preserve cursor position, selection, undo/redo, and document content when switching panels.

Use responsive desktop layouts, collapsible panels, suitable scrolling, and display scaling. Test smaller windows as well as large monitors.

When a reference shows a feature not supported by the current engine, either implement that capability or clearly disable the control. Do not simulate success or invent backend functionality.

Keep advanced tools available without crowding everyday editing.

## 6. Verify against the references and actual workflows

After each major screen:
- Capture a screenshot of the running application.
- Compare its structure, spacing, hierarchy, and controls with the reference.
- Fix clipping, overlap, unreadable text, and inconsistent styling.
- Exercise its real actions and persistence.
- Test Urdu and mixed Urdu/English content.
- Check keyboard navigation and selection preservation.

Real pagination, linked frames, and page management require a real document model; approximate visual page guides are not equivalent.

## 7. Deliver

Provide:
- Updated working source.
- Reference-image inventory and screen map.
- Reusable design system.
- Implemented/pending feature list.
- Actual application screenshots.
- Test results and remaining limitations.
- A runnable build when the environment supports it.

Start by inspecting the attached images and source, then implement. Do not stop at image analysis, a plan, or another static mockup.
