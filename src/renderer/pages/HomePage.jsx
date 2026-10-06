import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function HomePage() {
  const { state, dispatch } = useStore();

  return (
    <div className="page" style={{ padding: 32, background: 'var(--white)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 44, marginBottom: 8 }}>Start something beautiful in Urdu</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: 18, margin: 0 }}>Create, open and continue your documents.</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--slate-50)', padding: 4, borderRadius: 8 }}>
          <button className="btn btn-sm btn-ghost">Urdu</button>
          <button className="btn btn-sm btn-primary">EN</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: 'set-route', route: 'new' })}>
          <Icon.Plus /> New document
        </button>
        <button className="btn btn-secondary btn-lg"><Icon.Doc /> Open document</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <section className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: 'var(--navy-900)' }}>Recent documents</h2>
              <div style={{ position: 'relative' }}>
                <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
                <input className="input" placeholder="Search recent documents…" style={{ paddingLeft: 32, width: 280 }} />
              </div>
            </div>
            <p style={{ color: 'var(--slate-500)', margin: '0 0 12px' }}>Pick up where you left off.</p>
            <table className="table">
              <thead><tr><th>Name</th><th>Type</th><th>Last opened</th><th></th></tr></thead>
              <tbody>
                {state.documents.map(d => (
                  <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => dispatch({ type: 'open-doc', id: d.id })}>
                    <td>
                      <span style={{ color: 'var(--emerald-500)', marginRight: 8 }}><Icon.Doc /></span>
                      {d.name}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{d.kind}</td>
                    <td>{d.lastOpened}</td>
                    <td>{d.kind === 'magazine' && <Icon.Star style={{ color: 'var(--emerald-500)' }} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 22, color: 'var(--navy-900)' }}>Templates</h2>
              <button className="btn btn-ghost" onClick={() => dispatch({ type: 'set-route', route: 'templates' })}>
                View all <Icon.Arrow style={{ fontSize: 12 }} />
              </button>
            </div>
            <p style={{ color: 'var(--slate-500)', margin: '0 0 16px' }}>Beautiful designs to help you get started.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { id: 't1', title: 'Urdu Book',          sub: 'A clean and elegant book layout',     bg: 'linear-gradient(135deg,#F7F5EF,#E7E2D1)', border: '#C69B47' },
                { id: 't2', title: 'Editorial Magazine', sub: 'Stylish magazine for articles and stories', bg: 'linear-gradient(135deg,#102A43,#243B53)', border: '#243B53' },
                { id: 't3', title: 'Wedding Invitation', sub: 'A graceful invitation design',        bg: 'linear-gradient(135deg,#FFF5E1,#FDE2C2)', border: '#C69B47' },
              ].map(t => (
                <div key={t.id} className="card card-hoverable" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 160, background: t.bg, borderBottom: `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 28, color: t.bg.includes('102A43') ? '#F7F5EF' : '#102A43' }}>
                      {t.title.includes('Book') ? 'اردو کتاب' : t.title.includes('Magazine') ? 'اداری مجلہ' : 'شادی کی دعوت'}
                    </span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{t.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--slate-500)' }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <section className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 22, color: 'var(--navy-900)' }}>Quick start</h3>
            <p style={{ color: 'var(--slate-500)', margin: '4px 0 16px' }}>Choose a document type to get started.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Blank A4 page',  size: '210 × 297 mm' },
                { label: 'Book (A5)',      size: '148 × 210 mm' },
                { label: 'Poster (A4)',    size: '210 × 297 mm' },
              ].map((q, i) => (
                <button key={q.label} className={`card card-hoverable`}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, textAlign: 'left',
                                 borderColor: i === 0 ? 'var(--emerald-500)' : 'var(--slate-100)' }}
                        onClick={() => dispatch({ type: 'new-doc', name: q.label, kind: q.label.toLowerCase().includes('book') ? 'book' : q.label.toLowerCase().includes('poster') ? 'poster' : 'blank', pages: 1 })}>
                  <span style={{ color: 'var(--emerald-500)' }}><Icon.Doc style={{ fontSize: 22 }} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{q.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{q.size}</div>
                  </div>
                  <Icon.Arrow style={{ color: 'var(--slate-500)' }} />
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ color: 'var(--emerald-500)' }}><Icon.Help_O style={{ fontSize: 22 }} /></span>
              <div>
                <h4 style={{ margin: 0, color: 'var(--navy-900)' }}>Offline editing available</h4>
                <p style={{ color: 'var(--slate-500)', margin: '4px 0 0', fontSize: 13 }}>
                  Your documents stay on your device.<br />No account required.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}