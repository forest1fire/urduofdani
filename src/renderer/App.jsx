import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './store/Store.jsx';
import TitleBar from './components/TitleBar.jsx';
import TopBar from './components/TopBar.jsx';
import ActivityBar from './components/ActivityBar.jsx';
import SideNav from './components/SideNav.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import { Toast } from './components/Toast.jsx';
import Onboarding from './components/Onboarding.jsx';
import Inspector from './components/Inspector.jsx';

import HomePage from './pages/HomePage.jsx';
import NewDocPage from './pages/NewDocPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import RecoveryPage from './pages/RecoveryPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import PagesManagerPage from './pages/PagesManagerPage.jsx';
import MastersPage from './pages/MastersPage.jsx';
import TextFlowPage from './pages/TextFlowPage.jsx';
import ContentsPage from './pages/ContentsPage.jsx';
import StylesPage from './pages/StylesPage.jsx';
import FontsPage from './pages/FontsPage.jsx';
import FindReplacePage from './pages/FindReplacePage.jsx';
import SpellCheckPage from './pages/SpellCheckPage.jsx';
import ImagesPage from './pages/ImagesPage.jsx';
import ColorsShapesPage from './pages/ColorsShapesPage.jsx';
import ShapesPage from './pages/ShapesPage.jsx';
import TablesPage from './pages/TablesPage.jsx';
import ExportPage from './pages/ExportPage.jsx';
import KeyboardPracticePage from './pages/KeyboardPracticePage.jsx';
import UnicodeConverterPage from './pages/UnicodeConverterPage.jsx';
import QRPage from './pages/QRPage.jsx';
import ShortcutsPage from './pages/ShortcutsPage.jsx';
import PluginsPage from './pages/PluginsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PerformancePage from './pages/PerformancePage.jsx';
import HelpPage from './pages/HelpPage.jsx';

/**
 * Route → shell config:
 *   home  — landing dashboard (no inspector, no sidenav for activity bar, sidebar shows welcome)
 *   tool  — single-page tool (sidenav tools, inspector on the right)
 *   editor — full editor with side rail of frame types, full properties on the right
 */
const ROUTES = {
  home:         { Page: HomePage,           shell: 'home',     view: 'home',     inspector: false },
  new:          { Page: NewDocPage,         shell: 'tool',     view: 'home',     inspector: true  },
  templates:    { Page: TemplatesPage,      shell: 'tool',     view: 'home',     inspector: true  },
  recovery:     { Page: RecoveryPage,       shell: 'tool',     view: 'home',     inspector: false },
  editor:       { Page: EditorPage,         shell: 'editor',   view: 'editor',   inspector: true  },
  pages:        { Page: PagesManagerPage,   shell: 'tool',     view: 'editor',   inspector: true  },
  masters:      { Page: MastersPage,        shell: 'tool',     view: 'design',   inspector: false },
  textflow:     { Page: TextFlowPage,       shell: 'tool',     view: 'editor',   inspector: false },
  contents:     { Page: ContentsPage,       shell: 'tool',     view: 'design',   inspector: false },
  styles:       { Page: StylesPage,         shell: 'tool',     view: 'design',   inspector: false },
  fonts:        { Page: FontsPage,          shell: 'tool',     view: 'design',   inspector: false },
  find:         { Page: FindReplacePage,    shell: 'tool',     view: 'editor',   inspector: false },
  spell:        { Page: SpellCheckPage,     shell: 'tool',     view: 'review',   inspector: false },
  images:       { Page: ImagesPage,         shell: 'tool',     view: 'insert',   inspector: true  },
  colors:       { Page: ColorsShapesPage,   shell: 'tool',     view: 'design',   inspector: true  },
  shapes:       { Page: ShapesPage,         shell: 'tool',     view: 'design',   inspector: true  },
  tables:       { Page: TablesPage,         shell: 'tool',     view: 'insert',   inspector: true  },
  export:       { Page: ExportPage,         shell: 'tool',     view: 'publish',  inspector: true  },
  keyboard:     { Page: KeyboardPracticePage, shell: 'tool',   view: 'editor',   inspector: false },
  unicode:      { Page: UnicodeConverterPage,  shell: 'tool',   view: 'insert',   inspector: false },
  qr:           { Page: QRPage,             shell: 'tool',     view: 'insert',   inspector: true  },
  shortcuts:    { Page: ShortcutsPage,      shell: 'tool',     view: 'settings', inspector: false },
  plugins:      { Page: PluginsPage,        shell: 'tool',     view: 'settings', inspector: false },
  settings:     { Page: SettingsPage,       shell: 'tool',     view: 'settings', inspector: false },
  performance:  { Page: PerformancePage,    shell: 'tool',     view: 'settings', inspector: false },
  help:         { Page: HelpPage,           shell: 'tool',     view: 'settings', inspector: false },
};

