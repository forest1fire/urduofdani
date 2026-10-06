import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function PluginsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('installed');
  const [cat, setCat] = useState('All');
  return (
    <div className="page">
      <PageHeader title={"Plugins"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <header style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Plugins</h2>
        <p className="text-muted" style={{ margin: "4px 0 0" }}>Add tools when you need them.</p>
      </header>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div className="chip-row">
          <button className={`chip${tab === 'installed' ? ' active' : ''}`} onClick={() => setTab('installed')}>Installed</button>
          <button className={`chip${tab === 'browse' ? ' active' : ''}`} onClick={() => setTab('browse')}>Browse</button>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--color-text-subtle)' }} />
            <input className="input" placeholder="Search plugins…" style={{ paddingLeft: 32 }} />
          </div>
          <select className="select"><option>All</option><option>Productivity</option><option>Typography</option></select>
        </div>
      </div>
      <div className="grid-4" style={{ gap: 12 }}>
        {state.plugins.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 48, height: 48, background: 'var(--color-bg-sunken)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--color-primary)' }}>{p.icon}</span>
              <label className="toggle" style={{ marginLeft: 'auto' }}>
                <input type="checkbox" checked={p.enabled} onChange={() => dispatch({ type: 'toggle-plugin', id: p.id })} />
                <span className="toggle-track" /><span className="toggle-thumb" />
              </label>
            </div>
            <h4 style={{ margin: '12px 0 4px', color: 'var(--color-text)' }}>{p.name}</h4>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>{p.description}</p>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 12 }}><Icon.Cog /> Settings</button>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 24 }}>Font library</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Import .ttf or .otf files. Preview Urdu before applying.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary"><Icon.Doc /> Open font manager</button>
        <button className="btn btn-secondary"><Icon.Plus /> Add font</button>
      </div>
      <div className="card" style={{ marginTop: 16, padding: 0 }}>
        {state.fonts.map(f => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', padding: 12, borderBottom: '1px solid var(--color-border)', gap: 16 }}>
            <span style={{ fontSize: 24, color: 'var(--color-text)', fontWeight: 700, minWidth: 60 }}>Aa</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{f.family}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{f.subtitle}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 22 }}>اردو کی خوبصورتی</span>
            <Icon.Star style={{ color: f.favorite ? 'var(--gold-500)' : 'var(--color-border)' }} />
            <Icon.Arrow style={{ color: 'var(--color-text-muted)' }} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon.Check /> Offline ready
      </p>
    </div>
  );
}