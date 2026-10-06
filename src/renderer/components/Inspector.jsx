import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

/**
 * Inspector — the right-hand properties panel, inspired by Photoshop and Word.
 * Tabs change content based on the current route.
 */
const TAB_CONTENT = {
  // route id → array of { id, label, render }
  editor: [
    { id: 'page',   label: 'Page',  render: PageProps },
    { id: 'text',   label: 'Text',  render: TextProps },
    { id: 'object', label: 'Object',render: ObjProps },
  ],
  pages: [
    { id: 'list',   label: 'Pages', render: PagesList },
  ],
  templates: [
    { id: 'filters',label: 'Filters', render: TplFilters },
  ],
  default: [
    { id: 'tip',    label: 'Tip',   render: Tip },
  ],
};

export default function Inspector({ route, width }) {
  const [tab, setTab] = useState(null);
  const tabs = TAB_CONTENT[route] || TAB_CONTENT.default;
  const active = tab ?? tabs[0]?.id;

  return (
    <aside className="inspector" aria-label="Inspector" style={width === 'wide' ? { width: 'var(--inspector-w-wide)' } : undefined}>
      <div className="inspector-tabs" role="tablist">
        {tabs.map(t => (
          <button key={t.id}
                  role="tab"
                  aria-selected={active === t.id}
                  className={`inspector-tab${active === t.id ? ' active' : ''}`}
                  onClick={() => setTab(active === t.id ? null : t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1" style={{ overflowY: 'auto' }}>
        {tabs.filter(t => t.id === active).map(t => (
          <t.render key={t.id} />
        ))}
      </div>
    </aside>
  );
}

function PageProps() {
  return (
    <>
      <Section title="Page size">
        <Field label="Format"><select className="select input-sm"><option>A4</option><option>A5</option><option>Letter</option><option>Legal</option></select></Field>
        <Field label="Orientation">
          <div className="btn-group" style={{ width: '100%' }}>
            <button className="btn btn-sm active">Portrait</button>
            <button className="btn btn-sm">Landscape</button>
          </div>
        </Field>
        <Field label="Margins"><input className="input input-sm" defaultValue="20 mm" /></Field>
      </Section>
      <Section title="Page color">
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {['#FFFFFF', '#F7F5EF', '#FBF3E1', '#E7F8F4', '#FED7D7', '#0A1F33'].map(c => (
            <button key={c} className="btn btn-icon" title={c} style={{ background: c, border: '1px solid var(--color-border)', width: 24, height: 24, borderRadius: 4 }} />
          ))}
        </div>
      </Section>
      <Section title="Document">
        <Field label="Title"><input className="input input-sm" defaultValue="Untitled" /></Field>
        <Field label="Author"><input className="input input-sm" defaultValue="Muhammad Danish [Dani] · DaniLabs" /></Field>
        <Field label="Language"><input className="input input-sm" defaultValue="urdu" /></Field>
      </Section>
    </>
  );
}

function TextProps() {
  return (
    <>
      <Section title="Font">
        <Field label="Family"><select className="select input-sm"><option>Noto Nastaliq Urdu</option><option>Noto Naskh Arabic</option><option>Inter</option></select></Field>
        <Field label="Size"><input className="input input-sm" type="number" defaultValue="16" /></Field>
        <Field label="Weight">
          <div className="btn-group" style={{ width: '100%' }}>
            <button className="btn btn-sm">Regular</button>
            <button className="btn btn-sm active">Medium</button>
            <button className="btn btn-sm">Bold</button>
          </div>
        </Field>
      </Section>
      <Section title="Paragraph">
        <Field label="Align">
          <div className="btn-group" style={{ width: '100%' }}>
            <button className="btn btn-sm">Left</button>
            <button className="btn btn-sm active">Center</button>
            <button className="btn btn-sm">Right</button>
          </div>
        </Field>
        <Field label="Direction">
          <div className="btn-group" style={{ width: '100%' }}>
            <button className="btn btn-sm active">LTR</button>
            <button className="btn btn-sm">RTL</button>
          </div>
        </Field>
      </Section>
      <Section title="Color">
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {['#102A43', '#008F76', '#C69B47', '#C53030', '#3182CE', '#0F172A'].map(c => (
            <button key={c} title={c} style={{ background: c, border: '1px solid var(--color-border)', width: 22, height: 22, borderRadius: 4 }} />
          ))}
        </div>
      </Section>
    </>
  );
}

function ObjProps() {
  return (
    <>
      <Section title="Position">
        <div className="row" style={{ gap: 6 }}>
          <Field label="X"><input className="input input-sm" defaultValue="20" /></Field>
          <Field label="Y"><input className="input input-sm" defaultValue="20" /></Field>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <Field label="W"><input className="input input-sm" defaultValue="170" /></Field>
          <Field label="H"><input className="input input-sm" defaultValue="40" /></Field>
        </div>
      </Section>
      <Section title="Stroke">
        <Field label="Width"><input className="input input-sm" type="number" defaultValue="0" /></Field>
        <Field label="Style">
          <select className="select input-sm"><option>Solid</option><option>Dashed</option><option>Dotted</option></select>
        </Field>
      </Section>
    </>
  );
}

function PagesList() {
  return (
    <Section title="Page list">
      {[1,2,3,4,5,6].map(n => (
        <div key={n} className="row" style={{ padding: 6, borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
          <div style={{ width: 40, height: 50, background: 'white', border: '1px solid var(--color-border)', borderRadius: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 4, left: 4, right: 4, height: 2, background: 'var(--color-border)' }} />
            <div style={{ position: 'absolute', top: 10, left: 4, right: 4, height: 2, background: 'var(--color-border)' }} />
            <div style={{ position: 'absolute', top: 16, left: 4, right: 8, height: 2, background: 'var(--color-border)' }} />
            <span style={{ position: 'absolute', bottom: 1, right: 4, fontSize: 9, color: 'var(--color-text-muted)' }}>{n}</span>
          </div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="text-sm" style={{ fontWeight: 500 }}>Page {n}</div>
            <div className="text-xs text-muted">{n === 1 ? 'Cover' : 'Body'}</div>
          </div>
          <Icon.Doc style={{ color: 'var(--color-text-muted)' }} />
        </div>
      ))}
    </Section>
  );
}

function TplFilters() {
  return (
    <>
      <Section title="Category">
        {['All', 'Books', 'Magazines', 'Cards', 'Posters', 'Reports'].map((c, i) => (
          <button key={c} className={`sidenav-item${i === 0 ? ' active' : ''}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
            <span className="text-xs text-muted">{Math.floor(Math.random() * 30) + 5}</span>
          </button>
        ))}
      </Section>
      <Section title="Language">
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {['Urdu', 'Arabic', 'English', 'Persian', 'Pashto'].map(l => (
            <span key={l} className="chip chip-neutral">{l}</span>
          ))}
        </div>
      </Section>
    </>
  );
}

function Tip() {
  return (
    <div className="inspector-section">
      <div className="card card-accent" style={{ background: 'var(--color-primary-soft)', border: 'none' }}>
        <div className="row" style={{ gap: 8, marginBottom: 8 }}>
          <Icon.Sparkle style={{ color: 'var(--color-primary)' }} />
          <strong>Tip</strong>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text)', margin: 0 }}>
          Press <kbd>Ctrl</kbd>+<kbd>K</kbd> any time to open the command palette.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="inspector-section">
      <h5>{title}</h5>
      <div className="stack-sm">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
