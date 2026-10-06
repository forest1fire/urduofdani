import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const SAMPLE_URDU = `اردو کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔

زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔

یہ ایک نمونہ متن ہے جو آپ کی دستاویز میں ترمیم اور تبدیلی کے لیے حاضر ہے۔ آپ اسے حذف کر کے اپنا مواد شامل کر سکتے ہیں۔`;

const MENUS = ['File', 'Edit', 'Insert', 'Layout', 'Typography', 'Review'];
const MODES = ['Write', 'Design', 'Print'];

export default function EditorPage() {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState('Design');
  const [tool, setTool] = useState('select');
  const [tab, setTab] = useState('pages');
  const doc = state.documents.find(d => d.id === state.activeDocId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="toolbar">
        <div style={{ display: 'flex', gap: 12, paddingRight: 12, borderRight: '1px solid var(--slate-100)' }}>
          {MENUS.map(m => (
            <button key={m} className="toolbar-btn" style={{ width: 'auto', padding: '0 8px' }}>{m}</button>
          ))}
        </div>
        <div className="topbar-spacer" />
        <div style={{ display: 'flex', gap: 4, background: 'var(--slate-50)', padding: 4, borderRadius: 8 }}>
          {MODES.map(m => (
            <button key={m} className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className="topbar-spacer" />
        <span style={{ color: 'var(--slate-500)', fontSize: 13 }}>{doc?.kind === 'book' ? 'اردو' : 'EN'}</span>
        <button className="btn btn-primary"><Icon.Print /> Export PDF</button>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '6px 16px', borderBottom: '1px solid var(--slate-100)', background: 'var(--white)' }}>
        <select className="select" style={{ width: 130 }} defaultValue="Body Urdu"><option>Body Urdu</option><option>Heading 1</option><option>Heading 2</option></select>
        <select className="select" style={{ width: 180 }} defaultValue="Noto Nastaliq Urdu"><option>Noto Nastaliq Urdu</option><option>Noto Naskh Arabic</option></select>
        <select className="select" style={{ width: 70 }} defaultValue="18"><option>14</option><option>18</option><option>24</option></select>
        <div className="toolbar-divider" />
        <button className="toolbar-btn"><Icon.Bold /></button>
        <button className="toolbar-btn"><Icon.Italic /></button>
        <button className="toolbar-btn"><Icon.Underline /></button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn active"><Icon.AlignR /></button>
        <button className="toolbar-btn"><Icon.AlignJ /></button>
        <button className="toolbar-btn"><Icon.AlignL /></button>
        <button className="toolbar-btn"><Icon.AlignC /></button>
        <div className="toolbar-divider" />
        <button className="btn btn-primary btn-sm">↩ RTL</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '52px 220px 1fr', flex: 1, minHeight: 0 }}>
        <aside style={{ background: 'var(--white)', borderRight: '1px solid var(--slate-100)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4 }}>
          {[
            { id: 'select', icon: Icon.Arrow },
            { id: 'text',   icon: Icon.Type  },
            { id: 'image',  icon: Icon.Image },
            { id: 'table',  icon: Icon.Table },
            { id: 'shapes', icon: Icon.Shapes },
          ].map(t => (
            <button key={t.id} className={`toolbar-btn${tool === t.id ? ' active' : ''}`}
                    onClick={() => setTool(t.id)} title={t.id}>
              <t.icon />
            </button>
          ))}
        </aside>

        <aside style={{ background: 'var(--white)', borderRight: '1px solid var(--slate-100)', display: 'flex', flexDirection: 'column' }}>
          <div className="tabs" style={{ padding: 0 }}>
            {['Pages', 'Layers', 'Assets'].map(t => (
              <button key={t} className={`tab${tab === t.toLowerCase() ? ' active' : ''}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
            ))}
          </div>
          <div style={{ padding: 12, overflow: 'auto', flex: 1 }}>
            {tab === 'pages' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`card card-hoverable${i === 2 ? ' selected' : ''}`} style={{ padding: 6 }}>
                    <div style={{ aspectRatio: '0.71', background: 'var(--ivory-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--slate-100)' }}>
                      <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, color: 'var(--navy-900)' }}>{['زبان', 'اب', 'اردو', 'روشن', 'تقدس', 'شام', 'سحر', 'تصور'][i]}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>{i + 1}{i === 2 ? '-4' : ''}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'layers' && (
              <div>
                {['Background', 'Master A', 'Image 4', 'Frame 2', 'Frame 1'].map((l, i) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 6, background: i === 1 ? 'var(--emerald-50)' : 'transparent' }}>
                    <span style={{ fontSize: 13 }}>{l}</span>
                    <Icon.Eye style={{ color: 'var(--slate-300)', fontSize: 14 }} />
                  </div>
                ))}
              </div>
            )}
            {tab === 'assets' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Mountain.jpg', 'Garden.jpg', 'Architecture.jpg', 'Pattern.png'].map(a => (
                  <div key={a} className="card" style={{ padding: 4 }}>
                    <div style={{ aspectRatio: '1.4', background: 'linear-gradient(135deg,#d1f2eb,#fff7e6)', borderRadius: 4 }} />
                    <div style={{ fontSize: 11, marginTop: 4, color: 'var(--slate-500)' }}>{a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--slate-100)' }}>
            <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Master pages</summary></details>
            <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Document styles</summary></details>
          </div>
        </aside>

        <main style={{ background: 'var(--slate-50)', overflow: 'auto', padding: 24 }}>
          <div className="spread">
            <div className="page-sheet">
              <div className="page-num" style={{ textAlign: 'left' }}>3</div>
              <div className="frame">
                <h1>زبان اور ثقافت</h1>
              </div>
              <div className="frame">
                <div className="urdu rtl" style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {SAMPLE_URDU.split('\n\n')[0]}
                </div>
              </div>
              <div className="frame selected">
                <div className="urdu rtl" style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {SAMPLE_URDU.split('\n\n')[1]}
                </div>
              </div>
              <div className="page-num">3</div>
            </div>
            <div className="page-sheet">
              <div className="page-num" style={{ textAlign: 'left' }}>4</div>
              <div className="frame">
                <h1>روشن مستقبل</h1>
              </div>
              <div className="frame" style={{ position: 'relative' }}>
                <span className="frame-number">2</span>
                <div style={{
                  background: 'linear-gradient(135deg,#fdbb74,#fc8d4f)',
                  height: 140, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 600,
                }}>Mountain.jpg</div>
              </div>
              <div className="frame">
                <span className="frame-number">1</span>
                <div className="urdu rtl" style={{ fontSize: 13, lineHeight: 1.8 }}>
                  اردو مرف ایک زبان ہے۔ یہ ایک ایسی زبان ہے جو ہکے ہزاروں لوگوں کی زبان ہے۔
                </div>
              </div>
              <div className="page-num">4</div>
            </div>
          </div>
        </main>
      </div>

      <div className="statusbar">
        <button className="toolbar-btn" style={{ width: 24, height: 24 }}><Icon.ArrowLeft style={{ fontSize: 12 }} /></button>
        <span>Page 3-4 of 12</span>
        <button className="toolbar-btn" style={{ width: 24, height: 24 }}><Icon.Arrow style={{ fontSize: 12 }} /></button>
        <div className="right">
          <span>اردو</span><span>Focus</span><span>—</span><span>80%</span>
        </div>
      </div>
    </div>
  );
}