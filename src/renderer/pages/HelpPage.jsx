import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import Brand from '../components/Brand.jsx';

const TOPICS = [
  { id: 'getting-started', label: 'Getting started', Icon: Icon.Book },
  { id: 'editing-urdu',    label: 'Editing Urdu',    Icon: Icon.Doc },
  { id: 'page-design',     label: 'Page design',     Icon: Icon.Tiles },
  { id: 'fonts-plugins',   label: 'Fonts & plugins', Icon: Icon.Type },
  { id: 'export-print',    label: 'Export & printing', Icon: Icon.Print },
  { id: 'about',           label: 'About',           Icon: Icon.Help_O },
];

const GUIDES = [
  { title: 'Create your first document', steps: '5 steps', icon: <Icon.Doc /> },
  { title: 'Type and format Urdu',     steps: '4 steps', icon: <Icon.Type /> },
  { title: 'Export a PDF',              steps: '3 steps', icon: <Icon.Print /> },
];

const POPULAR = [
  { icon: <Icon.Type />,    label: 'Add a custom font' },
  { icon: <Icon.Link />,    label: 'Link text frames' },
  { icon: <Icon.Layers />,  label: 'Use master pages' },
  { icon: <Icon.Recovery />,label: 'Recover an autosaved document' },
];

export default function HelpPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = React.useState('getting-started');
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Help &amp; about</h1>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'set-lang', lang: 'ur' })}>اردو</button>
          <button className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'set-lang', lang: 'en' })}>EN</button>
        </div>
      </div>
      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          {TOPICS.map(t => (
            <button key={t.id} className={`sidenav-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <t.Icon className="icon" /><span>{t.label}</span>
            </button>
          ))}
        </aside>
        <main>
          <h2 style={{ margin: 0 }}>How can we help?</h2>
          <div style={{ position: 'relative', marginTop: 8 }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
            <input className="input" placeholder="Search help topics" style={{ paddingLeft: 32 }} />
          </div>
          <div className="grid-3" style={{ gap: 16, marginTop: 16 }}>
            {GUIDES.map(g => (
              <div key={g.title} className="card card-hoverable" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ width: 64, height: 64, background: 'var(--emerald-50)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-500)', fontSize: 28 }}>
                  {g.icon}
                </div>
                <h4 style={{ margin: '12px 0 4px', color: 'var(--navy-900)' }}>{g.title}</h4>
                <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: 13 }}>{g.steps}</p>
                <button className="btn btn-secondary" style={{ marginTop: 12, width: '100%' }}>Open guide <Icon.Arrow /></button>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: 24 }}>Popular topics</h3>
          <div className="card" style={{ padding: 0 }}>
            {POPULAR.map((p, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, width: '100%', background: 'transparent', border: 'none', borderBottom: i < POPULAR.length - 1 ? '1px solid var(--slate-100)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: 20 }}>{p.icon}</span>
                <span style={{ flex: 1 }}>{p.label}</span>
                <Icon.Chevron style={{ color: 'var(--slate-300)' }} />
              </button>
            ))}
          </div>
        </main>
        <aside className="card" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto' }}>
            <Brand size={96} />
          </div>
          <h2 style={{ margin: '12px 0 0', color: 'var(--navy-900)' }}>UrduOfDani</h2>
          <p style={{ color: 'var(--slate-500)', margin: '4px 0 4px' }}>Urdu writing &amp; publishing</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <h4 style={{ margin: 0 }}>Created by</h4>
            <h4 style={{ margin: 0, color: 'var(--emerald-600)' }}>Muhammad Danish [Dani]</h4>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: 12, margin: '2px 0 0' }}>DaniLabs</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <Brand parent size={28} light />
            <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>A DaniLabs product</span>
          </div>
          <span className="chip" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)', marginTop: 12 }}>Design concept</span>
          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background='var(--slate-50)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon.Doc style={{ color: 'var(--slate-500)' }} /> Third-party licenses</span>
              <Icon.Chevron style={{ color: 'var(--slate-300)' }} />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background='var(--slate-50)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon.Help_O style={{ color: 'var(--slate-500)' }} /> App information</span>
              <Icon.Chevron style={{ color: 'var(--slate-300)' }} />
            </button>
            <a
              href="mailto:hello.danilabs@gmail.com?subject=UrduOfDani%20support"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--slate-50)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon.Mail style={{ color: 'var(--slate-500)' }} /> Contact &amp; support</span>
              <Icon.Chevron style={{ color: 'var(--slate-300)' }} />
            </a>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--emerald-50), #fff)',
              border: '1px solid var(--emerald-100)',
              textAlign: 'left',
            }}
          >
            <h4 style={{ margin: '0 0 4px', color: 'var(--emerald-600)', fontSize: 13 }}>
              <Icon.Coffee style={{ marginRight: 4, verticalAlign: '-2px' }} />
              Support UrduOfDani
            </h4>
            <p style={{ margin: '0 0 4px', color: 'var(--slate-700)', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>
              UrduOfDani is — and always will be — free for everyone.
            </p>
            <p style={{ margin: '0 0 8px', color: 'var(--slate-500)', fontSize: 12, lineHeight: 1.4 }}>
              The buttons below are an <em>optional</em> way to say thanks
              and help cover server costs. They unlock no features, change
              no behaviour, and the app is identical with or without them.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <a
                href="https://www.buymeacoffee.com/forest1fire"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Buy a coffee
              </a>
              <a
                href="https://github.com/sponsors/forest1fire"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Sponsor
              </a>
            </div>
            <a
              href="mailto:hello.danilabs@gmail.com?subject=UrduOfDani%20hello"
              style={{ display: 'block', marginTop: 8, fontSize: 11, color: 'var(--slate-500)', textAlign: 'center' }}
            >
              hello.danilabs@gmail.com
            </a>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <span>UI concept collection complete</span>
      </div>
    </div>
  );
}