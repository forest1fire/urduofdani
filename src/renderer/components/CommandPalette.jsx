import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';
import { useDocActions } from '../lib/useDocActions.js';

/**
 * CommandPalette — the global ⌘K launcher.
 * Groups:
 *   - Actions:    save, open, export, theme toggle, language toggle, new
 *   - Documents:  every open document (switch)
 *   - Tools:      every page in the app (jump to)
 *   - Help:       search help topics
 */
const ACTIONS = [
  { id: 'a-new',      label: 'New blank document',       sub: 'A4',  Icon: Icon.Plus,     shortcut: 'Ctrl+N', run: ({ newDoc }) => newDoc('Untitled', {}) },
  { id: 'a-open',     label: 'Open .udani file…',        sub: 'File',Icon: Icon.Upload,   shortcut: 'Ctrl+O', run: ({ openFile }) => openFile() },
  { id: 'a-save',     label: 'Save',                     sub: 'Save current document',Icon: Icon.Download, shortcut: 'Ctrl+S', run: ({ save }) => save() },
  { id: 'a-pdf',      label: 'Export as PDF…',           sub: 'PDF',Icon: Icon.Print,    shortcut: 'Ctrl+E', run: ({ exportPdf }) => exportPdf() },
  { id: 'a-home',     label: 'Go to Home',               sub: 'Dashboard',         Icon: Icon.Home,    shortcut: 'Ctrl+1', run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'home' }) },
  { id: 'a-editor',   label: 'Open the editor',          sub: 'Work on a document',Icon: Icon.Edit,    shortcut: 'Ctrl+2', run: ({ dispatch, state }) => state.activeDocId ? null : null },
  { id: 'a-theme',    label: 'Toggle light / dark theme',sub: 'Appearance',        Icon: Icon.Sparkle,             run: ({ state, dispatch }) => dispatch({ type: 'set-theme', theme: state.theme === 'dark' ? 'light' : 'dark' }) },
  { id: 'a-theme-l',  label: 'Use light theme',          sub: 'Appearance',        Icon: Icon.Sun,                 run: ({ dispatch }) => dispatch({ type: 'set-theme', theme: 'light' }) },
  { id: 'a-theme-d',  label: 'Use dark theme',           sub: 'Appearance',        Icon: Icon.Moon,                run: ({ dispatch }) => dispatch({ type: 'set-theme', theme: 'dark' }) },
  { id: 'a-lang',     label: 'Toggle language',          sub: 'EN / اردو',         Icon: Icon.Globe,              run: ({ state, dispatch }) => dispatch({ type: 'set-lang', lang: state.lang === 'en' ? 'ur' : 'en' }) },
  { id: 'a-help',     label: 'Open Help',                sub: 'Guides, search, contact',Icon:Icon.Help,  shortcut: 'F1',    run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'help' }) },
  { id: 'a-settings', label: 'Open Settings',            sub: 'App preferences',   Icon: Icon.Settings,shortcut: 'Ctrl+,', run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'settings' }) },
  { id: 'a-tour',     label: 'Start onboarding tour',    sub: '4-step intro',      Icon: Icon.Sparkle,             run: ({ dispatch }) => dispatch({ type: 'start-tour' }) },
  { id: 'a-templates',label: 'Browse templates',         sub: '12 ready-made designs', Icon: Icon.Tiles,           run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'templates' }) },
  { id: 'a-fonts',    label: 'Manage fonts',             sub: 'Add Urdu / Arabic fonts',Icon: Icon.Type,            run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'fonts' }) },
  { id: 'a-plugins',  label: 'Open Plugins',             sub: '.udaniplugin packages',Icon: Icon.Plug,              run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'plugins' }) },
  { id: 'a-recovery', label: 'Document recovery',        sub: 'Restore autosaved work',Icon: Icon.Recovery,         run: ({ dispatch }) => dispatch({ type: 'set-route', route: 'recovery' }) },
  { id: 'a-feedback', label: 'Send feedback',            sub: 'hello.danilabs@gmail.com',Icon:Icon.Mail,              run: () => window.open('mailto:hello.danilabs@gmail.com?subject=UrduOfDani%20feedback', '_blank') },
];

