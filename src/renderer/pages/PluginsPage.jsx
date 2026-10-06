import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function PluginsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('installed');
  const [cat, setCat] = useState('All');
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Plugins</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <h2 style={{ margin: 0 }}>Plugins</h2>
      <p style={{ color: 'var(--slate-500)' }}>Add tools when you need them.</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div className="chip-row">
          <button className={`chip${tab === 'installed' ? ' active' : ''}`} onClick={() => setTab('installed')}>Installed</button>
          <button className={`chip${tab === 'browse' ? ' active' : ''}`} onClick={() => setTab('browse')}>Browse</button>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
            <input className="input" placeholder="Search plugins…" style={{ paddingLeft: 32 }} />
          </div>
          <select className="select"><option>All</option><option>Productivity</option><option>Typography</option></select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {state.plugins.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 48, height: 48, background: 'var(--slate-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--emerald-500)' }}>{p.icon}</span>
              <label className="toggle" style={{ marginLeft: 'auto' }}>
                <input type="checkbox" checked={p.enabled} onChange={() => dispatch({ type: 'toggle-plugin', id: p.id })} />
                <span className="toggle-track" /><span className="toggle-thumb" />
              </label>
            </div>
            <h4 style={{ margin: '12px 0 4px', color: 'var(--navy-900)' }}>{p.name}</h4>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--slate-500)' }}>{p.description}</p>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 12 }}><Icon.Cog /> Settings</button>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 24 }}>Font library</h3>
      <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Import .ttf or .otf files. Preview Urdu before applying.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary"><Icon.Doc /> Open font manager</button>
        <button className="btn btn-secondary"><Icon.Plus /> Add font</button>
      </div>
      <div className="card" style={{ marginTop: 16, padding: 0 }}>
        {state.fonts.map(f => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', padding: 12, borderBottom: '1px solid var(--slate-100)', gap: 16 }}>
            <span style={{ fontSize: 24, color: 'var(--navy-900)', fontWeight: 700, minWidth: 60 }}>Aa</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{f.family}</div>
              <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{f.subtitle}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 22 }}>اردو کی خوبصورتی</span>
            <Icon.Star style={{ color: f.favorite ? 'var(--gold-500)' : 'var(--slate-200)' }} />
            <Icon.Arrow style={{ color: 'var(--slate-500)' }} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, color: 'var(--emerald-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon.Check /> Offline ready
      </p>
    </div>
  );
}