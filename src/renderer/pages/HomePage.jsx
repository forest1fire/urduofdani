import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import Brand from '../components/Brand.jsx';
import { useDocActions } from '../lib/useDocActions.js';
import { listAutosaves, loadAutosave, clearAutosaves } from '../lib/document.js';

/**
 * HomePage — the landing dashboard.
 *
 * Inspired by:
 *   - CorelDRAW's recent files grid + thumbnails
 *   - Word's "Tell me what you want to do" search bar
 *   - Photoshop's welcome / learn / open recent pattern
 *   - Figma's "New file" + "Drafts" + "Recents"
 *   - Notion's clean sidebar with pinned pages
 *   - VS Code's stats / quick-pick / activity timeline
 *
 * Sections (in order):
 *   1. Hero — animated background, greeting, two big CTAs, quick-stats row
 *   2. Quick start pills + keyboard shortcut hints
 *   3. "Today's focus" — context card (e.g. autosave reminder, last edited)
 *   4. Recents — searchable grid of document thumbnails
 *   5. Pinned — small, pin-styled row of favourite docs
 *   6. Templates — visual template gallery
 *   7. Activity timeline — recent actions from localStorage
 *   8. Recovered drafts — only if any
 *   9. Learn / Tips
 *  10. Footer build / git / license info
 */

const TIPS = [
  { title: 'Press ⌘K any time',     body: 'The command palette is the fastest way to do anything — new, open, save, export, jump to a page.', Icon: Icon.Sparkle },
  { title: 'Live spell-check',       body: 'Type in Urdu and see spelling suggestions in real time. The vendored engine knows 15,848 words.', Icon: Icon.Check },
  { title: 'Offline first',          body: 'Your documents stay on your device. No account, no cloud, no network required.', Icon: Icon.Help_O },
  { title: 'Auto-save every 2 min',  body: 'We snapshot your work automatically. Find drafts in the right panel or under "Document recovery".', Icon: Icon.Recovery },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'N'],     label: 'New document',     action: 'new'  },
  { keys: ['Ctrl', 'O'],     label: 'Open .udani',      action: 'open' },
  { keys: ['Ctrl', 'S'],     label: 'Save',             action: 'save' },
  { keys: ['Ctrl', 'K'],     label: 'Command palette',  action: 'cmd'  },
  { keys: ['Ctrl', 'E'],     label: 'Export PDF',       action: 'pdf'  },
  { keys: ['Ctrl', ','],     label: 'Settings',         action: 'set'  },
];

const TEMPLATES_HOME = [
  { id: 't1', title: 'Urdu Book',           sub: 'A clean, elegant book layout',          bg: 'linear-gradient(135deg,#F7F5EF,#EFEBDF)', fg: '#102A43', tag: 'A5',  dir: 'rtl', kind: 'book',       titleUrdu: 'اردو کتاب', accent: '#C69B47' },
  { id: 't2', title: 'Editorial Magazine',  sub: 'For articles, columns and features',   bg: 'linear-gradient(135deg,#102A43,#1E3A5F)', fg: '#F7F5EF', tag: 'A4',  dir: 'rtl', kind: 'magazine',   titleUrdu: 'اداری مجلہ', accent: '#C69B47' },
  { id: 't3', title: 'Wedding Invitation',  sub: 'A graceful invitation design',         bg: 'linear-gradient(135deg,#FBF3E1,#F5E5BD)', fg: '#102A43', tag: 'A5',  dir: 'rtl', kind: 'card',       titleUrdu: 'شادی کی دعوت', accent: '#C69B47' },
  { id: 't4', title: 'School Newsletter',   sub: '4-page A4 newsletter for schools',     bg: 'linear-gradient(135deg,#E7F8F4,#A5E5D6)', fg: '#102A43', tag: 'A4',  dir: 'ltr', kind: 'newsletter', titleUrdu: 'School Newsletter', accent: '#008F76' },
  { id: 't5', title: 'Research Report',     sub: 'Title page + body + bibliography',     bg: 'linear-gradient(135deg,#FFFFFF,#F8FAFC)', fg: '#0F172A', tag: 'A4',  dir: 'ltr', kind: 'book',       titleUrdu: 'Research Report', accent: '#0F172A' },
  { id: 't6', title: 'Poetry Collection',   sub: 'A beautiful layout for Urdu poetry',   bg: 'linear-gradient(135deg,#FED7D7,#FBF3E1)', fg: '#102A43', tag: 'A5',  dir: 'rtl', kind: 'book',       titleUrdu: 'شعری مجموعہ', accent: '#C53030' },
  { id: 't7', title: 'Travel Brochure',     sub: 'Tri-fold, image-rich, RTL-ready',      bg: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)', fg: '#0F172A', tag: 'A4',  dir: 'ltr', kind: 'magazine',   titleUrdu: 'سفری بروشر', accent: '#0284C7' },
  { id: 't8', title: 'Restaurant Menu',     sub: 'Multi-section menu with prices',       bg: 'linear-gradient(135deg,#1F2937,#374151)', fg: '#F7F5EF', tag: 'A4',  dir: 'rtl', kind: 'card',       titleUrdu: 'مینو کارڈ', accent: '#C69B47' },
];