const TOOLS = [
  { route: 'home',        label: 'Home',            Icon: Icon.Home,      group: 'Navigate' },
  { route: 'new',         label: 'New document',    Icon: Icon.Plus,      group: 'Create'   },
  { route: 'templates',   label: 'Templates',       Icon: Icon.Tiles,     group: 'Create'   },
  { route: 'recovery',    label: 'Document recovery',Icon: Icon.Recovery, group: 'Create'   },
  { route: 'editor',      label: 'Editor',          Icon: Icon.Edit,      group: 'Edit'     },
  { route: 'pages',       label: 'Page manager',    Icon: Icon.Doc,       group: 'Edit'     },
  { route: 'textflow',    label: 'Text flow',       Icon: Icon.Link,      group: 'Edit'     },
  { route: 'find',        label: 'Find & replace',  Icon: Icon.Search,    group: 'Edit'     },
  { route: 'spell',       label: 'Spell-check',     Icon: Icon.Check,     group: 'Review'   },
  { route: 'masters',     label: 'Master pages',    Icon: Icon.Layers,    group: 'Design'   },
  { route: 'contents',    label: 'Contents & footnotes',Icon: Icon.Book,  group: 'Design'   },
  { route: 'styles',      label: 'Document styles', Icon: Icon.Cog,       group: 'Design'   },
  { route: 'fonts',       label: 'Fonts',           Icon: Icon.Type,      group: 'Design'   },
  { route: 'colors',      label: 'Colors',          Icon: Icon.Color,     group: 'Design'   },
  { route: 'shapes',      label: 'Shape builder',   Icon: Icon.Shapes,    group: 'Design'   },
  { route: 'images',      label: 'Images & assets', Icon: Icon.Image,     group: 'Insert'   },
  { route: 'tables',      label: 'Tables',          Icon: Icon.Table,     group: 'Insert'   },
  { route: 'qr',          label: 'QR generator',    Icon: Icon.QR,        group: 'Insert'   },
  { route: 'unicode',     label: 'Unicode converter',Icon: Icon.Refresh,  group: 'Insert'   },
  { route: 'keyboard',    label: 'Urdu keyboard',   Icon: Icon.Keyboard,  group: 'Insert'   },
  { route: 'export',      label: 'Export & print',  Icon: Icon.Print,     group: 'Publish'  },
  { route: 'plugins',     label: 'Plugins',         Icon: Icon.Plug,      group: 'Settings' },
  { route: 'settings',    label: 'Settings',        Icon: Icon.Settings,  group: 'Settings' },
  { route: 'performance', label: 'Performance',     Icon: Icon.Sparkle,   group: 'Settings' },
  { route: 'help',        label: 'Help & about',    Icon: Icon.Help,      group: 'Settings' },
  { route: 'shortcuts',   label: 'Keyboard shortcuts',Icon:Icon.Keyboard, group: 'Settings' },
];

