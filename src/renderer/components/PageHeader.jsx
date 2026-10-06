import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

/**
 * PageHeader — the standard "back / title / actions" header for inner pages.
 * Renders inside the .page-header container.
 */
export default function PageHeader({ title, subtitle, back, onBack, actions, breadcrumb }) {
  const { dispatch } = useStore();
  return (
    <div className="page-header" role="region" aria-label={typeof title === 'string' ? title : undefined}>
      {(back !== false) && (
        <button className="page-back" onClick={onBack || (() => dispatch({ type: 'set-route', route: 'home' }))} aria-label="Back">
          <Icon.ArrowLeft style={{ width: 16, height: 16 }} /> Back
        </button>
      )}
      <div className="flex-1" style={{ minWidth: 0 }}>
        {breadcrumb && (
          <div className="text-xs text-muted" style={{ marginBottom: 2 }}>{breadcrumb}</div>
        )}
        <h1 className="page-title" style={{ margin: 0 }}>{title}</h1>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="row" style={{ gap: 8 }}>{actions}</div>}
    </div>
  );
}
