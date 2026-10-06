import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

// Tiny QR-like pattern renderer (placeholder; real QR generation would use a lib).
function FakeQR({ fg, bg }) {
  const cells = 21;
  const grid = [];
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const inFinderTL = i < 7 && j < 7;
      const inFinderTR = i < 7 && j > cells - 8;
      const inFinderBL = i > cells - 8 && j < 7;
      const isFinder = inFinderTL || inFinderTR || inFinderBL;
      const finderFilled = isFinder && ((i === 0 || i === 6 || j === 0 || j === 6) || (i > 1 && i < 5 && j > 1 && j < 5)
        || (inFinderTR && ((j === cells - 1 || j === cells - 7) || (i > 1 && i < 5 && j > cells - 6 && j < cells - 2)))
        || (inFinderBL && ((i === cells - 1 || i === cells - 7) || (i > cells - 6 && i < cells - 2 && j > 1 && j < 5))));
      const on = finderFilled || (!isFinder && Math.random() > 0.55);
      grid.push(<rect key={`${i}-${j}`} x={j * 4} y={i * 4} width="4" height="4" fill={on ? fg : bg} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${cells * 4} ${cells * 4}`} width="200" height="200">
      <rect width="100%" height="100%" fill={bg} />
      {grid}
    </svg>
  );
}

export default function QRPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('link');
  const [url, setUrl] = useState('https://example.com');
  const [fg, setFg] = useState('navy');
  const [bg, setBg] = useState('white');
  return (
    <div className="page">
      <PageHeader title={"QR code generator"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <header style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Add a QR code to your page</h2>
        <p className="text-muted" style={{ margin: "4px 0 0" }}>Create a code for a link or text.</p>
      </header>
      <div className="page-2col">
        <main>
          <div className="chip-row">
            <button className={`chip${tab === 'link' ? ' active' : ''}`} onClick={() => setTab('link')}><Icon.Link /> Link</button>
            <button className={`chip${tab === 'text' ? ' active' : ''}`} onClick={() => setTab('text')}><Icon.Doc /> Text</button>
          </div>
          <label className="label" style={{ marginTop: 16 }}>Website address</label>
          <input className="input" value={url} onChange={e => setUrl(e.target.value)} />
          <h4 style={{ marginTop: 16 }}>Appearance</h4>
          <div className="grid-2" style={{ gap: 16 }}>
            <div><label className="label">Foreground color</label>
              <select className="select" value={fg} onChange={e => setFg(e.target.value)}><option value="navy">Navy</option><option value="emerald">Emerald</option><option value="black">Black</option></select>
            </div>
            <div><label className="label">Background color</label>
              <select className="select" value={bg} onChange={e => setBg(e.target.value)}><option value="white">White</option><option value="ivory">Ivory</option></select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginTop: 16 }}>
            <div><label className="label">Physical size</label><div style={{ display: 'flex' }}><input className="input" defaultValue="30" /><select className="select"><option>mm</option><option>cm</option></select></div></div>
            <div><label className="label">Margin (quiet zone)</label><div style={{ display: 'flex' }}><input className="input" defaultValue="4" /><select className="select"><option>modules</option></select></div></div>
            <div><label className="label">Error correction</label><select className="select"><option>Medium</option><option>Low</option><option>High</option></select></div>
          </div>
          <p style={{ marginTop: 8, color: 'var(--color-info)', fontSize: 13 }}><Icon.Help_O /> Keep strong contrast and clear space around the code.</p>
          <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Advanced options</summary></details>
        </main>
        <aside>
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
            <FakeQR fg={fg === 'navy' ? '#102A43' : fg === 'emerald' ? '#008F76' : '#000'} bg={bg === 'white' ? '#fff' : '#F7F5EF'} />
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 8, textAlign: 'center' }}>Preview concept — generate and test before use.</p>
          <div className="card" style={{ marginTop: 12 }}>
            <h4 style={{ margin: 0 }}>Summary</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div>
                <Icon.Link /> <strong>Link</strong>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{url}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--color-text-muted)' }}>Size</div>
                <div><strong>30 × 30 mm</strong></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }}><Icon.Download /> Download PNG</button>
            <button className="btn btn-primary" style={{ flex: 1 }}><Icon.Arrow /> Insert into document</button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" defaultChecked /> Keep editable in document
            <a href="#" style={{ marginLeft: 'auto', fontSize: 13 }}>Clear</a>
          </label>
        </aside>
      </div>
    </div>
  );
}