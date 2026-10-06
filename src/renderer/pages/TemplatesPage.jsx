import React, { useState, useMemo } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useDocActions } from '../lib/useDocActions.js';
import { TEMPLATES, getFeaturedTemplates, getCategories, templateToDocument } from '../lib/templates.js';

/**
 * TemplatesPage — the gallery of ready-made document designs.
 *
 * Sections:
 *   1. PageHeader with title + subtitle + featured count
 *   2. Featured row (3 highlighted templates, big cards)
 *   3. Category chips + search
 *   4. Grid of all templates with rich preview
 *   5. Preview modal (opens on click, shows full template + actions)
 */
export default function TemplatesPage() {
  const { dispatch } = useStore();
  const { newDoc } = useDocActions();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [preview, setPreview] = useState(null);   // template object

  const categories = useMemo(() => getCategories(), []);
  const featured = useMemo(() => getFeaturedTemplates(), []);

  const filtered = useMemo(() => TEMPLATES.filter(t => {
    if (cat !== 'all' && t.cat !== cat) return false;
    if (q) {
      const ql = q.toLowerCase();
      return t.title.toLowerCase().includes(ql)
        || t.sub.toLowerCase().includes(ql)
        || (t.titleUrdu || '').toLowerCase().includes(ql);
    }
    return true;
  }), [cat, q]);

  const useTemplate = (t) => {
    const doc = templateToDocument(t);
    const id = 'd-' + Math.random().toString(36).slice(2, 9);
    dispatch({
      type: 'open-doc-data',
      id,
      name: t.title,
      udani: doc,
    });
    dispatch({ type: 'set-route', route: 'editor' });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: `Created "${t.title}" from template` } });
  };

  return (
    <div className="page">
      <PageHeader
        title="Templates"
        subtitle={`${TEMPLATES.length} ready-made designs to start from. Each opens in the editor with proper pages, frames, and Urdu typography.`}
        back
        actions={
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'set-route', route: 'home' })}>
            <Icon.Home style={{ width: 14, height: 14 }} /> Home
          </button>
        }
      />

      <div className="page-body">
        {/* ============================================ FEATURED */}
        {cat === 'all' && !q && (
          <section style={{ marginBottom: 32 }}>
            <div className="row-between" style={{ marginBottom: 12 }}>
              <h3><Icon.Star style={{ width: 18, height: 18, verticalAlign: '-3px', color: 'var(--color-warning)' }} /> Featured</h3>
              <span className="text-sm text-muted">Hand-picked designs by DaniLabs</span>
            </div>
            <div className="grid-3">
              {featured.map(t => (
                <FeaturedCard key={t.id} t={t} onUse={() => useTemplate(t)} onPreview={() => setPreview(t)} />
              ))}
            </div>
          </section>
        )}

        {/* ============================================ FILTER + SEARCH */}
        <div className="row-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {categories.map(c => {
              const n = c.id === 'all' ? TEMPLATES.length : TEMPLATES.filter(t => t.cat === c.id).length;
              return (
                <button key={c.id}
                        className={`chip ${cat === c.id ? 'active' : ''}`}
                        onClick={() => setCat(c.id)}
                        style={{ cursor: 'pointer' }}>
                  {c.label}
                  <span className="text-xs" style={{ opacity: 0.6, marginLeft: 4 }}>{n}</span>
                </button>
              );
            })}
          </div>
          <div style={{ position: 'relative' }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--color-text-muted)', width: 14, height: 14 }} />
            <input
              className="input input-sm input-search"
              placeholder="Search templates…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ width: 240, paddingLeft: 32 }}
            />
          </div>
        </div>

        {/* ============================================ GRID */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Icon.Tiles style={{ width: 40, height: 40, color: 'var(--color-text-muted)' }} />
            <h3>No templates match</h3>
            <p>Try a different category or search term.</p>
            <button className="btn btn-secondary" onClick={() => { setCat('all'); setQ(''); }}>Reset</button>
          </div>
        ) : (
          <div className="grid-auto" style={{ '--min': '260px' }}>
            {filtered.map(t => (
              <TemplateCard key={t.id} t={t}
                            onUse={() => useTemplate(t)}
                            onPreview={() => setPreview(t)} />
            ))}
          </div>
        )}

        {/* ============================================ INFO BANNER */}
        <div className="card card-accent" style={{ marginTop: 32 }}>
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Sparkle />
            </span>
            <div>
              <h4 style={{ margin: 0 }}>Want a custom template?</h4>
              <p className="text-sm text-muted" style={{ margin: 0, marginTop: 4 }}>
                Templates are just JSON. You can <a href="mailto:hello.danilabs@gmail.com" style={{ color: 'var(--color-primary)' }}>request a custom one</a> for your school, business, or community — we'll add it to this gallery within a week. <strong>Free</strong>, as always.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ PREVIEW MODAL */}
      {preview && (
        <PreviewModal t={preview} onClose={() => setPreview(null)} onUse={() => { useTemplate(preview); setPreview(null); }} />
      )}
    </div>
  );
}