export default function CommandPalette() {
  const { state, dispatch } = useStore();
  const { save, openFile, exportPdf, newDoc } = useDocActions();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const open = state.cmdOpen;

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Build results
  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const ctx = { dispatch, state, save, openFile, exportPdf, newDoc };

    // Actions
    const actions = ACTIONS.filter(a => !ql || a.label.toLowerCase().includes(ql) || a.sub.toLowerCase().includes(ql))
      .map(a => ({ ...a, group: 'Action', onRun: () => { a.run(ctx); dispatch({ type: 'close-cmd' }); } }));

    // Open documents
    const docs = state.openDocs.map(d => {
      const doc = state.documents.find(x => x.id === d.id);
      if (!doc) return null;
      return {
        id: 'd-' + d.id,
        label: doc.name,
        sub: doc.kind ? doc.kind[0].toUpperCase() + doc.kind.slice(1) : 'Document',
        Icon: Icon.Doc,
        group: 'Open document',
        onRun: () => { dispatch({ type: 'select-doc', id: d.id }); dispatch({ type: 'close-cmd' }); },
      };
    }).filter(Boolean).filter(d => !ql || d.label.toLowerCase().includes(ql));

    // Recent documents (all known docs, but capped)
    const recents = state.documents.slice(0, 8).map(doc => ({
      id: 'r-' + doc.id,
      label: doc.name,
      sub: `${doc.kind || 'document'} · ${doc.lastOpened}`,
      Icon: Icon.Clock,
      group: 'Recent documents',
      onRun: () => { dispatch({ type: 'open-doc', id: doc.id }); dispatch({ type: 'close-cmd' }); },
    })).filter(d => !ql || d.label.toLowerCase().includes(ql) || d.sub.toLowerCase().includes(ql));

    // Settings
    const settingHits = ql ? [
      { id: 's-theme',     label: 'Change theme',                  sub: 'Settings → General → Theme',         Icon: Icon.Sparkle,  group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'settings' }); dispatch({ type: 'close-cmd' }); } },
      { id: 's-font',      label: 'Default Urdu font',              sub: 'Settings → General → Default font',  Icon: Icon.Type,     group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'fonts' }); dispatch({ type: 'close-cmd' }); } },
      { id: 's-scale',     label: 'UI scale',                      sub: 'Settings → General → UI scale',      Icon: Icon.Plus,     group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'settings' }); dispatch({ type: 'close-cmd' }); } },
      { id: 's-autosave',  label: 'Autosave settings',             sub: 'Settings → Saving',                   Icon: Icon.Download, group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'settings' }); dispatch({ type: 'close-cmd' }); } },
      { id: 's-perf',      label: 'Performance settings',          sub: 'Settings → Performance',              Icon: Icon.Sparkle,  group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'performance' }); dispatch({ type: 'close-cmd' }); } },
      { id: 's-shortcuts', label: 'Keyboard shortcuts',            sub: 'Customize Ctrl+S, Ctrl+K, etc.',      Icon: Icon.Keyboard, group: 'Settings',   onRun: ({ dispatch }) => { dispatch({ type: 'set-route', route: 'shortcuts' }); dispatch({ type: 'close-cmd' }); } },
    ].filter(s => s.label.toLowerCase().includes(ql) || s.sub.toLowerCase().includes(ql)) : [];

    // Tools
    const tools = TOOLS.filter(t => !ql || t.label.toLowerCase().includes(ql))
      .map(t => ({ ...t, sub: t.group, onRun: () => { dispatch({ type: 'set-route', route: t.route }); dispatch({ type: 'close-cmd' }); } }));

    return { actions, docs, recents, settings: settingHits, tools, total: actions.length + docs.length + recents.length + settingHits.length + tools.length };
  }, [q, state, dispatch, save, openFile, exportPdf, newDoc]);

  // Flat list for keyboard nav
  const flat = [...results.actions, ...results.docs, ...results.recents, ...results.settings, ...results.tools];

  // Clamp active index
  useEffect(() => {
    if (active >= flat.length) setActive(Math.max(0, flat.length - 1));
  }, [flat.length, active]);

  // Scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); dispatch({ type: 'close-cmd' }); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(flat.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[active];
      if (r) r.onRun();
    }
  };

  return (
    <div className="cmdk-backdrop" onClick={() => dispatch({ type: 'close-cmd' })} role="dialog" aria-label="Command palette">
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Type a command, document name, or page…"
          value={q}
          onChange={e => { setQ(e.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          aria-label="Command palette input"
        />
        <div className="cmdk-list" ref={listRef}>
          {results.total === 0 ? (
            <div className="cmdk-empty">
              <Icon.Search style={{ width: 32, height: 32, marginBottom: 8, opacity: 0.4 }} />
              <div>No results for &ldquo;{q}&rdquo;</div>
              <div className="text-sm mt-2">Try: <kbd>new</kbd>, <kbd>save</kbd>, <kbd>export</kbd>, <kbd>help</kbd>, <kbd>theme</kbd>, <kbd>font</kbd></div>
            </div>
          ) : (
            <>
              {results.actions.length > 0 && (
                <Group title="Actions">
                  {results.actions.map((r, i) => (
                    <Item key={r.id} r={r} index={i} active={active === i} onRun={r.onRun} setActive={setActive} />
                  ))}
                </Group>
              )}
              {results.docs.length > 0 && (
                <Group title="Open documents">
                  {results.docs.map((r, i) => (
                    <Item key={r.id} r={r} index={results.actions.length + i} active={active === results.actions.length + i} onRun={r.onRun} setActive={setActive} />
                  ))}
                </Group>
              )}
              {results.recents.length > 0 && (
                <Group title="Recent documents">
                  {results.recents.map((r, i) => (
                    <Item key={r.id} r={r} index={results.actions.length + results.docs.length + i} active={active === results.actions.length + results.docs.length + i} onRun={r.onRun} setActive={setActive} />
                  ))}
                </Group>
              )}
              {results.settings.length > 0 && (
                <Group title="Settings & preferences">
                  {results.settings.map((r, i) => (
                    <Item key={r.id} r={r} index={results.actions.length + results.docs.length + results.recents.length + i} active={active === results.actions.length + results.docs.length + results.recents.length + i} onRun={r.onRun} setActive={setActive} />
                  ))}
                </Group>
              )}
              {results.tools.length > 0 && (
                <Group title="Pages & tools">
                  {results.tools.map((r, i) => (
                    <Item key={r.id} r={r} index={results.actions.length + results.docs.length + results.recents.length + results.settings.length + i} active={active === results.actions.length + results.docs.length + results.recents.length + results.settings.length + i} onRun={r.onRun} setActive={setActive} />
                  ))}
                </Group>
              )}
            </>
          )}
        </div>
        <div className="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
          <span className="spacer" />
          <span>{flat.length} result{flat.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div>
      <div className="cmdk-group-title">{title}</div>
      {children}
    </div>
  );
}

function Item({ r, index, active, onRun, setActive }) {
  return (
    <div className={`cmdk-item${active ? ' active' : ''}`}
         data-active={active}
         onClick={onRun}
         onMouseEnter={() => setActive(index)}
         role="option" aria-selected={active}>
      <r.Icon className="icon" />
      <span className="label">{r.label}</span>
      <span className="sub">{r.sub}</span>
      {r.shortcut && <span className="shortcut">{r.shortcut}</span>}
    </div>
  );
}
