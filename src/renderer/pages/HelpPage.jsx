import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import Brand from '../components/Brand.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TOPICS = [
  { id: 'getting-started', label: 'Getting started',     Icon: Icon.Book,   body: 'Install, set up your keyboard, and create your first Urdu document in under 5 minutes.' },
  { id: 'editing-urdu',    label: 'Editing Urdu',        Icon: Icon.Type,   body: 'Type in Urdu, switch languages, and use the right-to-left editor with confidence.' },
  { id: 'page-design',     label: 'Page design',         Icon: Icon.Tiles,  body: 'Set up master pages, frames, columns, and document-wide styles.' },
  { id: 'fonts-plugins',   label: 'Fonts & plugins',     Icon: Icon.Plug,   body: 'Install Urdu fonts, manage plugins, and extend the editor with .udaniplugin packages.' },
  { id: 'export-print',    label: 'Export & printing',   Icon: Icon.Print,  body: 'Export to PDF, share your work, and configure print settings.' },
  { id: 'about',           label: 'About',               Icon: Icon.Help_O, body: 'About UrduOfDani, DaniLabs, and the people behind it.' },
];

const GUIDES = [
  { title: 'Create your first document',  minutes: 3, Icon: Icon.Doc   },
  { title: 'Type and format Urdu',        minutes: 5, Icon: Icon.Type  },
  { title: 'Export a PDF',                 minutes: 2, Icon: Icon.Print },
  { title: 'Install an Urdu font',         minutes: 2, Icon: Icon.Image },
  { title: 'Master pages',                 minutes: 4, Icon: Icon.Layers },
  { title: 'Spell-check your document',    minutes: 2, Icon: Icon.Check },
];

const POPULAR = [
  { Icon: Icon.Type,    label: 'Add a custom font' },
  { Icon: Icon.Link,    label: 'Link text frames' },
  { Icon: Icon.Layers,  label: 'Use master pages' },
  { Icon: Icon.Recovery,label: 'Recover an autosaved document' },
  { Icon: Icon.Print,   label: 'Export to PDF' },
  { Icon: Icon.Keyboard,label: 'Switch keyboard layouts' },
];