const QUICK_KINDS = [
  { label: 'Blank A4',   kind: 'blank',     Icon: Icon.Doc    },
  { label: 'Book (A5)',  kind: 'book',      Icon: Icon.Book   },
  { label: 'Magazine',   kind: 'magazine',  Icon: Icon.Tiles  },
  { label: 'Card',       kind: 'card',      Icon: Icon.Star   },
  { label: 'Newsletter', kind: 'newsletter',Icon: Icon.Layers },
  { label: 'Poster',     kind: 'poster',    Icon: Icon.Image  },
];

// Build / git info (read from the live app at build time, or default)
const BUILD_INFO = {
  version: '1.2.1',
  build:   'pakistan',
  channel: 'stable',
  commit:  'a37f41c',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return { en: 'Working late',  ur: 'دیر رات کام', emoji: '🌙' };
  if (h < 12) return { en: 'Good morning',  ur: 'صبح بخیر',    emoji: '☀️' };
  if (h < 17) return { en: 'Good afternoon',ur: 'دوپہر بخیر',   emoji: '🌤️' };
  if (h < 21) return { en: 'Good evening',  ur: 'شام بخیر',    emoji: '🌅' };
  return       { en: 'Good night',     ur: 'شب بخیر',     emoji: '🌙' };
}

export default function HomePage() {
  const { state, dispatch } = useStore();
  const { openFile, newDoc, save, exportPdf } = useDocActions();
  const [autosaves, setAutosaves] = useState([]);
  const [query, setQuery] = useState('');
  const [time, setTime] = useState(() => new Date());
  const [pinned, setPinned] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uod.pinned') || '["d1","d2"]'); }
    catch { return ['d1', 'd2']; }
  });

  useEffect(() => {
    setAutosaves(listAutosaves('default'));
    const id = setInterval(() => setAutosaves(listAutosaves('default')), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const restore = (stamp) => {
    const doc = loadAutosave(stamp, 'default');
    if (!doc) return;
    const id = 'd-' + Math.random().toString(36).slice(2, 9);
    dispatch({ type: 'open-doc-data', id, udani: doc, name: doc.meta?.title || 'Recovered' });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Recovered from autosave' } });
  };

  const togglePin = (id) => {
    setPinned(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('uod.pinned', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Filtered recents
  const q = query.trim().toLowerCase();
  const recents = useMemo(() => {
    const items = state.documents.slice(0, 12).map(d => ({ ...d, thumb: thumbFor(d) }));
    return q ? items.filter(d => d.name.toLowerCase().includes(q)) : items;
  }, [state.documents, q]);

  const pinnedDocs = useMemo(() => state.documents.filter(d => pinned.includes(d.id)), [state.documents, pinned]);
  const totalPages  = state.documents.reduce((s, d) => s + (d.pages || 0), 0);
  const lastEdited  = state.documents.slice().sort((a, b) => (b.updated || 0) - (a.updated || 0))[0];
  const g           = greeting();

  const shortcutRunners = {
    new:  () => dispatch({ type: 'set-route', route: 'new' }),
    open: openFile,
    save,
    cmd:  () => dispatch({ type: 'open-cmd' }),
    pdf:  exportPdf,
    set:  () => dispatch({ type: 'set-route', route: 'settings' }),
  };

  return (
    <div className="page home-page">
      {/* ============================================ HERO */}
      <section className="page-body" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="hero hero-rich">
          {/* Animated background pattern */}
          <div className="hero-pattern" aria-hidden="true">
            <div className="hero-pattern-mesh" />
            <div className="hero-pattern-grid" />
            <div className="hero-pattern-glow" />
          </div>

          <div className="hero-content">
            <div className="row-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div className="row" style={{ gap: 12 }}>
                <Brand size={40} />
                <div>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', fontSize: 'var(--fs-12)' }}>v{state.version}</span>
                    <span className="chip" style={{ background: 'rgba(198,155,71,0.25)', color: '#FBE7B0', fontSize: 'var(--fs-12)' }}>
                      <Icon.Star style={{ width: 12, height: 12 }} /> {BUILD_INFO.channel}
                    </span>
                    {autosaves.length > 0 && (
                      <span className="chip" style={{ background: 'rgba(198,155,71,0.25)', color: '#FBE7B0', fontSize: 'var(--fs-12)' }}>
                        <Icon.Recovery style={{ width: 12, height: 12 }} /> {autosaves.length} draft{autosaves.length === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right" style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'right' }}>
                <div className="text-sm" style={{ opacity: 0.75 }}>
                  {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 'var(--fs-13)' }}>
                  {time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} · {navigator.platform || 'Desktop'}
                </div>
              </div>
            </div>

            <div className="hero-greeting">
              <span style={{ fontSize: 48, lineHeight: 1 }}>{g.emoji}</span>
              <div>
                <h1 style={{ margin: 0, color: 'white' }}>
                  {g.en}, <span style={{ color: '#FBE7B0' }}>Dani</span>.
                </h1>
                <div className="urdu" style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', marginTop: 4, direction: 'rtl' }}>
                  {g.ur}
                </div>
                <p className="subtitle" style={{ marginTop: 8 }}>
                  Start something beautiful in Urdu. Create, edit and publish right-to-left documents.
                </p>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn btn-lg hero-cta-primary" onClick={() => dispatch({ type: 'set-route', route: 'new' })}>
                <Icon.Plus style={{ width: 18, height: 18 }} /> New document
              </button>
              <button className="btn btn-lg hero-cta-secondary" onClick={openFile}>
                <Icon.Upload style={{ width: 18, height: 18 }} /> Open .udani
              </button>
              <button className="btn btn-lg hero-cta-secondary" onClick={() => newDoc('Quick start', {})}>
                <Icon.Sparkle style={{ width: 18, height: 18 }} /> Quick start
              </button>
            </div>

            {/* Quick stats */}
            <div className="hero-stats">
              <Stat icon={Icon.Doc}     value={state.documents.length} label="Documents" />
              <Stat icon={Icon.Tiles}   value={totalPages}             label="Pages" />
              <Stat icon={Icon.Book}    value={pinnedDocs.length}     label="Pinned" />
              <Stat icon={Icon.Recovery} value={autosaves.length}      label="Drafts"  highlight={autosaves.length > 0} />
            </div>

            <div className="row mt-6" style={{ gap: 24, flexWrap: 'wrap', color: 'rgba(255,255,255,0.78)', fontSize: 'var(--fs-13)' }}>
              <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: '#FBE7B0' }} /> Offline ready</span>
              <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: '#FBE7B0' }} /> 15,848-word spell-check</span>
              <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: '#FBE7B0' }} /> Real Urdu / Arabic shaping</span>
              <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: '#FBE7B0' }} /> PDF export</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ QUICK START */}
      <section className="page-body" style={{ paddingTop: 16, paddingBottom: 8 }}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="text-sm text-muted">Quick start:</span>
          {QUICK_KINDS.map(q => (
            <button key={q.label} className="chip chip-neutral" onClick={() => newDoc(q.label, { kind: q.kind })}
                    style={{ cursor: 'pointer', border: 'none', gap: 6, padding: '6px 10px' }}>
              <q.Icon style={{ width: 14, height: 14 }} /> {q.label}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================ TODAY'S FOCUS */}
      {(lastEdited || autosaves.length > 0) && (
        <section className="page-body">
          <div className="card card-accent" style={{ background: 'linear-gradient(135deg, var(--color-primary-soft), transparent)', borderColor: 'var(--color-primary)' }}>
            <div className="row-between" style={{ flexWrap: 'wrap', gap: 16 }}>
              <div className="row" style={{ gap: 16, flex: 1, minWidth: 280 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {autosaves.length > 0 ? <Icon.Recovery /> : <Icon.Sparkle />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Today's focus</div>
                  {autosaves.length > 0 ? (
                    <>
                      <h3 style={{ margin: '4px 0' }}>Pick up where you left off</h3>
                      <p className="text-sm text-muted" style={{ margin: 0 }}>
                        You have <strong style={{ color: 'var(--color-text)' }}>{autosaves.length} unsaved draft{autosaves.length === 1 ? '' : 's'}</strong> from earlier.
                        {lastEdited && <> Last edited: <strong style={{ color: 'var(--color-text)' }}>{lastEdited.name}</strong> {lastEdited.lastOpened && `(${lastEdited.lastOpened})`}.</>}
                      </p>
                    </>
                  ) : lastEdited ? (
                    <>
                      <h3 style={{ margin: '4px 0' }}>Continue with {lastEdited.name}</h3>
                      <p className="text-sm text-muted" style={{ margin: 0 }}>
                        You opened this {lastEdited.lastOpened || 'recently'}. {lastEdited.pages} page{lastEdited.pages === 1 ? '' : 's'}, {lastEdited.kind}.
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                {autosaves.length > 0 && (
                  <button className="btn btn-primary" onClick={() => restore(autosaves[0].ts)}>
                    <Icon.Recovery style={{ width: 14, height: 14 }} /> Restore latest draft
                  </button>
                )}
                {lastEdited && (
                  <button className="btn btn-secondary" onClick={() => dispatch({ type: 'open-doc', id: lastEdited.id })}>
                    Open {lastEdited.name} <Icon.Arrow style={{ width: 12, height: 12 }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ PINNED + RECENTS */}
      {pinnedDocs.length > 0 && (
        <section className="page-body">
          <div className="section-head">
            <div>
              <h2><Icon.Bookmark style={{ width: 18, height: 18, verticalAlign: '-3px', color: 'var(--color-primary)' }} /> Pinned</h2>
              <div className="sub">Your most-used documents. Click the pin on a recent to add it here.</div>
            </div>
          </div>
          <div className="grid-auto" style={{ '--min': '180px' }}>
            {pinnedDocs.map(d => (
              <DocThumb key={d.id} doc={{ ...d, thumb: thumbFor(d) }}
                        onOpen={() => dispatch({ type: 'open-doc', id: d.id })}
                        pinned
                        onTogglePin={() => togglePin(d.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="page-body">
        <div className="section-head">
          <div>
            <h2>Recent documents</h2>
            <div className="sub">Pick up where you left off. Click a thumbnail to open, or use the search.</div>
          </div>
          <div className="section-head-actions">
            <div style={{ position: 'relative' }}>
              <input
                className="input input-sm input-search"
                placeholder="Search recent…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ width: 220 }}
                aria-label="Search recent documents"
              />
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'set-route', route: 'templates' })}>
              Browse all templates <Icon.Arrow style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>

        {recents.length === 0 ? (
          <div className="empty-state">
            <Icon.Doc style={{ width: 40, height: 40, color: 'var(--color-text-muted)' }} />
            <h3>{q ? 'No matches' : 'No documents yet'}</h3>
            <p>{q ? `Nothing matches "${q}". Try a different search.` : 'Create your first document to see it here. We\u2019ll keep it safe and auto-saved.'}</p>
            {!q && (
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'set-route', route: 'new' })}>
                <Icon.Plus /> New document
              </button>
            )}
          </div>
        ) : (
          <div className="grid-auto" style={{ '--min': '180px' }}>
            {recents.map(d => (
              <DocThumb key={d.id} doc={d}
                        onOpen={() => dispatch({ type: 'open-doc', id: d.id })}
                        pinned={pinned.includes(d.id)}
                        onTogglePin={() => togglePin(d.id)} />
            ))}
          </div>
        )}
      </section>

      {/* ============================================ TEMPLATES */}
      <section className="page-body">
        <div className="section-head">
          <div>
            <h2>Start from a template</h2>
            <div className="sub">Beautiful, RTL-ready designs to get you going in seconds.</div>
          </div>
          <div className="section-head-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'set-route', route: 'templates' })}>
              View all <Icon.Arrow style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
        <div className="grid-auto" style={{ '--min': '200px' }}>
          {TEMPLATES_HOME.map(t => (
            <div key={t.id} className="tpl-card" onClick={() => newDoc(t.title, { kind: t.kind })}>
              <div className="tpl-preview" style={{ background: t.bg, color: t.fg }}>
                <span className="chip tpl-chip" style={{ background: t.fg, color: t.bg }}>{t.tag}</span>
                <div className="tpl-lines" style={{ opacity: 0.85 }}>
                  <div className="tpl-line long"  style={{ background: t.accent, opacity: 0.7 }} />
                  <div className="tpl-line med"   style={{ background: t.fg, opacity: 0.5 }} />
                  <div className="tpl-line short" style={{ background: t.fg, opacity: 0.3 }} />
                </div>
                <div className="urdu" style={{ fontSize: 22, fontWeight: 700, marginTop: 12, textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>
                  {t.titleUrdu || t.title}
                </div>
              </div>
              <div className="tpl-info">
                <h4>{t.title}</h4>
                <p>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ ACTIVITY TIMELINE */}
      {state.documents.length > 0 && (
        <section className="page-body">
          <div className="section-head">
            <div>
              <h2><Icon.Clock style={{ width: 18, height: 18, verticalAlign: '-3px', color: 'var(--color-text-muted)' }} /> Recent activity</h2>
              <div className="sub">Your last few document interactions.</div>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {state.documents.slice(0, 5).map((d, i) => (
              <button key={d.id}
                      className="activity-row"
                      onClick={() => dispatch({ type: 'open-doc', id: d.id })}>
                <div className="activity-dot" style={{ background: ['var(--color-primary)', 'var(--color-info)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-text-muted)'][i % 5] }} />
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--color-bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <Icon.Doc style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                  <div className="text-xs text-muted">{d.pages} {d.pages === 1 ? 'page' : 'pages'} · {d.kind} · {d.lastOpened || 'recently'}</div>
                </div>
                <span className="chip chip-neutral">{d.language === 'urdu' ? 'UR' : 'EN'}</span>
                <Icon.Arrow style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============================================ SHORTCUTS + RECOVERED */}
      <div className="page-body" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 16, alignItems: 'start' }}>
        <section>
          <div className="section-head">
            <div>
              <h2><Icon.Keyboard style={{ width: 18, height: 18, verticalAlign: '-3px', color: 'var(--color-text-muted)' }} /> Keyboard shortcuts</h2>
              <div className="sub">Click any shortcut to trigger it.</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'set-route', route: 'shortcuts' })}>
              View all <Icon.Arrow style={{ width: 12, height: 12 }} />
            </button>
          </div>
          <div className="grid-2">
            {SHORTCUTS.map(s => (
              <button key={s.label}
                      className="card card-hoverable shortcut-card"
                      onClick={() => shortcutRunners[s.action]?.()}>
                <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{s.label}</span>
                <span className="text-sm text-muted">{s.keys.map((k, i) => <React.Fragment key={i}><kbd>{k}</kbd>{i < s.keys.length - 1 ? ' + ' : ''}</React.Fragment>)}</span>
              </button>
            ))}
          </div>
        </section>

        <aside>
          {autosaves.length > 0 && (
            <div className="card card-accent" style={{ marginBottom: 12 }}>
              <div className="row-between" style={{ marginBottom: 8 }}>
                <h5 style={{ margin: 0 }}><Icon.Recovery style={{ width: 14, height: 14, verticalAlign: '-2px' }} /> Recovered drafts</h5>
                <span className="chip">{autosaves.length}</span>
              </div>
              <div className="stack-sm">
                {autosaves.slice(0, 3).map(s => (
                  <button key={s.ts} onClick={() => restore(s)}
                          className="card card-hoverable"
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, textAlign: 'left', cursor: 'pointer' }}>
                    <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon.Recovery style={{ width: 14, height: 14 }} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm" style={{ fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div className="text-xs text-muted">{new Date(s.ts).toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="row mt-4" style={{ marginTop: 8, gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => dispatch({ type: 'set-route', route: 'recovery' })}>
                  See all
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { clearAutosaves('default'); setAutosaves([]); }}>
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <h5><Icon.Star style={{ width: 14, height: 14, verticalAlign: '-2px', color: 'var(--color-warning)' }} /> Tip of the day</h5>
            <p className="text-sm text-muted" style={{ margin: 0, lineHeight: 'var(--lh-loose)' }}>
              Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette — it's the fastest way to do anything in UrduOfDani.
            </p>
          </div>
        </aside>
      </div>

      {/* ============================================ LEARN / TIPS */}
      <section className="page-body" style={{ paddingBottom: 16 }}>
        <div className="section-head">
          <div>
            <h2>Learn the basics</h2>
            <div className="sub">Tips to get the most out of UrduOfDani.</div>
          </div>
        </div>
        <div className="grid-4">
          {TIPS.map(t => (
            <div key={t.title} className="card card-hoverable">
              <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <t.Icon />
              </span>
              <h4 style={{ margin: '0 0 4px' }}>{t.title}</h4>
              <p className="text-sm text-muted" style={{ margin: 0, lineHeight: 'var(--lh-loose)' }}>{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ FOOTER */}
      <footer className="page-body" style={{ paddingTop: 16, paddingBottom: 32, borderTop: '1px solid var(--color-border)', marginTop: 24 }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12, color: 'var(--color-text-muted)', fontSize: 'var(--fs-12)' }}>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <span className="row" style={{ gap: 6 }}>
              <Icon.GitHub style={{ width: 12, height: 12 }} />
              <strong style={{ color: 'var(--color-text)' }}>v{BUILD_INFO.version}</strong>
              <span>·</span>
              <code style={{ background: 'var(--color-bg-sunken)', padding: '1px 4px', borderRadius: 3 }}>{BUILD_INFO.commit}</code>
              <span>·</span>
              <span>{BUILD_INFO.channel}</span>
            </span>
            <span>·</span>
            <span>© 2026 Muhammad Danish [Dani] · DaniLabs</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <a className="row" style={{ gap: 4, color: 'var(--color-text-muted)' }} href="https://github.com/forest1fire/urduofdani" target="_blank" rel="noopener">
              <Icon.GitHub style={{ width: 12, height: 12 }} /> Source
            </a>
            <a className="row" style={{ gap: 4, color: 'var(--color-text-muted)' }} href="mailto:hello.danilabs@gmail.com">
              <Icon.Mail style={{ width: 12, height: 12 }} /> hello.danilabs@gmail.com
            </a>
            <span>·</span>
            <span style={{ color: 'var(--color-primary)' }}>MIT — free for everyone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------- helpers ----------

function Stat({ icon: I, value, label, highlight }) {
  return (
    <div className="hero-stat" style={highlight ? { background: 'rgba(198,155,71,0.18)' } : undefined}>
      <span className="hero-stat-icon" style={highlight ? { color: '#FBE7B0' } : undefined}><I style={{ width: 18, height: 18 }} /></span>
      <div>
        <div className="hero-stat-value">{value}</div>
        <div className="hero-stat-label">{label}</div>
      </div>
    </div>
  );
}

function DocThumb({ doc, onOpen, pinned, onTogglePin }) {
  return (
    <div className="doc-thumb" onClick={onOpen} role="button" tabIndex={0}
         onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen()}>
      <div className="doc-thumb-canvas">
        {doc.thumb ? (
          <div className="page-mock" style={{ width: '60%', height: '78%', background: 'white', border: '1px solid var(--color-border)' }}>
            {doc.thumb}
          </div>
        ) : (
          <div className="page-mock urdu" style={{ width: '60%', height: '78%', background: 'white', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <Icon.Doc style={{ width: 32, height: 32 }} />
          </div>
        )}
      </div>
      <div className="doc-thumb-actions">
        {onTogglePin && (
          <button className="btn btn-secondary btn-icon btn-sm"
                  title={pinned ? 'Unpin' : 'Pin to top'}
                  onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                  style={pinned ? { color: 'var(--color-warning)' } : undefined}>
            <Icon.Bookmark style={{ width: 14, height: 14, fill: pinned ? 'currentColor' : 'none' }} />
          </button>
        )}
        <button className="btn btn-secondary btn-icon btn-sm" title="Open" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          <Icon.Arrow style={{ width: 14, height: 14 }} />
        </button>
      </div>
      <div className="doc-thumb-meta">
        <h3 className="doc-thumb-title truncate">{doc.name}</h3>
        <div className="doc-thumb-sub">{doc.pages} {doc.pages === 1 ? 'page' : 'pages'} · {doc.lastOpened}</div>
      </div>
    </div>
  );
}

function thumbFor(d) {
  const palettes = {
    magazine:   { bg: '#0A1F33', accent: '#C69B47', text: '#F7F5EF', title: 'میگزین',     sub: 'EDITORIAL' },
    book:       { bg: '#F7F5EF', accent: '#102A43', text: '#102A43', title: 'اردو کتاب',   sub: 'BOOK'    },
    invitation: { bg: '#FBF3E1', accent: '#C69B47', text: '#102A43', title: 'دعوت نامہ',   sub: 'INVITE' },
    newsletter: { bg: '#E7F8F4', accent: '#008F76', text: '#102A43', title: 'خبر نامہ',    sub: 'NEWS'   },
    card:       { bg: '#FED7D7', accent: '#C53030', text: '#102A43', title: 'شادی کارڈ',  sub: 'CARD'   },
    blank:      { bg: '#FFFFFF', accent: '#94A3B8', text: '#0F172A', title: 'Untitled',    sub: 'BLANK'  },
    udani:      { bg: '#FFFFFF', accent: '#008F76', text: '#102A43', title: 'Untitled',    sub: '.UDANI' },
    poster:     { bg: '#1E3A5F', accent: '#C69B47', text: '#F7F5EF', title: 'پوسٹر',     sub: 'POSTER' },
  };
  const p = palettes[d.kind] || palettes.udani;
  return (
    <div style={{ position: 'absolute', inset: 0, background: p.bg, color: p.text, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 6, letterSpacing: '0.1em', fontWeight: 700, opacity: 0.7 }}>{p.sub}</span>
        <div style={{ width: 8, height: 8, borderRadius: 99, background: p.accent }} />
      </div>
      <div className="urdu" style={{ fontSize: 12, textAlign: 'right', fontWeight: 700, lineHeight: 1.2 }}>{p.title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, opacity: 0.6 }}>
        <div style={{ height: 1, background: p.accent, width: '90%' }} />
        <div style={{ height: 1, background: p.accent, width: '70%' }} />
        <div style={{ height: 1, background: p.accent, width: '80%' }} />
      </div>
    </div>
  );
}
