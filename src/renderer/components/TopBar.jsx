import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

export default function TopBar() {
  const { state, dispatch } = useStore();
  const saved = state.openDocs.length > 0 && !state.openDocs.some(d => d.unsaved);

  return (
    <header className="topbar" role="banner">
      <div className="topbar-logo">
        <Icon.Pen className="pen" />
        <span>UrduOfDani</span>
      </div>

      {state.openDocs.length > 0 && state.openDocs.map(d => {
        const doc = state.documents.find(x => x.id === d.id);
        if (!doc) return null;
        const isActive = state.activeDocId === d.id;
        return (
          <div key={d.id} className={`topbar-tab${isActive ? ' active' : ''}`}
               onClick={() => dispatch({ type: 'select-doc', id: d.id })}>
            <Icon.Doc style={{ marginRight: 6, fontSize: 14 }} />
            <span>{doc.name}</span>
            {d.unsaved && <span style={{ marginLeft: 6, color: '#14B89A' }}>●</span>}
            <Icon.Close style={{ marginLeft: 6, fontSize: 14, opacity: 0.7 }}
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'close-doc', id: d.id }); }} />
          </div>
        );
      })}

      {state.openDocs.length > 0 && (
        <button className="topbar-btn" title="New tab"
                onClick={() => dispatch({ type: 'set-route', route: 'new' })}>+</button>
      )}

      <div className="topbar-spacer" />

      <input className="topbar-search" placeholder="Search…" readOnly
             onClick={() => dispatch({ type: 'open-cmd' })} />
      <kbd style={{ color: '#94A3B8' }}>Ctrl + K</kbd>

      {state.openDocs.length > 0 && (
        <span className="saved-pill" style={{ background: saved ? '#E7F8F4' : 'transparent', color: saved ? '#008F76' : 'rgba(255,255,255,0.85)' }}>
          {saved ? '✓ Saved' : '● Unsaved'}
        </span>
      )}

      <button className="topbar-btn" title="Toggle language"
              onClick={() => dispatch({ type: 'set-lang', lang: state.lang === 'en' ? 'ur' : 'en' })}>
        {state.lang === 'en' ? 'اردو' : 'EN'}
      </button>

      <button className="window-btn" title="Minimize">─</button>
      <button className="window-btn" title="Maximize">▢</button>
      <button className="window-btn" title="Close">✕</button>
    </header>
  );
}