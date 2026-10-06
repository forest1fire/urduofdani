import React, { useEffect, useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

/**
 * Onboarding — a 4-step tour for new users.
 * Triggered by:
 *   - "Start onboarding tour" in the command palette
 *   - First-time launch (state.tourDone === false)
 *
 * Steps target specific UI regions: TopBar, ActivityBar, SideNav, Editor.
 */
const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to UrduOfDani 👋',
    body: 'A modern, offline-first word processor and desktop publishing tool for Urdu and RTL languages. Let\'s take a 30-second tour.',
  },
  {
    id: 'activity',
    title: 'The Activity Bar',
    body: 'On the far left, these icons switch between views — Home, Editor, Review, Design, Insert, and Publish. Try Ctrl+1 through Ctrl+6 to jump around.',
  },
  {
    id: 'sidebar',
    title: 'The Sidebar',
    body: 'Each view shows its own tools in the sidebar. Use the search box at the top to find a tool quickly. The status at the bottom shows you\'re offline-ready.',
  },
  {
    id: 'cmdk',
    title: 'Press ⌘K / Ctrl+K',
    body: 'The global command palette is the fastest way to do anything — new, open, save, export, jump to a page, switch theme. Just press Ctrl+K and start typing.',
    footer: 'Press ⌘K / Ctrl+K any time',
  },
  {
    id: 'done',
    title: 'You\'re ready ✨',
    body: 'Start with "New document" or open an existing .udani file. Your work is auto-saved every few seconds, and everything stays on your device.',
  },
];

export default function Onboarding() {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(0);

  // If user just hit start-tour, show from beginning
  useEffect(() => {
    if (state.tourActive) setStep(0);
  }, [state.tourActive]);

  if (!state.tourActive) return null;
  const s = STEPS[step];
  if (!s) return null;

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else dispatch({ type: 'end-tour' });
  };
  const back = () => setStep(Math.max(0, step - 1));
  const skip = () => dispatch({ type: 'end-tour' });

  return (
    <>
      <div className="tour-backdrop" onClick={skip} />
      <div className="tour-popover" style={{ top: '20vh', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="chip">{step + 1} of {STEPS.length}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={skip} aria-label="Close tour">
            <Icon.Close style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
        {s.footer && (
          <div className="text-sm text-muted" style={{ marginBottom: 16 }}>
            <kbd style={{ marginRight: 4 }}>Ctrl</kbd><kbd>K</kbd> &nbsp;{s.footer}
          </div>
        )}
        <div className="footer">
          <div className="dots">
            {STEPS.map((_, i) => (
              <span key={i} className={`dot${i === step ? ' active' : ''}`} />
            ))}
          </div>
          <div className="spacer" />
          {step > 0 && <button className="btn btn-ghost btn-sm" onClick={back}>Back</button>}
          <button className="btn btn-primary btn-sm" onClick={next}>
            {step === STEPS.length - 1 ? 'Done' : 'Next'}
            {step !== STEPS.length - 1 && <Icon.Arrow style={{ width: 12, height: 12 }} />}
          </button>
        </div>
      </div>
    </>
  );
}