export default function HelpPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('getting-started');
  const [q, setQ] = useState('');

  const filteredTopics = q
    ? TOPICS.filter(t => t.label.toLowerCase().includes(q.toLowerCase()) || t.body.toLowerCase().includes(q.toLowerCase()))
    : TOPICS;

  return (
    <div className="page">
      <PageHeader
        title="Help & about"
        subtitle="Search guides, find answers, and learn what's new."
        back
      />

      <div className="page-body">
        <div className="page-3col" style={{ gridTemplateColumns: '240px minmax(0, 1fr) 320px', gap: 24 }}>
          <aside>
            <h5>Topics</h5>
            <input
              className="input input-sm input-search mb-4"
              placeholder="Search help…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div className="stack-sm">
              {filteredTopics.map(t => (
                <button key={t.id}
                        className={`sidenav-item${tab === t.id ? ' active' : ''}`}
                        onClick={() => setTab(t.id)}>
                  <t.Icon className="icon" />
                  <span className="label">{t.label}</span>
                </button>
              ))}
              {filteredTopics.length === 0 && (
                <div className="text-sm text-muted" style={{ padding: 8 }}>No matches</div>
              )}
            </div>
          </aside>

          <main>
            <h2 style={{ margin: 0 }}>{TOPICS.find(t => t.id === tab)?.label}</h2>
            <p className="text-muted">{TOPICS.find(t => t.id === tab)?.body}</p>

            <div className="section-head mt-6" style={{ marginTop: 24 }}>
              <div>
                <h3>Guided tutorials</h3>
                <div className="sub text-muted text-sm">Step-by-step walkthroughs.</div>
              </div>
            </div>
            <div className="grid-3" style={{ gap: 12, marginBottom: 24 }}>
              {GUIDES.map(g => (
                <div key={g.title} className="card card-hoverable" style={{ cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <g.Icon />
                  </span>
                  <h4 style={{ margin: '0 0 4px', fontSize: 'var(--fs-14)' }}>{g.title}</h4>
                  <p className="text-xs text-muted" style={{ margin: 0 }}>{g.minutes} min read</p>
                </div>
              ))}
            </div>

            <div className="section-head" style={{ marginBottom: 8 }}>
              <div>
                <h3>Popular articles</h3>
              </div>
            </div>
            <div className="card card-flat" style={{ padding: 0 }}>
              {POPULAR.map((p, i) => (
                <button key={i}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', width: '100%', background: 'transparent', border: 'none', borderBottom: i < POPULAR.length - 1 ? '1px solid var(--color-border)' : 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}><p.Icon style={{ width: 18, height: 18 }} /></span>
                  <span style={{ flex: 1, fontSize: 'var(--fs-14)' }}>{p.label}</span>
                  <Icon.Chevron style={{ color: 'var(--color-text-subtle)', width: 14, height: 14 }} />
                </button>
              ))}
            </div>

            <div className="card mt-6" style={{ marginTop: 24, background: 'var(--color-primary-soft)', borderColor: 'transparent' }}>
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon.Sparkle />
                </span>
                <div>
                  <h4 style={{ margin: '0 0 4px' }}>Need more help?</h4>
                  <p className="text-sm" style={{ margin: '0 0 8px', color: 'var(--color-text)' }}>
                    Press <kbd>Ctrl</kbd>+<kbd>K</kbd> to open the command palette, or email us at <a href="mailto:hello.danilabs@gmail.com">hello.danilabs@gmail.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </main>

          <aside>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ margin: '0 auto 8px' }}>
                <Brand size={64} />
              </div>
              <h2 style={{ margin: '4px 0', color: 'var(--color-text)' }}>UrduOfDani</h2>
              <p className="text-sm text-muted" style={{ margin: '0 0 8px' }}>Urdu writing &amp; publishing</p>
              <div className="row" style={{ justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Created by</span>
                <strong style={{ color: 'var(--color-primary)' }}>Muhammad Danish [Dani]</strong>
              </div>
              <p className="text-xs text-muted" style={{ margin: 0 }}>DaniLabs</p>
              <div className="row" style={{ justifyContent: 'center', gap: 6, marginTop: 12 }}>
                <Brand parent size={24} light />
                <span className="text-xs text-muted">A DaniLabs product</span>
              </div>
              <span className="chip" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)', marginTop: 12 }}>
                Free for everyone
              </span>

              <div className="stack-sm mt-4" style={{ marginTop: 16, textAlign: 'left' }}>
                <a href="mailto:hello.danilabs@gmail.com?subject=UrduOfDani%20support"
                   style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, color: 'var(--color-text)', borderRadius: 6 }}>
                  <Icon.Mail style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} /> Contact &amp; support
                </a>
                <a href="https://github.com/forest1fire/urduofdani"
                   style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, color: 'var(--color-text)', borderRadius: 6 }}>
                  <Icon.Link style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} /> GitHub repo
                </a>
                <button onClick={() => dispatch({ type: 'set-route', route: 'shortcuts' })}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)', borderRadius: 6, width: '100%', textAlign: 'left' }}>
                  <Icon.Keyboard style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} /> Keyboard shortcuts
                </button>
                <button onClick={() => dispatch({ type: 'set-route', route: 'performance' })}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)', borderRadius: 6, width: '100%', textAlign: 'left' }}>
                  <Icon.Sparkle style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} /> Performance tips
                </button>
              </div>
            </div>

            <div className="card mt-4" style={{ marginTop: 16, background: 'linear-gradient(135deg, var(--color-accent-soft), #fff)' }}>
              <h4 style={{ margin: '0 0 4px', color: 'var(--color-accent)', fontSize: 'var(--fs-14)' }}>
                <Icon.Coffee style={{ marginRight: 4, verticalAlign: '-2px', width: 14, height: 14 }} />
                Support UrduOfDani
              </h4>
              <p className="text-sm" style={{ margin: '0 0 4px', fontWeight: 500 }}>
                Free for everyone — forever.
              </p>
              <p className="text-xs text-muted" style={{ margin: '0 0 12px' }}>
                Donations are an <em>optional</em> way to say thanks. The app is identical with or without them.
              </p>
              <div className="row" style={{ gap: 6 }}>
                <a href="https://www.buymeacoffee.com/forest1fire" target="_blank" rel="noopener noreferrer"
                   className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Buy a coffee
                </a>
                <a href="https://github.com/sponsors/forest1fire" target="_blank" rel="noopener noreferrer"
                   className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Sponsor
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
