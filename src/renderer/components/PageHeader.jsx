// PageHeader — small reusable header with back button + title + optional right slot.
import React from 'react';
import Icon from './Icons.jsx';

export default function PageHeader({ onBack, backLabel = 'Back', title, right }) {
  return (
    <div className="page-header" style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 2.5vw, 32px) 0', flexWrap: 'wrap', gap: 12 }}>
      {onBack && (
        <button className="page-back" onClick={onBack}>
          <Icon.ArrowLeft /> {backLabel}
        </button>
      )}
      <h1 className="page-title" style={{ marginLeft: onBack ? 16 : 0, margin: 0 }}>{title}</h1>
      {right && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>}
    </div>
  );
}