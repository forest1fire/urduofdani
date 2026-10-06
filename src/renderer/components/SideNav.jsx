import React from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';

const NAV_HOME = [
  { id: 'home',     label: 'Home',          Icon: Icon.Home     },
  { id: 'recent',   label: 'Recent files',  Icon: Icon.Clock,   route: 'home' },
  { id: 'templates',label: 'Templates',     Icon: Icon.Tiles,   route: 'templates' },
  { id: 'wsmgr',    label: 'Workspace manager', Icon: Icon.Cog, route: 'plugins' },
  { id: 'help',     label: 'Help',          Icon: Icon.Help,    route: 'help' },
];

const NAV_EDITOR = [
  { id: 'select', label: 'Select',  Icon: Icon.Arrow },
  { id: 'text',   label: 'Text',    Icon: Icon.Type  },
  { id: 'image',  label: 'Image',   Icon: Icon.Image },
  { id: 'table',  label: 'Table',   Icon: Icon.Table },
  { id: 'shapes', label: 'Shapes',  Icon: Icon.Shapes },
];

const NAV_TOOL = [
  { id: 'pages',    label: 'Page manager',     Icon: Icon.Doc,      route: 'pages'   },
  { id: 'masters',  label: 'Master pages',     Icon: Icon.Layers,   route: 'masters' },
  { id: 'flow',     label: 'Text flow',        Icon: Icon.Link,     route: 'textflow' },
  { id: 'contents', label: 'Contents & footnotes', Icon: Icon.Book, route: 'contents' },
  { id: 'styles',   label: 'Document styles',  Icon: Icon.Cog,      route: 'styles' },
  { id: 'fonts',    label: 'Fonts',            Icon: Icon.Type,     route: 'fonts' },
  { id: 'find',     label: 'Find & replace',   Icon: Icon.Search,   route: 'find' },
  { id: 'spell',    label: 'Spelling',         Icon: Icon.Check,    route: 'spell' },
  { id: 'images',   label: 'Images & assets',  Icon: Icon.Image,    route: 'images' },
  { id: 'colors',   label: 'Colors & shapes',  Icon: Icon.Color,    route: 'colors' },
  { id: 'shapes-page', label: 'Shape builder', Icon: Icon.Shapes,   route: 'shapes' },
  { id: 'tables',   label: 'Tables',           Icon: Icon.Table,    route: 'tables' },
  { id: 'export',   label: 'Print & export',   Icon: Icon.Print,    route: 'export' },
  { id: 'keyboard', label: 'Urdu keyboard',    Icon: Icon.Keyboard, route: 'keyboard' },
  { id: 'unicode',  label: 'Unicode converter',Icon: Icon.Refresh,  route: 'unicode' },
  { id: 'qr',       label: 'QR generator',     Icon: Icon.QR,       route: 'qr' },
  { id: 'recovery', label: 'Document recovery',Icon: Icon.Recovery, route: 'recovery' },
  { id: 'shortcuts',label: 'Keyboard shortcuts',Icon:Icon.Keyboard, route: 'shortcuts' },
  { id: 'plugins',  label: 'Plugins',          Icon: Icon.Plug,     route: 'plugins' },
  { id: 'settings', label: 'Settings',         Icon: Icon.Cog,      route: 'settings' },
  { id: 'perf',     label: 'Performance',      Icon: Icon.Sparkle,  route: 'performance' },
];

export default function SideNav({ mode }) {
  const { state, dispatch } = useStore();
  const items = mode === 'home' ? NAV_HOME : (mode === 'editor' ? NAV_EDITOR : NAV_TOOL);

  const isActive = (item) => {
    if (item.route) return state.route === item.route;
    return mode === 'editor' && state.route === 'editor' && state.activeDocId;
  };

  return (
    <aside className="sidenav" aria-label="Primary">
      {items.map(item => (
        <button key={item.id} className={`sidenav-item${isActive(item) ? ' active' : ''}`}
                onClick={() => item.route && dispatch({ type: 'set-route', route: item.route })}>
          <item.Icon className="icon" />
          <span>{item.label}</span>
        </button>
      ))}

      <div className="sidenav-footer">
        {mode === 'home' && (
          <>
            <div style={{ marginTop: 'auto', paddingTop: 24 }}>Created by</div>
            <div className="credit"><Icon.Pen style={{ color: 'var(--emerald-500)' }} /> Dani</div>
          </>
        )}
        {mode !== 'home' && (
          <>
            <div>Offline ready</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: 'var(--emerald-500)' }}>
              <Icon.Check /> Ready
            </div>
          </>
        )}
      </div>
    </aside>
  );
}