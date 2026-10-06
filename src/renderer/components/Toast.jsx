import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

/**
 * Toast — a small ephemeral notification, top-right or bottom-right.
 * Use dispatch({ type: 'toast', t: { kind: 'ok'|'warn'|'err'|'info', msg: 'Saved!' } }).
 */
export function Toast() {
  const { state, dispatch } = useStore();
  const toasts = state.toasts || [];

  return (
    <div className="toast-host" aria-live="polite" aria-atomic="false">
      {toasts.map(t => {
        const IconCmp = t.kind === 'err' ? Icon.Close
                      : t.kind === 'warn' ? Icon.Help_O
                      : t.kind === 'ok'   ? Icon.Check
                      : Icon.Sparkle;
        return (
          <div key={t.id} className={`toast ${t.kind || 'info'}`} role="status">
            <IconCmp className="icon" />
            <div className="msg">{t.msg}</div>
            {t.action && (
              <button className="btn btn-ghost btn-sm" onClick={t.action.onClick}>
                {t.action.label}
              </button>
            )}
            <button className="btn btn-ghost btn-icon btn-sm close-btn" aria-label="Dismiss"
                    onClick={() => dispatch({ type: 'dismiss-toast', id: t.id })}>
              <Icon.Close style={{ width: 12, height: 12 }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
