import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './store/Store.jsx';
import TopBar from './components/TopBar.jsx';
import SideNav from './components/SideNav.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import { Toast } from './components/Toast.jsx';

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

const ROUTES = {
  home:           { Page: HomePage,           shell: 'home'    },
  new:            { Page: NewDocPage,         shell: 'tool'    },
  templates:      { Page: TemplatesPage,      shell: 'tool'    },
  recovery:       { Page: RecoveryPage,       shell: 'tool'    },
  editor:         { Page: EditorPage,         shell: 'editor'  },
  pages:          { Page: PagesManagerPage,   shell: 'editor'  },
  masters:        { Page: MastersPage,        shell: 'editor'  },
  textflow:       { Page: TextFlowPage,       shell: 'editor'  },
  contents:       { Page: ContentsPage,       shell: 'editor'  },
  styles:         { Page: StylesPage,         shell: 'editor'  },
  fonts:          { Page: FontsPage,          shell: 'tool'    },
  find:           { Page: FindReplacePage,    shell: 'editor'  },
  spell:          { Page: SpellCheckPage,     shell: 'editor'  },
  images:         { Page: ImagesPage,         shell: 'tool'    },
  colors:         { Page: ColorsShapesPage,   shell: 'tool'    },
  shapes:         { Page: ShapesPage,         shell: 'tool'    },
  tables:         { Page: TablesPage,         shell: 'editor'  },
  export:         { Page: ExportPage,         shell: 'editor'  },
  keyboard:       { Page: KeyboardPracticePage, shell: 'tool'  },
  unicode:        { Page: UnicodeConverterPage,  shell: 'tool'  },
  qr:             { Page: QRPage,             shell: 'tool'    },
  shortcuts:     { Page: ShortcutsPage,      shell: 'tool'    },
  plugins:        { Page: PluginsPage,        shell: 'tool'    },
  settings:       { Page: SettingsPage,       shell: 'tool'    },
  performance:    { Page: PerformancePage,    shell: 'tool'    },
  help:           { Page: HelpPage,           shell: 'tool'    },
};

function Shell() {
  const { state, dispatch } = useStore();
  const [viewport, setViewport] = useState(() => ({
    isMobile:  typeof window !== 'undefined' && window.matchMedia('(max-width: 899.98px)').matches,
    isNarrow:  typeof window !== 'undefined' && window.matchMedia('(min-width: 900px) and (max-width: 1199.98px)').matches,
    isWide:    typeof window !== 'undefined' && window.matchMedia('(min-width: 1200px)').matches,
    isXWide:   typeof window !== 'undefined' && window.matchMedia('(min-width: 1920px)').matches,
  }));

  // Keyboard shortcut: Ctrl/Cmd + K opens the palette.
  useEffect(() => {
    const handler = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        dispatch({ type: 'open-cmd' });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'close-cmd' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Apply theme + scale on document.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
    document.body.style.zoom = String(state.scale / 100);
  }, [state.theme, state.scale]);

  // Persist theme + scale to localStorage so the user's choice survives
  // reloads. Failure is silent (private mode, quota exceeded, etc).
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('udani:theme', state.theme);
        localStorage.setItem('udani:scale', String(state.scale));
      }
    } catch { /* ignore */ }
  }, [state.theme, state.scale]);

  // Track viewport size so we can skip rendering the side nav / inspector at
  // sizes where they'd be hidden by CSS. (CSS still hides them as a fallback.)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queries = [
      { key: 'isMobile', mq: window.matchMedia('(max-width: 899.98px)') },
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

  const route = ROUTES[state.route] || ROUTES.home;
  const Page = route.Page;
  const shell = route.shell;
  const showInspector = (shell === 'editor' || shell === 'tool') && !viewport.isMobile && !viewport.isNarrow;
  const showSideNav    = !viewport.isMobile;

  return (
    <div className="app-shell">
      <TopBar />
      <div className={`app-shell-body ${showInspector ? 'has-inspector' : ''}`}>
        {showSideNav && <SideNav mode={shell} />}
        <main className="main-area" role="main">
          <Page />
        </main>
        {showInspector && <InspectorSlot route={state.route} />}
      </div>
      <CommandPalette />
      <Toast />
    </div>
  );
}

function InspectorSlot({ route }) {
  switch (route) {
    case 'editor': return <EditorInspector />;
    default: return null;
  }
}

function EditorInspector() {
  const { state } = useStore();
  if (!state.activeDocId) return null;
  return (
    <aside className="inspector" aria-label="Properties">
      <h3>Image</h3>
      <details className="inspector-section" open>
        <summary>Crop / Fit</summary>
        <div className="body">
          <div className="thumb" style={{ background: 'linear-gradient(135deg,#d1f2eb,#fff7e6)', height: 90, borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: 12 }}>
            No image selected
          </div>
          <button className="btn btn-secondary" style={{ width: '100%' }}><span>Crop</span></button>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}><span>Replace</span></button>
        </div>
      </details>
      <details className="inspector-section">
        <summary>Dimensions</summary>
        <div className="body">
          <div className="field-row">
            <div><label className="label">W</label><input className="input" defaultValue="170 mm" /></div>
            <div><label className="label">H</label><input className="input" defaultValue="96 mm" /></div>
          </div>
          <label className="label">Resolution</label>
          <select className="select"><option>300 DPI</option><option>150 DPI</option><option>72 DPI</option></select>
        </div>
      </details>
      <details className="inspector-section">
        <summary>Wrap text</summary>
        <div className="body">
          <div style={{ display: 'flex', gap: 6 }}>
            {['None','Wrap','Top','Behind','In front'].map((w, i) => (
              <button key={w} className={`btn btn-sm ${w === 'Wrap' ? 'btn-primary' : 'btn-secondary'}`}>{w}</button>
            ))}
          </div>
        </div>
      </details>
      <details className="inspector-section">
        <summary>Position</summary>
        <div className="body">
          <div className="field-row">
            <div><label className="label">X</label><input className="input" defaultValue="32 mm" /></div>
            <div><label className="label">Y</label><input className="input" defaultValue="58 mm" /></div>
          </div>
        </div>
      </details>
      <details className="inspector-section">
        <summary>Effects</summary>
        <div className="body">
          <label className="label">Opacity</label>
          <input type="range" min={0} max={100} defaultValue={100} style={{ width: '100%' }} />
          <label className="label" style={{ marginTop: 8 }}>Corner radius</label>
          <input className="input" defaultValue="0 mm" />
        </div>
      </details>
      <details className="inspector-section" open>
        <summary>Print check</summary>
        <div className="body">
          <div className="banner banner-success"><span>✓ No issues found</span></div>
        </div>
      </details>
    </aside>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}