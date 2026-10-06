import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';
import Brand from './Brand.jsx';

/**
 * SideNav — secondary navigation (file panels) next to the activity bar.
 * Each view is a group of related items, displayed with grouped sections
 * (Photoshop / Figma style).
 *
 * Modes (driven by the App):
 *   - "full"  — labels visible (default)
 *   - "icon"  — only icons, labels in tooltips
 *   - "hidden" — not rendered at all
 */
const NAV = {
  home: {
    label: 'Explore',
    items: [
      { id: 'home',      label: 'Welcome',    Icon: Icon.Home,     route: 'home'      },
      { id: 'recent',    label: 'Recent',     Icon: Icon.Clock,    route: 'home'      },
      { id: 'templates', label: 'Templates',  Icon: Icon.Tiles,    route: 'templates' },
      { id: 'recovery',  label: 'Recovery',   Icon: Icon.Recovery, route: 'recovery'  },
    ],
  },
  editor: {
    label: 'Edit',
    items: [
      { id: 'editor',   label: 'Editor',         Icon: Icon.Edit,     route: 'editor'   },
      { id: 'pages',    label: 'Pages',          Icon: Icon.Doc,      route: 'pages'    },
      { id: 'flow',     label: 'Text flow',      Icon: Icon.Link,     route: 'textflow' },
      { id: 'find',     label: 'Find & replace', Icon: Icon.Search,   route: 'find'     },
      { id: 'keyboard', label: 'Urdu keyboard',  Icon: Icon.Keyboard, route: 'keyboard' },
      { id: 'shortcuts',label: 'Shortcuts',      Icon: Icon.Keyboard, route: 'shortcuts'},
    ],
  },
  review: {
    label: 'Review',
    items: [
      { id: 'spell',  label: 'Spelling',       Icon: Icon.Check,   route: 'spell' },
      { id: 'find-r', label: 'Find & replace', Icon: Icon.Search,  route: 'find'  },
    ],
  },
  design: {
    label: 'Design',
    items: [
      { id: 'masters', label: 'Master pages',  Icon: Icon.Layers,  route: 'masters'  },
      { id: 'contents',label: 'Contents',      Icon: Icon.Book,    route: 'contents' },
      { id: 'styles',  label: 'Styles',        Icon: Icon.Cog,     route: 'styles'   },
      { id: 'fonts',   label: 'Fonts',         Icon: Icon.Type,    route: 'fonts'    },
      { id: 'colors',  label: 'Colors',        Icon: Icon.Color,   route: 'colors'   },
      { id: 'shapes',  label: 'Shape builder', Icon: Icon.Shapes,  route: 'shapes'   },
    ],
  },
  insert: {
    label: 'Insert',
    items: [
      { id: 'images',  label: 'Images',  Icon: Icon.Image,   route: 'images'  },
      { id: 'tables',  label: 'Tables',  Icon: Icon.Table,   route: 'tables'  },
      { id: 'qr',      label: 'QR code', Icon: Icon.QR,      route: 'qr'      },
      { id: 'unicode', label: 'Unicode', Icon: Icon.Refresh, route: 'unicode' },
    ],
  },
  publish: {
    label: 'Publish',
    items: [
      { id: 'export',  label: 'Export & print', Icon: Icon.Print,  route: 'export'  },
      { id: 'plugins', label: 'Plugins',        Icon: Icon.Plug,   route: 'plugins' },
    ],
  },
  settings: {
    label: 'Settings',
    items: [
      { id: 'settings',    label: 'Settings',     Icon: Icon.Settings, route: 'settings'     },
      { id: 'performance', label: 'Performance',  Icon: Icon.Sparkle,  route: 'performance' },
      { id: 'help',        label: 'Help',         Icon: Icon.Help,     route: 'help'        },
    ],
  },
};

export default function SideNav({ view, mode = 'full' }) {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState('');

  const data = NAV[view] || NAV.home;
  const q = filter.trim().toLowerCase();
  const filtered = q ? data.items.filter(i => i.label.toLowerCase().includes(q)) : data.items;
  const isIcon = mode === 'icon';

  return (
    <aside className={`sidenav${isIcon ? ' sidenav-icon' : ''}`} aria-label="Secondary">
      {/* Brand header — only when there's room */}
      {!isIcon && (
        <div className="sidenav-brand">
          <Brand size={22} variant="mark" />
          <div className="sidenav-brand-text">
            <div className="sidenav-brand-name">UrduOfDani</div>
            <div className="sidenav-brand-tag">Urdu · Arabic · RTL</div>
          </div>
        </div>
      )}

      {/* Search (only in full mode) */}
      {!isIcon && (
        <div className="sidenav-search">
          <Icon.Search className="sidenav-search-icon" style={{ width: 13, height: 13 }} />
          <input
            className="input input-sm sidenav-search-input"
            placeholder="Search tools…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Search sidebar"
          />
          {filter && (
            <button
              className="sidenav-search-clear"
              onClick={() => setFilter('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <Icon.Close style={{ width: 10, height: 10 }} />
            </button>
          )}
        </div>
      )}

      <div className="sidenav-section">
        {!isIcon && <span className="sidenav-section-title">{data.label}</span>}
        {filtered.length === 0 ? (
          !isIcon && (
            <div style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-12)' }}>
              No matches for &ldquo;{filter}&rdquo;
            </div>
          )
        ) : filtered.map(item => (
          <button key={item.id}
                  className={`sidenav-item${state.route === item.route ? ' active' : ''}`}
                  onClick={() => item.route && dispatch({ type: 'set-route', route: item.route })}
                  title={isIcon ? item.label : undefined}
                  aria-label={item.label}
                  aria-current={state.route === item.route ? 'page' : undefined}>
            <item.Icon className="icon" />
            {!isIcon && <span className="label">{item.label}</span>}
            {!isIcon && item.shortcut && <span className="shortcut">{item.shortcut}</span>}
          </button>
        ))}
      </div>

      <div className="sidenav-footer">
        {!isIcon ? (
          <>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--color-success)', display: 'inline-block' }} />
              <span>Offline ready</span>
            </div>
            <div style={{ opacity: 0.7 }}>UrduOfDani v{state.version}</div>
            <div className="row" style={{ gap: 4, fontSize: 'var(--fs-11)' }}>
              <span>by</span>
              <strong style={{ color: 'var(--color-text)' }}>Muhammad Danish [Dani]</strong>
            </div>
          </>
        ) : (
          <div className="sidenav-footer-mini">
            <span className="dot" style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--color-success)', display: 'inline-block' }} title="Offline ready" />
          </div>
        )}
      </div>
    </aside>
  );
}
