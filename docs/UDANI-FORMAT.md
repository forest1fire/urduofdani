# `.udani` document format

`.udani` files are JSON documents with versioned structure. The current format is `1.0`.

```json
{
  "format":    "urduofdani.document",
  "version":   1,
  "created":   "2026-10-06T10:00:00Z",
  "modified":  "2026-10-06T10:30:00Z",
  "creator":   "UrduOfDani 1.0.0",
  "doc": {
    "id":        "abc123",
    "name":      "Magazine",
    "language":  "urdu",
    "direction": "rtl",
    "size":      { "w": 210, "h": 297, "unit": "mm" },
    "margins":   { "top": 20, "bottom": 20, "inside": 20, "outside": 20 },
    "facing":    true,
    "columns":   1
  },
  "pages": [
    {
      "id":      "p1",
      "index":   1,
      "master":  "A",
      "section": "main",
      "include": true,
      "frames":  [
        { "id": "f1", "type": "text",  "x": 20, "y": 20, "w": 80, "h": 240, "story": "s1", "style": "body" },
        { "id": "f2", "type": "text",  "x": 110, "y": 20, "w": 80, "h": 240, "story": "s1", "style": "body" },
        { "id": "f3", "type": "image", "x": 30, "y": 30, "w": 60, "h": 40, "asset": "a1" }
      ]
    }
  ],
  "masters": [
    { "id": "A", "name": "Magazine", "facing": true, "headerText": "اردو", "footerMode": "auto-page-number" }
  ],
  "stories": [
    { "id": "s1", "frames": ["f1", "f2"], "direction": "rtl", "runs": [
      { "kind": "para", "style": "title", "text": "اردو کی خوبصورتی" },
      { "kind": "para", "style": "body",  "text": "یہ ایک نمونہ متن ہے…" }
    ]}
  ],
  "styles": [
    { "id": "body",  "font": "Noto Nastaliq Urdu", "size": 14, "direction": "rtl" },
    { "id": "title", "font": "Noto Nastaliq Urdu", "size": 28, "direction": "rtl", "alignment": "center" }
  ],
  "assets": [
    { "id": "a1", "kind": "image", "name": "Mountain.jpg", "w": 2400, "h": 1600 }
  ]
}
```

## Validation rules (Stages 5 & 6)

1. `format` must be `"urduofdani.document"` and `version` must be ≤ current.
2. Every `pages[].frames[].id` must be unique within its page; frame ids must be unique across the document.
3. Every `stories[].frames[]` must reference existing frames.
4. Cycle detection: a story must not form a loop (frame A → frame B → frame A).
5. `master`, `style`, `asset` ids referenced anywhere must exist.
6. Image assets may be inlined (base64) or referenced by relative path; on open, missing references are reported, not silently dropped.

## Migration

Older formats (`"version": 0` legacy) load with a best-effort converter that wraps the entire body in a single story and two facing pages.

## Why JSON?

- Diffable in version control.
- Inspectable with `cat`/`jq`.
- Easy to add fields without breaking parsers (forward compatibility).
- Lossless round-trip with the editor (which is what a publishing tool needs).