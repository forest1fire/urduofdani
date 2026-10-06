import React, { useEffect } from 'react';
import { useStore } from '../store/Store.jsx';

export function Toast() {
  const { state, dispatch } = useStore();
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'toast', t: null }), 1800);
    return () => clearTimeout(t);
  }, [state.toast]);
  if (!state.toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      background: 'var(--navy-900)', color: '#fff',
      padding: '10px 16px', borderRadius: 8, boxShadow: 'var(--shadow-lg)',
      fontSize: 14, zIndex: 2000,
    }}>{state.toast}</div>
  );
}

export default Toast;