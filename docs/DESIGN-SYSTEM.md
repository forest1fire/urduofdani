# UrduOfDani Design System

> **Brand identity** — emerald pen (`#008F76` / `#14B89A`) on ivory / navy. Wordmark: **UrduOfDani** (emerald) + **CREATED BY DANI** (navy) + emerald underline. Source: `resources/logo-icon.svg` and `resources/logo-wordmark.svg`. The icon is bundled at `resources/icon.png` (1024×1024) and shipped in the Electron app.

A practical reference for every UI token, every component variant, and every interaction pattern used
in UrduOfDani. All tokens are mirrored in `src/renderer/styles/tokens.css` (the single source of truth).

## 1. Color tokens

### Brand
| Token | Hex | Use |
|---|---|---|
| `--navy-900`   | `#102A43` | Top bar, brand mark, headings |
| `--navy-700`   | `#243B53` | Hover for headings on light bg |
| `--navy-100`   | `#C2D3E2` | Disabled text on dark |
| `--emerald-500`| `#008F76` | Primary action, links, active row indicator |
| `--emerald-600`| `#00745F` | Hover for emerald |
| `--emerald-100`| `#D1F2EB` | Selected row, light bg of active tabs |
| `--emerald-50` | `#E7F8F4` | Subtle highlight band |
| `--gold-500`   | `#C69B47` | Decorative accent, hairlines on dark hero |
| `--ivory-50`   | `#F7F5EF` | Document paper color |

### Neutrals
| Token | Hex | Use |
|---|---|---|
| `--white`    | `#FFFFFF` | App surface, card bg |
| `--slate-50` | `#F8FAFC` | Page-level background |
| `--slate-100`| `#E2E8F0` | Dividers, control borders |
| `--slate-200`| `#CBD5E1` | Disabled bg |
| `--slate-300`| `#94A3B8` | Disabled fg |
| `--slate-500`| `#64748B` | Secondary text |
| `--slate-700`| `#334155` | Primary text |
| `--slate-900`| `#0F172A` | High-emphasis text |

### Status
| Token | Hex | Use |
|---|---|---|
| `--danger-500`  | `#C53030` | Error / overflow |
| `--warning-500` | `#D69E2E` | Conflict warning |
| `--info-500`    | `#3182CE` | Info / link |
| `--success-500` | `#008F76` | (alias for emerald) |

## 2. Typography

```
--font-ui:    "Inter", "Segoe UI", system-ui, -apple-system, "Noto Sans", sans-serif
--font-urdu:  "Noto Nastaliq Urdu", "Noto Naskh Arabic", "Geeza Pro", serif
--font-mono:  ui-monospace, SFMono-Regular, "JetBrains Mono", Consolas, monospace
```

Scale (rem, base 16):
```
--fs-12 0.75rem  micro / labels
--fs-14 0.875rem secondary body, table cells
--fs-16 1rem     primary body
--fs-18 1.125rem section headings
--fs-22 1.375rem card titles
--fs-28 1.75rem  page titles
--fs-36 2.25rem  hero
```

Weights: 400 regular, 500 medium, 600 semibold, 700 bold.
Letter-spacing: `-0.01em` on display sizes ≥ 22.

## 3. Spacing & shape

```
--space-1 4px  --space-2 8px  --space-3 12px --space-4 16px
--space-5 20px --space-6 24px --space-8 32px --space-10 40px
--radius-sm 4px  --radius-md 8px  --radius-lg 12px  --radius-xl 16px
```

## 4. Shadows

```
--shadow-sm  0 1px 2px rgba(16,42,67,.06)
--shadow-md  0 2px 8px rgba(16,42,67,.08)
--shadow-lg  0 8px 24px rgba(16,42,67,.12)
```

## 5. Component patterns

### Buttons
- **Primary**: emerald-500 fill, white text, hover emerald-600, radius 8, h 36, px 16.
- **Secondary**: white fill, slate-100 border, slate-700 text, hover slate-50.
- **Ghost**: transparent, slate-700 text, hover slate-50 bg.
- **Danger**: danger-500 fill (used only for destructive confirmations).

Sizes: sm 28, md 36, lg 44.

### Tabs
- Underline style with emerald-100 background on active.
- Pill tabs (for category chips) — emerald-100 fill, emerald-600 text when active.

### Cards
- White bg, slate-100 1px border, radius 12, shadow-sm.
- Hover: shadow-md + emerald-100 left border (when selectable).

### Form controls
- Inputs/selects: 36 high, slate-100 border, radius 8, slate-700 text, slate-50 bg.
- Focus: emerald-500 2px outline + 2px offset.
- Disabled: slate-100 bg, slate-300 text.

### Toggle (switch)
- Track 36×20, thumb 16×16, 2px gap.
- Off: slate-200 track, white thumb.
- On: emerald-500 track, white thumb (thumb translated to right).

### Stepper (numeric)
- 32 high, rounded, slate-100 border, focus on emerald, +/- on right.

### Slider
- Track 4 high, slate-100 inactive / emerald-500 active, thumb 16 emerald with white border.

### Right-rail inspector
- White bg, slate-100 left border.
- Sections separated by 16px padding, label navy-900 14/600, value slate-700 14.

### Status pill
- Small pill: emerald-50 bg + emerald-600 text for "Saved", slate-50 + slate-500 for unsaved.

## 6. Shell layout

```
┌──────────────────────────────────────────────────────────────┐
│ TopBar (navy-900, h 48, white logo + tabs + ⌘K + controls)   │
├──────┬──────────────────────────────────────┬────────────────┤
│      │                                      │                │
│ Side │   Main work area                     │   Inspector    │
│ nav  │   (white, scrollable)                │   (white,      │
│ 56   │                                      │    collapsible │
│ wide │                                      │    sections)   │
│      │                                      │                │
└──────┴──────────────────────────────────────┴────────────────┘
```

The Home screen collapses the inspector; modals appear centered with `--shadow-lg`.

## 7. RTL & Urdu rendering

- App `dir="ltr"` by default; content panes (editors, ToC, spell-check list) flip to `dir="rtl"` when
  the active language is Urdu.
- Urdu text uses `--font-urdu`.
- Mixed bidi: rely on browser bidi; never hard-code `rtl` on labels (English UI labels stay English).

## 8. Motion

- Hover: 120 ms ease-out.
- Modal: 180 ms ease-out (0.96 → 1, fade 0 → 1).
- No animations longer than 250 ms.

## 9. Accessibility

- Contrast ≥ 4.5:1 on all text; emerald-500 on white is 4.7:1.
- Focus ring always visible (emerald 2px + 2px offset, never removed).
- All buttons reachable by Tab; dialogs trap focus and restore it on close.
- Screen-reader labels on icon-only buttons (`aria-label`).