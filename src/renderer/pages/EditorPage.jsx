import React, { useEffect, useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import { useDocActions } from '../lib/useDocActions.js';
import { emptyDocument } from '../lib/document.js';

const MENUS = [
  { id: 'File',        label: 'File'        },
  { id: 'Edit',        label: 'Edit'        },
  { id: 'Insert',      label: 'Insert'      },
  { id: 'Layout',      label: 'Layout'      },
  { id: 'Type',        label: 'Type'        },
  { id: 'Review',      label: 'Review'      },
  { id: 'View',        label: 'View'        },
];

const TOOLS = [
  { id: 'select',  label: 'Select',  Icon: Icon.Arrow,   shortcut: 'V' },
  { id: 'text',    label: 'Text',    Icon: Icon.Type,    shortcut: 'T' },
  { id: 'image',   label: 'Image',   Icon: Icon.Image,   shortcut: 'I' },
  { id: 'table',   label: 'Table',   Icon: Icon.Table,   shortcut: 'G' },
  { id: 'shapes',  label: 'Shapes',  Icon: Icon.Shapes,  shortcut: 'U' },
  { id: 'link',    label: 'Link',    Icon: Icon.Link,    shortcut: 'L' },
];

const SAMPLE_URDU = `اردو کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔

زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔

یہ ایک نمونہ متن ہے جو آپ کی دستاویز میں ترمیم اور تبدیلی کے لیے حاضر ہے۔ آپ اسے حذف کر کے اپنا مواد شامل کر سکتے ہیں۔`;

export default function EditorPage() {
  const { state, dispatch } = useStore();
  const { save, exportPdf, autosaveDoc } = useDocActions();
  const [mode, setMode] = useState('Design');
  const [tool, setTool] = useState('select');
  const [tab, setTab] = useState('pages');
  const [style, setStyle] = useState('Body Urdu');
  const [zoom, setZoom] = useState(80);

  // Ensure a doc is active
  useEffect(() => {
    if (!state.activeDocId) {
      dispatch({ type: 'new-doc', name: 'Untitled', udani: emptyDocument('Untitled') });
    }
  }, [state.activeDocId, dispatch]);

  const activeDoc = state.activeDoc;
  const doc = state.documents.find(d => d.id === state.activeDocId);
  const titleText = activeDoc?.meta?.title || doc?.name || 'Untitled';
  const firstTextFrame = activeDoc?.pages?.[0]?.frames?.find(f => f.kind === 'text');
  const bodyText = firstTextFrame?.content || SAMPLE_URDU;

  const setFrameContent = (frameId, content) => {
    if (!activeDoc) return;
    const next = JSON.parse(JSON.stringify(activeDoc));
    for (const p of next.pages) {
      const f = p.frames.find(fr => fr.id === frameId);
      if (f) { f.content = content; break; }
    }
    dispatch({ type: 'set-doc', id: activeDoc.meta?.title ? state.activeDocId : state.activeDocId, udani: next });
    autosaveDoc();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu bar */}
      <div className="toolbar">
        <div className="row" style={{ gap: 4, paddingRight: 12, borderRight: '1px solid var(--color-border)' }}>
          {MENUS.map(m => (
            <button key={m.id} className="toolbar-btn" style={{ width: 'auto', padding: '0 10px', height: 32, fontSize: 'var(--fs-13)' }}>{m.label}</button>
          ))}
        </div>
        <div className="topbar-spacer" />
        <div className="btn-group">
          {['Write', 'Design', 'Print'].map(m => (
            <button key={m} className={`btn btn-sm ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={exportPdf} style={{ marginLeft: 8 }}>
          <Icon.Print style={{ width: 14, height: 14 }} /> Export PDF
        </button>
      </div>

      {/* Style toolbar */}
      <div className="toolbar" style={{ background: 'var(--color-bg-sunken)', minHeight: 44 }}>
        <select className="select input-sm" style={{ width: 140 }} value={style} onChange={e => setStyle(e.target.value)}>
          <option>Body Urdu</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
          <option>Caption</option>
          <option>Quote</option>
        </select>
        <select className="select input-sm" style={{ width: 200 }} defaultValue="Noto Nastaliq Urdu">
          <option>Noto Nastaliq Urdu</option>
          <option>Noto Naskh Arabic</option>
          <option>Inter</option>
        </select>
        <select className="select input-sm" style={{ width: 64 }} defaultValue="18">
          <option>14</option><option>16</option><option>18</option><option>24</option><option>32</option>
        </select>
        <span className="divider-v" />
        <button className="toolbar-btn" title="Bold (Ctrl+B)"><Icon.Bold /></button>
        <button className="toolbar-btn" title="Italic (Ctrl+I)"><Icon.Italic /></button>
        <button className="toolbar-btn" title="Underline (Ctrl+U)"><Icon.Underline /></button>
        <span className="divider-v" />
        <button className="toolbar-btn active" title="Align right"><Icon.AlignR /></button>
        <button className="toolbar-btn" title="Justify"><Icon.AlignJ /></button>
        <button className="toolbar-btn" title="Align left"><Icon.AlignL /></button>
        <button className="toolbar-btn" title="Center"><Icon.AlignC /></button>
        <span className="divider-v" />
        <button className="btn btn-secondary btn-sm">
          <Icon.Link style={{ width: 12, height: 12 }} /> RTL
        </button>
        <div className="topbar-spacer" />
        <div className="row" style={{ gap: 4 }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setZoom(z => Math.max(40, z - 10))} title="Zoom out">
            <Icon.Minimize style={{ width: 12, height: 12 }} />
          </button>
          <span className="text-sm text-muted" style={{ minWidth: 44, textAlign: 'center' }}>{zoom}%</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setZoom(z => Math.min(200, z + 10))} title="Zoom in">
            <Icon.Plus style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>

      {/* Editor body: tool rail + page list + canvas + (inspector is in App) */}
      <div style={{ display: 'grid', gridTemplateColumns: '52px 220px 1fr', flex: 1, minHeight: 0, background: 'var(--color-bg-sunken)' }}>
        {/* Tool rail */}
        <aside style={{ background: 'var(--color-bg-elev)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 4 }}>
          {TOOLS.map(t => (
            <button key={t.id}
                    className={`toolbar-btn${tool === t.id ? ' active' : ''}`}
                    onClick={() => setTool(t.id)}
                    title={`${t.label} (${t.shortcut})`}>
              <t.Icon />
            </button>
          ))}
        </aside>

        {/* Page list / layers / assets */}
        <aside style={{ background: 'var(--color-bg-elev)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
          <div className="tabs" style={{ padding: '0 8px' }}>
            <button className={`tab ${tab === 'pages' ? 'active' : ''}`} onClick={() => setTab('pages')}>Pages</button>
            <button className={`tab ${tab === 'layers' ? 'active' : ''}`} onClick={() => setTab('layers')}>Layers</button>
            <button className={`tab ${tab === 'assets' ? 'active' : ''}`} onClick={() => setTab('assets')}>Assets</button>
          </div>
          <div style={{ padding: 12, overflow: 'auto', flex: 1 }}>
            {tab === 'pages' && (
              <div className="grid-2" style={{ gap: 8 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`card card-hoverable${i === 2 ? ' selected' : ''}`} style={{ padding: 6, borderColor: i === 2 ? 'var(--color-primary)' : 'var(--color-border)' }}>
                    <div style={{ aspectRatio: '0.71', background: 'var(--color-bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', borderRadius: 2 }}>
                      <span className="urdu" style={{ fontSize: 18, color: 'var(--color-text)' }}>{['زبان', 'اب', 'اردو', 'روشن', 'تقدس', 'شام', 'سحر', 'تصور'][i]}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{i + 1}{i === 2 ? '-4' : ''}</div>
                  </div>
                ))}
                <button className="card card-flat" style={{ padding: 8, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--fs-12)', cursor: 'pointer' }}>
                  <Icon.Plus style={{ width: 14, height: 14 }} /> Add page
                </button>
              </div>
            )}
            {tab === 'layers' && (
              <div>
                {['Background', 'Master A', 'Image 4', 'Frame 2', 'Frame 1'].map((l, i) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 6, background: i === 1 ? 'var(--color-primary-soft)' : 'transparent', cursor: 'pointer' }}>
                    <span style={{ fontSize: 13 }}>{l}</span>
                    <Icon.Eye style={{ color: 'var(--color-text-muted)', fontSize: 14 }} />
                  </div>
                ))}
              </div>
            )}
            {tab === 'assets' && (
              <div className="grid-2" style={{ gap: 8 }}>
                {['Mountain.jpg', 'Garden.jpg', 'Pattern.png', 'Logo.png'].map(a => (
                  <div key={a} className="card card-flat" style={{ padding: 4, cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '1.4', background: 'linear-gradient(135deg,#D1F2EB,#FBF3E1)', borderRadius: 4 }} />
                    <div style={{ fontSize: 11, marginTop: 4, color: 'var(--color-text-muted)' }}>{a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main style={{ background: 'var(--color-bg-sunken)', overflow: 'auto', padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div className="page-sheet"
               style={{ background: 'white', width: 595 * zoom / 80, minHeight: 842 * zoom / 80, padding: 40, boxShadow: 'var(--shadow-lg)', borderRadius: 4, transition: 'width 200ms ease' }}>
            <div className="frame" style={{ marginBottom: 16 }}>
              <h1
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => firstTextFrame && setFrameContent(firstTextFrame.id, e.currentTarget.textContent)}
                style={{ outline: 'none', color: 'var(--color-text)', fontSize: 28, fontWeight: 700 }}
              >{titleText}</h1>
            </div>
            <div className="frame" style={{ marginBottom: 16 }}>
              <div className="urdu rtl" style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text)' }}>
                {bodyText.split('\n\n')[0]}
              </div>
            </div>
            <div className="frame">
              <div
                className="urdu rtl"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => firstTextFrame && setFrameContent(firstTextFrame.id, e.currentTarget.textContent)}
                style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--color-text)', outline: 'none' }}
              >{bodyText.split('\n\n')[1] || bodyText}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: 12 }}>
              — 1 —
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
