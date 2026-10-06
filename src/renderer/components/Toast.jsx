import React, { useEffect } from 'react';
import { useStore } from '../store/Store.jsx';

const COLORS = {
  ok:    { bg: '#008F76', fg: '#FFFFFF' },
  info:  { bg: '#1E3A5F', fg: '#FFFFFF' },
  warn:  { bg: '#C69B47', fg: '#102A43' },
  error: { bg: '#C53030', fg: '#FFFFFF' },
};

export function Toast() {
  const { state, dispatch } = useStore();
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'toast', t: null }), 2400);
    return () => clearTimeout(t);
  }, [state.toast]);

  if (!state.toast) return null;

  // Support both old string and new { kind, msg } shape.
  const isObj = typeof state.toast === 'object';
  const kind  = isObj ? (state.toast.kind || 'ok')  : 'ok';
  const msg   = isObj ? state.toast.msg  : state.toast;
  const palette = COLORS[kind] || COLORS.ok;

  return (
    <div role="status" aria-live="polite" style={{
      position: 'fixed', bottom: 24, right: 24,
      background: palette.bg, color: palette.fg,
      padding: '10px 16px', borderRadius: 10, boxShadow: 'var(--shadow-lg)',
      fontSize: 14, zIndex: 2000, display: 'flex', alignItems: 'center', gap: 8,
      animation: 'toast-in 0.18s ease-out',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 18, height: 18, borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 700,
      }}>{kind === 'ok' ? '✓' : kind === 'error' ? '!' : kind === 'warn' ? '⚠' : 'i'}</span>
      <span>{msg}</span>
    </div>
  );
}

export default Toast;
