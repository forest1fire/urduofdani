import React from 'react';
import Icon from './Icons.jsx';
import { useStore } from '../store/Store.jsx';

/**
 * ActivityBar — VS Code–style vertical icon strip on the far left.
 * Each item is a single-purpose "view" toggle; the active one determines
 * the contents of the sidenav.
 *
 *   - Explore  → Home (recent + templates)
 *   - Edit     → Editor tool palette
 *   - Review   → Spell + find
 *   - Design   → Layout, styles, master pages
 *   - Insert   → Images, shapes, tables
 *   - Publish  → Export + print
 *   - Settings → Plugins + settings + perf
 */
const ITEMS = [
  { id: 'home',     Icon: Icon.Home,    title: 'Home (Ctrl+1)' },
  { id: 'editor',   Icon: Icon.Edit,    title: 'Editor (Ctrl+2)' },
  { id: 'review',   Icon: Icon.Check,   title: 'Review (Ctrl+3)' },
  { id: 'design',   Icon: Icon.Layers,  title: 'Design (Ctrl+4)' },
  { id: 'insert',   Icon: Icon.Plus,    title: 'Insert (Ctrl+5)' },
  { id: 'publish',  Icon: Icon.Print,   title: 'Publish (Ctrl+6)' },
  { id: 'settings', Icon: Icon.Settings,title: 'Settings (Ctrl+,)' },
];

export default function ActivityBar({ view, onView }) {
  return (
    <nav className="activitybar" aria-label="Activity">
      {ITEMS.map(it => (
        <button key={it.id}
                className={`activitybar-item${view === it.id ? ' active' : ''}`}
                title={it.title}
                aria-label={it.title}
                aria-pressed={view === it.id}
                onClick={() => onView(it.id)}>
          <it.Icon />
        </button>
      ))}
      <div className="activitybar-spacer" />
      <ThemeToggle />
    </nav>
  );
}

function ThemeToggle() {
  const { state, dispatch } = useStore();
  const isDark = state.theme === 'dark';
  return (
    <button
      className="activitybar-item"
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => dispatch({ type: 'set-theme', theme: isDark ? 'light' : 'dark' })}
      aria-label="Toggle theme"
    >
      {isDark ? <Icon.Sparkle /> : <Icon.Help_O />}
    </button>
  );
}
