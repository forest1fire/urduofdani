import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TABS = [
  { id: 'general',     label: 'General',     Icon: Icon.Cog      },
  { id: 'editing',     label: 'Editing',     Icon: Icon.Edit     },
  { id: 'saving',      label: 'Saving',      Icon: Icon.Download },
  { id: 'performance', label: 'Performance', Icon: Icon.Sparkle  },
];

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('general');

  return (
    <div className="page">
      <PageHeader
        title="Settings"
        subtitle="Make UrduOfDani work your way."
        back
        actions={
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Settings saved' } })}>
            <Icon.Check style={{ width: 14, height: 14 }} /> Save
          </button>
        }
      />

      <div className="page-body">
        <div className="row" style={{ gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id}
                    className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTab(t.id)}>
              <t.Icon style={{ width: 14, height: 14 }} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'general' && (
          <>
            <Section title="Appearance" sub="Customize how UrduOfDani looks and feels.">
              <Field label="Theme">
                <div className="row" style={{ gap: 4 }}>
                  {['light', 'dark', 'system'].map(t => (
                    <button key={t}
                            className={`btn btn-sm ${state.theme === t ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => dispatch({ type: 'set-theme', theme: t })}
                            style={{ textTransform: 'capitalize' }}>{t}</button>
                  ))}
                </div>
              </Field>
              <Field label="Interface language">
                <select className="select" style={{ maxWidth: 240 }}>
                  <option>English</option>
                  <option>اردو</option>
                </select>
              </Field>
              <Field label="UI scale">
                <select className="select" style={{ maxWidth: 240 }} value={state.scale + '%'}
                        onChange={e => dispatch({ type: 'set-scale', scale: parseInt(e.target.value) })}>
                  <option>80</option><option>90</option><option>100</option><option>110</option><option>125</option>
                </select>
              </Field>
            </Section>
            <Section title="Editing defaults" sub="Set your preferred writing options.">
              <Field label="Keyboard layout">
                <select className="select" style={{ maxWidth: 240 }}><option>Urdu Phonetic</option><option>Urdu (Traditional)</option></select>
              </Field>
              <Field label="Default direction">
                <select className="select" style={{ maxWidth: 240 }}><option>Right to left</option><option>Left to right</option></select>
              </Field>
              <Field label="Default font">
                <select className="select" style={{ maxWidth: 240 }}><option>Noto Nastaliq Urdu</option><option>Noto Naskh Arabic</option></select>
              </Field>
            </Section>
          </>
        )}

        {tab === 'editing' && (
          <Section title="Editing" sub="Choose how the editor behaves while you type.">
            <Toggle label="Smart quotes" defaultChecked />
            <Toggle label="Spell-check as you type" defaultChecked />
            <Toggle label="Auto-format Urdu numerals" />
            <Toggle label="Snap to guides" defaultChecked />
            <Toggle label="Show word count in status bar" defaultChecked />
            <Toggle label="Highlight the current line" />
          </Section>
        )}

        {tab === 'saving' && (
          <Section title="Saving" sub="Keep your work safe.">
            <Toggle label="Save backup before risky operations" defaultChecked />
            <Toggle label="Embed used fonts in document" defaultChecked />
            <Toggle label="Auto-save while editing" defaultChecked />
            <Field label="Autosave interval">
              <select className="select" style={{ maxWidth: 240 }}><option>Every 2 minutes</option><option>Every 5 minutes</option><option>Every 10 minutes</option></select>
            </Field>
            <Field label="Default file format">
              <select className="select" style={{ maxWidth: 240 }}><option>.udani</option><option>.udani (legacy)</option></select>
            </Field>
          </Section>
        )}

        {tab === 'performance' && (
          <Section title="Performance" sub="Balance editing speed and preview detail.">
            <Toggle label="Render visible pages first" defaultChecked />
            <Toggle label="Background layout" defaultChecked />
            <Toggle label="Load thumbnails on demand" defaultChecked />
            <Toggle label="Pause unused plugins" defaultChecked />
            <Field label="Image preview quality">
              <select className="select" style={{ maxWidth: 240 }}><option>Balanced</option><option>High</option><option>Fast</option></select>
            </Field>
            <Field label="Hardware acceleration">
              <select className="select" style={{ maxWidth: 240 }}><option>Auto</option><option>On</option><option>Off</option></select>
            </Field>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div className="card mb-4" style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 'var(--fs-18)', margin: '0 0 4px' }}>{title}</h3>
      {sub && <p className="text-sm text-muted" style={{ margin: '0 0 16px' }}>{sub}</p>}
      <div className="stack">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="row" style={{ gap: 12, alignItems: 'center' }}>
      <span style={{ width: 180, flexShrink: 0, color: 'var(--color-text-muted)', fontSize: 'var(--fs-13)' }}>{label}</span>
      {children}
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <input type="checkbox" className="checkbox" defaultChecked={defaultChecked} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