// ---------- Card: featured (big) ----------
function FeaturedCard({ t, onUse, onPreview }) {
  return (
    <div className="card card-hoverable" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
         onClick={onPreview}>
      <div style={{ aspectRatio: t.orientation === 'landscape' ? '1.5' : '0.71', background: t.palette?.bg || '#FFFFFF', color: t.palette?.fg || '#102A43', position: 'relative', padding: 20 }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="chip" style={{ background: t.palette?.fg, color: t.palette?.bg, fontSize: 10 }}>{t.tag}</span>
          {t.featured && <span className="chip" style={{ background: 'var(--color-warning)', color: 'white', fontSize: 10 }}><Icon.Star style={{ width: 10, height: 10 }} /> Featured</span>}
        </div>
        <div className="urdu" style={{ fontSize: 28, fontWeight: 700, textAlign: t.direction === 'rtl' ? 'right' : 'left', lineHeight: 1.1, marginBottom: 8, color: t.palette?.accent }}>
          {t.titleUrdu || t.title}
        </div>
        <div style={{ height: 1, background: t.palette?.accent, width: 40, marginLeft: 'auto', marginBottom: 12, opacity: 0.6 }} />
        <div className="tpl-lines" style={{ opacity: 0.5 }}>
          <div className="tpl-line long"  style={{ background: t.palette?.fg }} />
          <div className="tpl-line med"   style={{ background: t.palette?.fg }} />
          <div className="tpl-line long"  style={{ background: t.palette?.fg }} />
          <div className="tpl-line short" style={{ background: t.palette?.fg }} />
        </div>
      </div>
      <div className="row-between" style={{ padding: 12, borderTop: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontWeight: 600 }}>{t.title}</div>
          <div className="text-xs text-muted">{t.sub}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onUse(); }}>
          <Icon.Plus style={{ width: 12, height: 12 }} /> Use
        </button>
      </div>
    </div>
  );
}

