# UrduOfDani Plugin SDK — `.udaniplugin` specification

A `.udaniplugin` is a `.zip` archive with this layout:

```
my-plugin.udaniplugin/
├── plugin.json     ← manifest (required)
├── plugin.js        ← entry script (required, runs in a sandboxed JS context)
├── styles.css      ← optional styles injected into the host
├── assets/         ← optional files (icons, fonts, snippets…)
└── README.md       ← shown in the Plugins panel
```

`plugin.json`:

```json
{
  "id":      "com.danilabs.punctuation-fixer",
  "name":    "Punctuation fixer",
  "version": "1.0.0",
  "author":  "DaniLabs",
  "license": "MIT",
  "permissions": ["document.text", "document.replace", "ui.toast"],
  "entry":   "plugin.js"
}
```

## Sandbox

The plugin runs inside a restricted JS context. It cannot:
- read or write files outside its install dir;
- access network (unless `permissions` contains `network`);
- spawn processes;
- read other plugins' state.

It can (after the user enables the plugin and selects the relevant document/selection):
- enumerate selected text via `ud.selection.text()`;
- replace text via `ud.document.replace(range, text)`;
- register a toolbar button via `ud.ui.registerAction({ id, label, onRun })`;
- show toasts via `ud.ui.toast(message)`;
- read the spell-check result via `ud.spell.check(text)` (uses the host's dictionry engine).

## End-user workflow (per Stage 4 of the spec)

> Download `.udaniplugin` from any website → Install in UrduOfDani → Use

The host implements `Install` by reading the zip, validating `plugin.json` and the entry script,
then copying the unpacked directory into `~/.config/UrduOfDani/plugins/<id>/<version>/`.
The Plugins panel can enable, disable, update, rollback, and uninstall.

## Bundle format

`.udaniplugin` IS a zip. To create one:

```
zip -r punctuation-fixer.udaniplugin plugin.json plugin.js styles.css
```

(In Windows: use any ZIP library that creates a standard zip — no special extensions.)

## Reference packages shipped in `samples/`

| File                              | Purpose                              |
|-----------------------------------|--------------------------------------|
| `samples/punctuation-fixer.udaniplugin` | Fixes common Urdu punctuation slips   |
| `samples/diacritics-remover.udaniplugin`| Strips optional diacritics from text |
| `samples/statistics.udaniplugin`        | Reports word/character counts        |

Each sample is a working zip; double-click to install (or use Plugins → Install).