import React, { useMemo, useState } from 'react';
import { useStore } from '../store/Store.jsx';

const COMMANDS = [
  { id: 'home',      label: 'Go to Home',                shortcut: 'Alt + H',  route: 'home' },
  { id: 'new',       label: 'New document',              shortcut: 'Ctrl + N', route: 'new' },
  { id: 'open',      label: 'Open document…',            shortcut: 'Ctrl + O', action: 'open' },
  { id: 'save',      label: 'Save',                      shortcut: 'Ctrl + S', action: 'save' },
  { id: 'find',      label: 'Find & replace',            shortcut: 'Ctrl + F', route: 'find' },
  { id: 'spell',     label: 'Spell check',               shortcut: 'F7',       route: 'spell' },
  { id: 'fonts',     label: 'Manage fonts',              shortcut: '',         route: 'fonts' },
  { id: 'templates', label: 'Browse templates',          shortcut: '',         route: 'templates' },
  { id: 'pages',     label: 'Page manager',              shortcut: '',         route: 'pages' },
  { id: 'masters',   label: 'Master pages',              shortcut: '',         route: 'masters' },
  { id: 'flow',      label: 'Text flow',                 shortcut: '',         route: 'textflow' },
  { id: 'contents',  label: 'Contents & footnotes',      shortcut: '',         route: 'contents' },
  { id: 'styles',    label: 'Document styles',           shortcut: '',         route: 'styles' },
  { id: 'colors',    label: 'Colors & shapes',           shortcut: '',         route: 'colors' },
  { id: 'shapes',    label: 'Shape builder',             shortcut: '',         route: 'shapes' },
  { id: 'images',    label: 'Images & assets',           shortcut: '',         route: 'images' },
  { id: 'tables',    label: 'Tables',                    shortcut: '',         route: 'tables' },
  { id: 'export',    label: 'Export PDF',                shortcut: 'Ctrl + E', route: 'export' },
  { id: 'print',     label: 'Print',                     shortcut: 'Ctrl + P', route: 'export' },
  { id: 'keyboard',  label: 'Urdu keyboard practice',    shortcut: '',         route: 'keyboard' },
  { id: 'unicode',   label: 'Unicode converter',         shortcut: '',         route: 'unicode' },
  { id: 'qr',        label: 'QR code generator',         shortcut: '',         route: 'qr' },
  { id: 'recovery',  label: 'Document recovery',         shortcut: '',         route: 'recovery' },
  { id: 'shortcuts', label: 'Keyboard shortcuts',        shortcut: '',         route: 'shortcuts' },
  { id: 'plugins',   label: 'Plugins',                   shortcut: '',         route: 'plugins' },
  { id: 'settings',  label: 'Settings',                  shortcut: 'Ctrl + ,', route: 'settings' },
  { id: 'perf',      label: 'Performance',               shortcut: '',         route: 'performance' },
  { id: 'help',      label: 'Help & about',              shortcut: 'F1',       route: 'help' },
  { id: 'toggle-theme', label: 'Toggle theme (Light/Dark)', shortcut: '',     action: 'theme' },
];

export default function CommandPalette() {
  const { state, dispatch } = useStore();
  const [idx, setIdx] = useState(0);

  const filtered = useMemo(() => {
    const q = state.cmdPalette.query.trim().toLowerCase();
    return COMMANDS.filter(c => !q || c.label.toLowerCase().includes(q));
  }, [state.cmdPalette.query]);

  if (!state.cmdPalette.open) return null;

  const run = (c) => {
    if (c.route) dispatch({ type: 'set-route', route: c.route });
    else if (c.action === 'theme') dispatch({ type: 'set-theme', theme: state.theme === 'light' ? 'dark' : 'light' });
    else if (c.action === 'save') dispatch({ type: 'toast', t: 'Saved ✓' });
    dispatch({ type: 'close-cmd' });
    setIdx(0);
  };

  return (
    <div className="cmd-backdrop-overlay" onClick={() => dispatch({ type: 'close-cmd' })}>
      <div className="cmd-box" onClick={e => e.stopPropagation()}>
        <input className="cmd-input" autoFocus
               placeholder="Type a command or search…"
               onChange={(e) => { dispatch({ type: 'cmd-query', q: e.target.value }); setIdx(0); }}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(Math.min(idx + 1, filtered.length - 1)); }
                 if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx(Math.max(idx - 1, 0)); }
                 if (e.key === 'Enter' && filtered[idx]) run(filtered[idx]);
               }} />
        <div className="cmd-list">
          {filtered.length === 0 && <div className="cmd-row"><span className="label">No results.</span></div>}
          {filtered.map((c, i) => (
            <div key={c.id} className={`cmd-row${i === idx ? ' active' : ''}`}
                 onMouseEnter={() => setIdx(i)} onClick={() => run(c)}>
              <span className="label">{c.label}</span>
              {c.shortcut && <span className="shortcut">{c.shortcut}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}