// ---------- Card: standard grid ----------
function TemplateCard({ t, onUse, onPreview }) {
  return (
    <div className="tpl-card" onClick={onPreview}>
      <div className="tpl-preview" style={{ background: t.palette?.bg, color: t.palette?.fg }}>
        <span className="chip tpl-chip" style={{ background: t.palette?.fg, color: t.palette?.bg }}>{t.tag}</span>
        <div className="urdu" style={{ fontSize: 18, fontWeight: 700, textAlign: t.direction === 'rtl' ? 'right' : 'left', lineHeight: 1.15, marginBottom: 6, color: t.palette?.accent }}>
          {t.titleUrdu || t.title}
        </div>
        <div className="tpl-lines" style={{ opacity: 0.6 }}>
          <div className="tpl-line long"  style={{ background: t.palette?.fg, opacity: 0.5 }} />
          <div className="tpl-line med"   style={{ background: t.palette?.fg, opacity: 0.4 }} />
          <div className="tpl-line short" style={{ background: t.palette?.fg, opacity: 0.3 }} />
          <div className="tpl-line med"   style={{ background: t.palette?.fg, opacity: 0.4 }} />
        </div>
        <div className="row" style={{ gap: 4, marginTop: 'auto', paddingTop: 6 }}>
          <span className="chip chip-neutral" style={{ fontSize: 10 }}>{t.size}</span>
          <span className="chip chip-neutral" style={{ fontSize: 10 }}>{t.direction === 'rtl' ? 'RTL' : 'LTR'}</span>
          {t.featured && <span className="chip" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)', fontSize: 10 }}>Featured</span>}
        </div>
      </div>
      <div className="tpl-info">
        <h4>{t.title}</h4>
        <p>{t.sub}</p>
        <div className="row" style={{ gap: 6, marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onPreview(); }}>
            <Icon.Eye style={{ width: 12, height: 12 }} /> Preview
          </button>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onUse(); }}>
            <Icon.Plus style={{ width: 12, height: 12 }} /> Use
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Preview modal ----------
function PreviewModal({ t, onClose, onUse }) {
  return (
    <div className="cmdk-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0 }}>{t.title}</h3>
            <div className="text-sm text-muted">{t.titleUrdu} · {t.tag} · {t.direction.toUpperCase()}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <Icon.Close style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="modal-body">
          <div className="row" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="chip"><Icon.Tiles style={{ width: 12, height: 12 }} /> {t.pages.length} page{t.pages.length === 1 ? '' : 's'}</span>
            <span className="chip"><Icon.PageSize style={{ width: 12, height: 12 }} /> {t.size} {t.orientation}</span>
            <span className="chip"><Icon.Type style={{ width: 12, height: 12 }} /> {t.palette?.accent ? 'Custom palette' : 'Default'}</span>
            <span className="chip"><Icon.Clock style={{ width: 12, height: 12 }} /> ~2 min to fill</span>
            {t.featured && <span className="chip" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}><Icon.Star style={{ width: 12, height: 12 }} /> Featured</span>}
          </div>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 'var(--lh-loose)' }}>{t.description}</p>

          <h4 style={{ marginTop: 16 }}>Page previews</h4>
          <div className="grid-auto" style={{ '--min': '160px' }}>
            {t.pages.map((p, i) => (
              <div key={p.id} className="card card-hoverable" style={{ padding: 6 }}>
                <div style={{ aspectRatio: t.orientation === 'landscape' ? '1.5' : '0.71', background: p.bg || t.palette?.bg || '#FFFFFF', color: t.palette?.fg || '#102A43', position: 'relative', padding: 6, overflow: 'hidden' }}>
                  {/* render frames as mini versions */}
                  {p.frames.slice(0, 6).map(f => (
                    <div key={f.id} style={{
                      position: 'absolute',
                      left:  `${f.x / 200 * 100}%`,
                      top:   `${f.y / 283 * 100}%`,
                      width: `${f.w / 200 * 100}%`,
                      height: `${(f.h || 6) / 283 * 100}%`,
                      background: f.color === t.palette?.accent ? `${t.palette?.accent}22` : 'transparent',
                      border: f.content ? `1px dashed ${t.palette?.fg}55` : `1px solid ${t.palette?.fg}22`,
                      fontSize: Math.min(8, (f.size || 8) / 4),
                      color: f.color || t.palette?.fg,
                      fontWeight: f.weight === 'bold' ? 700 : 400,
                      fontStyle: f.italic ? 'italic' : 'normal',
                      textAlign: f.align,
                      direction: f.dir,
                      overflow: 'hidden',
                      padding: '0 2px',
                    }} className={f.font?.includes('Nastaliq') || f.dir === 'rtl' ? 'urdu' : ''}>
                      {f.content && f.content.slice(0, 30)}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 4 }}>Page {i + 1} · {p.kind}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onUse}>
            <Icon.Plus style={{ width: 14, height: 14 }} /> Create from this template
          </button>
        </div>
      </div>
    </div>
  );
}
