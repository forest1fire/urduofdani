import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function PerformancePage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = React.useState('performance');
  return (
    <div className="page">
      <PageHeader title={"Performance"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div className="page-2col">
        <main>
          <header style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Performance</h2>
        <p className="text-muted" style={{ margin: "4px 0 0" }}>Balance editing speed and preview detail.</p>
      </header>
          <div className="tabs" style={{ padding: 0, marginBottom: 16 }}>
            {['general','editing','saving','performance'].map(t => (
              <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
          <section className="card">
            <h3 style={{ margin: 0 }}>Editing</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}><input type="checkbox" defaultChecked /> Render visible pages first</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span>Background layout</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
            </div>
            <label className="label" style={{ marginTop: 8 }}>Image preview quality</label>
            <select className="select" style={{ width: 200 }}><option>Balanced</option><option>High</option><option>Fast</option></select>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Original images remain unchanged in export.</p>
          </section>
          <section className="card" style={{ marginTop: 16 }}>
            <h3 style={{ margin: 0 }}>Large documents</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span>Load thumbnails on demand</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
            </div>
            <label className="label" style={{ marginTop: 8 }}>Preview cache limit</label>
            <select className="select" style={{ width: 200 }}><option>512 MB</option><option>1 GB</option><option>256 MB</option></select>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span>Pause unused plugins</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
            </div>
          </section>
          <section className="card" style={{ marginTop: 16 }}>
            <h3 style={{ margin: 0 }}>Rendering</h3>
            <label className="label" style={{ marginTop: 8 }}>Hardware acceleration</label>
            <select className="select" style={{ width: 200 }}><option>Auto</option><option>On</option><option>Off</option></select>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Uses supported graphics hardware.</p>
          </section>
          <section className="card" style={{ marginTop: 16 }}>
            <h3 style={{ margin: 0 }}>Diagnostics</h3>
            <button className="btn btn-secondary" style={{ marginTop: 8 }}>▶ Run performance check</button>
            <span style={{ marginLeft: 12, color: 'var(--color-text-muted)' }}>● No results yet.</span>
          </section>
        </main>
        <aside>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ color: 'var(--color-primary)' }}><Icon.Help_O style={{ fontSize: 22 }} /></span>
              <div>
                <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Keep writing responsive</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Preview settings affect screen detail. Export settings are configured separately.</p>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 12 }}><Icon.Refresh /> Restore recommended settings</button>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <span style={{ color: 'var(--color-info)' }}><Icon.Help_O /> Changes apply after saving.</span>
        <div className="right">
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}