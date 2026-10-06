import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const TABS = [
  { id: 'general',     label: 'General' },
  { id: 'editing',     label: 'Editing' },
  { id: 'saving',      label: 'Saving' },
  { id: 'performance', label: 'Performance' },
];

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [active2, setActive2] = React.useState('general');

  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Settings</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div className="page-2col" style={{ padding: '16px 32px' }}>
        <main>
          <h2 style={{ margin: 0 }}>Settings</h2>
          <p style={{ color: 'var(--slate-500)' }}>Make UrduOfDani work your way.</p>
          <div className="tabs" style={{ padding: 0, marginBottom: 16 }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab${active2 === t.id ? ' active' : ''}`} onClick={() => setActive2(t.id)}>{t.label}</button>
            ))}
          </div>
          {active2 === 'general' && (
            <>
              <section className="card">
                <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Appearance</h3>
                <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Customize how UrduOfDani looks and feels.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
                  <span>Theme</span>
                  <div style={{ display: 'flex', gap: 4, background: 'var(--slate-50)', padding: 4, borderRadius: 8 }}>
                    {['light', 'dark', 'system'].map(t => (
                      <button key={t} className={`btn btn-sm ${state.theme === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => dispatch({ type: 'set-theme', theme: t })} style={{ textTransform: 'capitalize' }}>{t}</button>
                    ))}
                  </div>
                  <span>Interface language</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <select className="select" style={{ width: 240 }}><option>English</option><option>اردو</option></select>
                    <span style={{ color: 'var(--slate-500)', fontSize: 13 }}>Urdu also available.</span>
                  </div>
                  <span>UI scale</span>
                  <select className="select" style={{ width: 240 }} value={state.scale + '%'} onChange={e => dispatch({ type: 'set-scale', scale: parseInt(e.target.value) })}>
                    <option>90%</option><option>100%</option><option>110%</option><option>125%</option>
                  </select>
                </div>
              </section>
              <section className="card" style={{ marginTop: 16 }}>
                <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Editing defaults</h3>
                <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Set your preferred writing options.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
                  <span>Keyboard layout</span>
                  <select className="select" style={{ width: 240 }}><option>Urdu Phonetic</option><option>Urdu (Traditional)</option></select>
                  <span>Default text direction</span>
                  <select className="select" style={{ width: 240 }}><option>Right to left</option><option>Left to right</option></select>
                  <span>Default font</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select className="select" style={{ width: 240 }}><option>Noto Nastaliq Urdu</option></select>
                    <a href="#">Manage fonts</a>
                  </div>
                </div>
              </section>
              <section className="card" style={{ marginTop: 16 }}>
                <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Saving and recovery</h3>
                <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Keep your work safe.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
                  <span>Autosave</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
                    <select className="select" style={{ width: 200 }}><option>Every 2 minutes</option><option>Every 5 minutes</option><option>Every 10 minutes</option></select>
                  </div>
                  <span>Keep recovery copies</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
                    <a href="#">Recovery location</a>
                  </div>
                </div>
                <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Performance options</summary>
                  <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Background rendering and preview quality</p>
                </details>
              </section>
            </>
          )}
          {active2 === 'editing' && (
            <section className="card">
              <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Editing</h3>
              <p style={{ color: 'var(--slate-500)' }}>Choose how the editor behaves while you type.</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Smart quotes</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Spell-check as you type</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" /> Auto-format Urdu numerals</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Snap to guides</label>
              <label className="label" style={{ marginTop: 12 }}>Default Urdu keyboard</label>
              <select className="select" style={{ width: 240 }}><option>Urdu Phonetic</option></select>
            </section>
          )}
          {active2 === 'saving' && (
            <section className="card">
              <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Saving</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Save backup before risky operations</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Embed used fonts in document</label>
              <label className="label" style={{ marginTop: 12 }}>Default file format</label>
              <select className="select"><option>.udani</option><option>.udani (legacy)</option></select>
            </section>
          )}
          {active2 === 'performance' && (
            <section className="card">
              <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Performance</h3>
              <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Balance editing speed and preview detail.</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Render visible pages first</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Background layout</label>
              <label className="label" style={{ marginTop: 8 }}>Image preview quality</label>
              <select className="select" style={{ width: 200 }}><option>Balanced</option><option>High</option><option>Fast</option></select>
            </section>
          )}
        </main>
        <aside className="card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ color: 'var(--emerald-500)' }}><Icon.Help_O style={{ fontSize: 22 }} /></span>
            <div>
              <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Your documents stay yours</h3>
              <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Offline editing. Online features are optional.</p>
              <a href="#">About UrduOfDani →</a>
            </div>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <span style={{ color: 'var(--warning-500)' }}>2 unsaved changes</span>
        <div className="right">
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'toast', t: 'Settings saved ✓' })}>Save changes</button>
        </div>
      </div>
    </div>
  );
}