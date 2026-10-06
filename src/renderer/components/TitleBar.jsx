import React from 'react';
import Brand from './Brand.jsx';

/**
 * TitleBar — the very top strip of the app (window chrome, 32px tall).
 * Shows the app name, the current document name, and the OS window controls.
 * Draggable area for the OS to move the window.
 */
export default function TitleBar({ docName, isMac }) {
  return (
    <div className="titlebar" role="presentation">
      {isMac && <div style={{ width: 70 }} />}
      <span className="app-name">
        <Brand size={14} />
        <span>UrduOfDani</span>
        {docName && <span style={{ opacity: 0.6 }}>— {docName}</span>}
      </span>
      <div className="window-controls">
        <button className="window-btn" title="Minimize" aria-label="Minimize">
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 5h8" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>
        </button>
        <button className="window-btn" title="Maximize" aria-label="Maximize">
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
        </button>
        <button className="window-btn close" title="Close" aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}
