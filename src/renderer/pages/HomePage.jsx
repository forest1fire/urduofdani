import React, { useEffect, useMemo, useState } from 'react';
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
 *
 * Sections (in order):
 *   1. Hero — brand, value prop, two big CTAs (New, Open)
 *   2. Recents — searchable grid of document thumbnails
 *   3. Start from template — visual template gallery
 *   4. Right rail — drafts (recovered autosaves), tip, profile card
 */

const TIPS = [
  { title: 'Press ⌘K any time',     body: 'The command palette is the fastest way to do anything — new, open, save, export, jump to a page.', Icon: Icon.Sparkle },
  { title: 'Live spell-check',       body: 'Type in Urdu and see spelling suggestions in real time. The vendored engine knows 15,848 words.', Icon: Icon.Check },
  { title: 'Offline first',          body: 'Your documents stay on your device. No account, no cloud, no network required.', Icon: Icon.Help_O },
  { title: 'Auto-save every 2 min',  body: 'We snapshot your work automatically. Find drafts in the right panel or under "Document recovery".', Icon: Icon.Recovery },
];

export default function HomePage() {
  const { state, dispatch } = useStore();
  const { openFile, newDoc } = useDocActions();
  const [autosaves, setAutosaves] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setAutosaves(listAutosaves('default'));
    const id = setInterval(() => setAutosaves(listAutosaves('default')), 5000);
    return () => clearInterval(id);
  }, []);

  const restore = (stamp) => {
    const doc = loadAutosave(stamp, 'default');
    if (!doc) return;
    const id = 'd-' + Math.random().toString(36).slice(2, 9);
    dispatch({ type: 'open-doc-data', id, udani: doc, name: doc.meta?.title || 'Recovered' });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Recovered from autosave' } });
  };

  // Filtered recents
  const q = query.trim().toLowerCase();
  const recents = useMemo(() => {
    const items = state.documents.slice(0, 12).map(d => ({
      ...d,
      thumb: thumbFor(d),
    }));
    return q ? items.filter(d => d.name.toLowerCase().includes(q)) : items;
  }, [state.documents, q]);

  return (
    <div className="page">
      {/* HERO */}
      <section className="page-body" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="hero">
          <div className="row" style={{ marginBottom: 12 }}>
            <Brand size={36} />
            <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>v{state.version}</span>
          </div>
          <h1>Start something beautiful in Urdu.</h1>
          <p className="subtitle">
            Create, edit and publish Urdu, Arabic and other right-to-left documents.
            Offline, fast, and free for everyone.
          </p>
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
          <div className="row mt-6" style={{ gap: 24, flexWrap: 'wrap', color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-13)' }}>
            <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: 'var(--brand-emerald-400)' }} /> Offline ready</span>
            <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: 'var(--brand-emerald-400)' }} /> 15,848-word spell-check</span>
            <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: 'var(--brand-emerald-400)' }} /> Real Urdu / Arabic shaping</span>
            <span className="row" style={{ gap: 6 }}><Icon.Check style={{ width: 16, height: 16, color: 'var(--brand-emerald-400)' }} /> PDF export</span>
          </div>
        </div>
      </section>

      {/* QUICK START PILLS */}
      <section className="page-body" style={{ paddingTop: 16, paddingBottom: 8 }}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <span className="text-sm text-muted">Quick start:</span>
          {[
            { label: 'Blank A4',     kind: 'blank',  Icon: Icon.Doc   },
            { label: 'Book (A5)',    kind: 'book',   Icon: Icon.Book  },
            { label: 'Magazine',     kind: 'magazine',Icon: Icon.Tiles },
            { label: 'Card',         kind: 'card',   Icon: Icon.Star  },
            { label: 'Newsletter',   kind: 'newsletter',Icon: Icon.Layers },
            { label: 'Poster',       kind: 'poster', Icon: Icon.Image },
          ].map(q => (
            <button key={q.label} className="chip chip-neutral" onClick={() => newDoc(q.label, { kind: q.kind })}
                    style={{ cursor: 'pointer', border: 'none', gap: 6, padding: '6px 10px' }}>
              <q.Icon style={{ width: 14, height: 14 }} /> {q.label}
            </button>
          ))}
        </div>
      </section>

      {/* RECENTS */}
      <section className="page-body" style={{ paddingTop: 8 }}>
        <div className="section-head">
          <div>
            <h2>Recent documents</h2>
            <div className="sub">Pick up where you left off.</div>
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
            <Icon.Doc />
            <h3>No documents yet</h3>
            <p>Create your first document to see it here. We&rsquo;ll keep it safe and auto-saved.</p>
            <button className="btn btn-primary" onClick={() => dispatch({ type: 'set-route', route: 'new' })}>
              <Icon.Plus /> New document
            </button>
          </div>
        ) : (
          <div className="grid-auto">
            {recents.map(d => (
              <DocThumb key={d.id} doc={d} onOpen={() => dispatch({ type: 'open-doc', id: d.id })} />
            ))}
          </div>
        )}
      </section>

      {/* TEMPLATES */}
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
        <div className="grid-auto">
          {TEMPLATES_HOME.map(t => (
            <div key={t.id} className="tpl-card" onClick={() => newDoc(t.title, { kind: t.kind })}>
              <div className="tpl-preview" style={{ background: t.bg, color: t.fg }}>
                <span className="chip tpl-chip" style={{ background: t.fg, color: t.bg }}>{t.tag}</span>
                <div className="tpl-lines" style={{ opacity: 0.85 }}>
                  <div className="tpl-line long" />
                  <div className="tpl-line med" />
                  <div className="tpl-line short" />
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

      {/* RECOVERED DRAFTS — only if any */}
      {autosaves.length > 0 && (
        <section className="page-body" style={{ paddingTop: 0 }}>
          <div className="card card-accent">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 'var(--fs-20)', margin: 0 }}>Recovered drafts</h2>
                <div className="text-sm text-muted">Auto-saved copies from your last session. Click to restore.</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { clearAutosaves('default'); setAutosaves([]); }}>
                Clear all
              </button>
            </div>
            <div className="grid-3" style={{ gap: 12 }}>
              {autosaves.slice(0, 6).map(s => (
                <button key={s.ts}
                        onClick={() => restore(s)}
                        className="card card-hoverable"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.Recovery />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 'var(--fs-14)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(s.ts).toLocaleString()} · {Math.round(s.size / 1024)} KB
                    </div>
                  </div>
                  <Icon.Arrow style={{ color: 'var(--color-text-muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LEARN / TIPS */}
      <section className="page-body" style={{ paddingBottom: 32 }}>
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
    </div>
  );
}

// ---------- helpers ----------

function DocThumb({ doc, onOpen }) {
  return (
    <div className="doc-thumb" onClick={onOpen} role="button" tabIndex={0}
         onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen()}>
      <div className="doc-thumb-canvas">
        {doc.thumb ? (
          <div className="page-mock" style={{ width: '60%', height: '78%', background: 'white', border: '1px solid var(--color-border)' }}>
            {doc.thumb}
          </div>
        ) : (
          <div className="page-mock urdu" style={{ width: '60%', height: '78%', background: 'white', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-500)' }}>
            <Icon.Doc style={{ width: 32, height: 32 }} />
          </div>
        )}
      </div>
      <div className="doc-thumb-actions">
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
  // A small inline visual: navy band + sample Urdu text block + gold accent.
  // Different per kind.
  const palettes = {
    magazine:   { bg: '#0A1F33', accent: '#C69B47', text: '#F7F5EF', title: 'میگزین', sub: 'EDITORIAL' },
    book:       { bg: '#F7F5EF', accent: '#102A43', text: '#102A43', title: 'اردو کتاب', sub: 'BOOK'    },
    invitation: { bg: '#FBF3E1', accent: '#C69B47', text: '#102A43', title: 'دعوت نامہ', sub: 'INVITE' },
    newsletter: { bg: '#E7F8F4', accent: '#008F76', text: '#102A43', title: 'خبر نامہ',  sub: 'NEWS'   },
    card:       { bg: '#FED7D7', accent: '#C53030', text: '#102A43', title: 'شادی کارڈ', sub: 'CARD'   },
    blank:      { bg: '#FFFFFF', accent: '#94A3B8', text: '#0F172A', title: 'Untitled',   sub: 'BLANK'  },
    udani:      { bg: '#FFFFFF', accent: '#008F76', text: '#102A43', title: 'Untitled',   sub: '.UDANI' },
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

const TEMPLATES_HOME = [
  { id: 't1', title: 'Urdu Book',          sub: 'A clean, elegant book layout',        bg: 'linear-gradient(135deg,#F7F5EF,#EFEBDF)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'book',       titleUrdu: 'اردو کتاب' },
  { id: 't2', title: 'Editorial Magazine', sub: 'For articles, columns and features', bg: 'linear-gradient(135deg,#102A43,#1E3A5F)', fg: '#F7F5EF', tag: 'A4',   dir: 'rtl', kind: 'magazine',   titleUrdu: 'اداری مجلہ' },
  { id: 't3', title: 'Wedding Invitation', sub: 'A graceful invitation design',      bg: 'linear-gradient(135deg,#FBF3E1,#F5E5BD)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'card',       titleUrdu: 'شادی کی دعوت' },
  { id: 't4', title: 'School Newsletter',  sub: '4-page A4 newsletter for schools',  bg: 'linear-gradient(135deg,#E7F8F4,#A5E5D6)', fg: '#102A43', tag: 'A4',   dir: 'ltr', kind: 'newsletter', titleUrdu: 'School Newsletter' },
  { id: 't5', title: 'Research Report',    sub: 'Title page + body + bibliography',  bg: 'linear-gradient(135deg,#FFFFFF,#F8FAFC)', fg: '#0F172A', tag: 'A4',   dir: 'ltr', kind: 'book',       titleUrdu: 'Research Report' },
  { id: 't6', title: 'Poetry Collection',  sub: 'A beautiful layout for Urdu poetry',bg: 'linear-gradient(135deg,#FED7D7,#FBF3E1)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'book',       titleUrdu: 'شعری مجموعہ' },
];
