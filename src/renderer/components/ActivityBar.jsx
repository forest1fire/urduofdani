import React from 'react';
import Icon from './Icons.jsx';
import Brand from './Brand.jsx';
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

export default function ActivityBar({ view, onView, sidenavMode = 'full', onToggleSidenav }) {
  return (
    <nav className="activitybar" aria-label="Activity">
      {/* Brand mark + collapse toggle at the top */}
      <div className="activitybar-top">
        <button
          className="activitybar-brand"
          title="UrduOfDani"
          onClick={onToggleSidenav}
          aria-label="Toggle sidebar"
        >
          <Brand size={22} variant="mark" />
        </button>
        {sidenavMode !== 'hidden' && (
          <button
            className="activitybar-collapse"
            title={`Collapse sidebar (Ctrl+B)${sidenavMode === 'icon' ? ' — currently icon-only' : ''}`}
            onClick={onToggleSidenav}
            aria-label="Toggle sidebar (Ctrl+B)"
          >
            <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

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

      {/* Re-open sidebar (only when collapsed) */}
      {sidenavMode === 'hidden' && (
        <button
          className="activitybar-item activitybar-expand"
          title="Show sidebar (Ctrl+B)"
          onClick={onToggleSidenav}
          aria-label="Show sidebar"
        >
          <Icon.Arrow style={{ width: 18, height: 18 }} />
        </button>
      )}

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
