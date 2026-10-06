import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const FRAMES = [
  { id: 1, label: 'Page 3, right column' },
  { id: 2, label: 'Page 3, left column' },
  { id: 3, label: 'Page 4, right column' },
  { id: 4, label: 'Page 4, left column' },
];

export default function TextFlowPage() {
  const { dispatch } = useStore();
  const [sel, setSel] = useState(2);
  return (
    <div className="page">
      <PageHeader title={"Text flow"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div className="page-3col">
        <aside>
          <h3 style={{ margin: 0 }}>Story frames</h3>
          <div style={{ marginTop: 12 }}>
            {FRAMES.map(f => (
              <div key={f.id} className={`card card-hoverable${sel === f.id ? ' selected' : ''}`}
                   style={{ padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon.Move style={{ color: 'var(--color-text-subtle)' }} />
                <span style={{ fontSize: 13 }}>{f.id} · {f.label}</span>
              </div>
            ))}
          </div>
        </aside>
        <main>
          <div className="spread">
            <div className="page-sheet">
              <div className="page-num" style={{ textAlign: 'left' }}>3</div>
              <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 16, color: 'var(--color-text)', textAlign: 'right' }}>اردو کی خوبصورتی</div>
              <div className="frame selected" style={{ position: 'relative' }}>
                <span className="frame-number">2</span>
                <div className="urdu rtl" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  اردو زبان کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔ اردو کی اپنی ایک الگ شناخت ہے۔
                </div>
              </div>
              <div className="frame" style={{ position: 'relative' }}>
                <span className="frame-number">1</span>
                <div className="urdu rtl" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  اردو ایک لسانی اور لہجے کی زبان ہے۔ اس کی ایک خوبصورت تاریخ ہے۔ زبان کے بنیادی قواعد، اس کے الفاظ کا چننے اور اس کے ڈھانچے کی بناوٹ اسے منفرد بناتی ہے۔
                </div>
              </div>
              <div className="page-num">3</div>
            </div>
            <div className="page-sheet">
              <div className="page-num" style={{ textAlign: 'left' }}>4</div>
              <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 16, color: 'var(--color-text)', textAlign: 'right' }}>اردو کی خوبصورتی</div>
              <div className="frame" style={{ position: 'relative' }}>
                <span className="frame-number">3</span>
                <div className="urdu rtl" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  اردو کی خوبصورتی کا ایک اہم پہلو اس کی شاعری ہے۔ دیوان، غزل اور نظمیں، ان میں الفاظ کا چناؤ اور معنی کی گہرائی قابل داد ہے۔
                </div>
              </div>
              <div className="frame" style={{ position: 'relative' }}>
                <span className="frame-number">4</span>
                <div className="urdu rtl" style={{ fontSize: 11, lineHeight: 1.8 }}>
                  آج کے دور میں بھی اردو کی اہمیت کم نہیں ہوئی ہے۔ یہ اب بھی لاکھوں لوگوں کی مادری زبان ہے۔ یہ ایک ایسی زبان ہے جس نے صدیوں سے انسانوں کو اپنے سحر میں جکڑ رکھا ہے۔
                </div>
              </div>
              <div className="page-num">4</div>
            </div>
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Frame {sel}</h3>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 6, fontSize: 13 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Page</span><span>{FRAMES[sel - 1].label}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Previous</span><span>Frame {sel - 1}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Next</span>
            <select className="select"><option>Frame {sel + 1 <= FRAMES.length ? sel + 1 : 1}</option></select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Link /> Link next frame</button>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}>Unlink next</button>
          <hr style={{ margin: '16px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <strong>Overflow</strong>
          <div className="banner banner-warning" style={{ marginTop: 6 }}>⚠ 12 words need a frame</div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}>Add linked frame</button>
          <hr style={{ margin: '16px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" /> Create document when overflow occurs
          </label>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Continue this story across linked frames.</p>
        </aside>
      </div>
      <div className="statusbar">
        <span>Story 1 / 4 frames</span>
        <div className="right"><span>75%</span><button className="btn btn-primary" style={{ marginLeft: 12 }}>Done</button></div>
      </div>
    </div>
  );
}