function Shell() {
  const { state, dispatch } = useStore();
  const [viewport, setViewport] = useState(() => ({
    isMobile:  typeof window !== 'undefined' && window.matchMedia('(max-width: 559.98px)').matches,
    isTablet:  typeof window !== 'undefined' && window.matchMedia('(min-width: 560px) and (max-width: 899.98px)').matches,
    isNarrow:  typeof window !== 'undefined' && window.matchMedia('(min-width: 900px) and (max-width: 1199.98px)').matches,
    isWide:    typeof window !== 'undefined' && window.matchMedia('(min-width: 1200px)').matches,
    isXWide:   typeof window !== 'undefined' && window.matchMedia('(min-width: 1920px)').matches,
  }));
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [activityView, setActivityView] = useState('home');
  // 'full' = full labels, 'icon' = icon-only, 'hidden' = no sidebar at all
  const [sidenavMode, setSidenavMode] = useState(() => {
    try { return localStorage.getItem('uod:sidenavMode') || 'full'; }
    catch { return 'full'; }
  });

  // Cycle: full → icon → hidden → full
  const cycleSidenav = () => {
    setSidenavMode(prev => {
      const next = prev === 'full' ? 'icon' : prev === 'icon' ? 'hidden' : 'full';
      try { localStorage.setItem('uod:sidenavMode', next); } catch {}
      return next;
    });
  };

  // ⌘K / Esc / Ctrl+1..6 / Ctrl+, / Ctrl+B  global shortcuts
  useEffect(() => {
    const handler = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;
      const k = e.key.toLowerCase();
      if (k === 'k') { e.preventDefault(); dispatch({ type: 'open-cmd' }); return; }
      if (k === 'escape') { dispatch({ type: 'close-cmd' }); return; }
      if (k === ',') { e.preventDefault(); dispatch({ type: 'set-route', route: 'settings' }); return; }
      if (k === 'b') { e.preventDefault(); cycleSidenav(); return; }
      if (k === '1') { e.preventDefault(); setActivityView('home');     return; }
      if (k === '2') { e.preventDefault(); setActivityView('editor');   return; }
      if (k === '3') { e.preventDefault(); setActivityView('review');   return; }
      if (k === '4') { e.preventDefault(); setActivityView('design');   return; }
      if (k === '5') { e.preventDefault(); setActivityView('insert');   return; }
      if (k === '6') { e.preventDefault(); setActivityView('publish');  return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Apply theme + scale on document.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
    document.body.style.zoom = String(state.scale / 100);
  }, [state.theme, state.scale]);

  // Persist theme + scale to localStorage.
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('udani:theme', state.theme);
        localStorage.setItem('udani:scale', String(state.scale));
      }
    } catch { /* ignore */ }
  }, [state.theme, state.scale]);

  // Auto-start tour on first run
  useEffect(() => {
    try {
      const seen = localStorage.getItem('udani:tourDone');
      if (!seen) {
        // small delay so the UI renders first
        setTimeout(() => dispatch({ type: 'start-tour' }), 800);
      }
    } catch { /* ignore */ }
  }, [dispatch]);

  // Watch viewport for layout decisions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queries = [
      { key: 'isMobile', mq: window.matchMedia('(max-width: 559.98px)') },
      { key: 'isTablet', mq: window.matchMedia('(min-width: 560px) and (max-width: 899.98px)') },
      { key: 'isNarrow', mq: window.matchMedia('(min-width: 900px) and (max-width: 1199.98px)') },
      { key: 'isWide',   mq: window.matchMedia('(min-width: 1200px)') },
      { key: 'isXWide',  mq: window.matchMedia('(min-width: 1920px)') },
    ];
    const update = () => {
      const next = {};
      for (const { key, mq } of queries) next[key] = mq.matches;
      setViewport(prev => ({ ...prev, ...next }));
    };
    update();
    for (const { mq } of queries) {
      if (mq.addEventListener) mq.addEventListener('change', update);
      else mq.addListener(update);
    }
    return () => {
      for (const { mq } of queries) {
        if (mq.removeEventListener) mq.removeEventListener('change', update);
        else mq.removeListener(update);
      }
    };
  }, []);

  // When route changes, set the activity view to match
  useEffect(() => {
    const r = ROUTES[state.route];
    if (r) setActivityView(r.view);
  }, [state.route]);

  const route = ROUTES[state.route] || ROUTES.home;
  const Page = route.Page;
  const showInspector = route.inspector && !viewport.isMobile && !viewport.isTablet;
  const showActivity = !viewport.isMobile;     // hide activity bar on phones
  const showSideNav   = !viewport.isMobile && sidenavMode !== 'hidden';
  const isWideViewport = viewport.isXWide;
  const docName = state.documents.find(d => d.id === state.activeDocId)?.name;

  return (
    <div className={`app-shell sidenav-${sidenavMode}`}>
      <TitleBar docName={docName} />
      <TopBar />
      <div className={`app-shell-body${showInspector ? ' has-inspector' : ''}${isWideViewport && showInspector ? ' inspector-wide' : ''}`}>
        {showActivity && (
          <ActivityBar
            view={activityView}
            onView={setActivityView}
            sidenavMode={sidenavMode}
            onToggleSidenav={cycleSidenav}
          />
        )}
        {viewport.isMobile && sidenavOpen && <div className="sidenav-backdrop" onClick={() => setSidenavOpen(false)} />}
        {showSideNav && (
          <SideNav view={activityView} mode={sidenavMode} />
        )}
        <main className="main-area" role="main" onClick={() => setSidenavOpen(false)}>
          <Page />
        </main>
        {showInspector && <Inspector route={state.route} />}
      </div>
      <div className="statusbar" role="status">
        <span className="status-item"><span className="dot" />Offline ready</span>
        <span className="status-item">v{state.version || "1.2.0"}</span>
        <span className="spacer" />
        <span className="status-item">Page <strong style={{ color: 'white' }}>1 of 1</strong></span>
        <span className="status-item">Auto-save: <strong style={{ color: 'var(--color-success)' }}>on</strong></span>
        <span className="status-item">UTF-8 · RTL</span>
        <span className="status-item">{state.lang === 'en' ? 'English' : 'اردو'}</span>
        <span className="status-item">Muhammad Danish [Dani] · DaniLabs</span>
      </div>

      <CommandPalette />
      <Toast />
      <Onboarding />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
