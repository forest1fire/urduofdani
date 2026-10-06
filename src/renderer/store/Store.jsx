// Tiny global store with React context, no external deps.
// Holds: documents, settings, plugins, open tabs, language, theme, command palette.

import React, { createContext, useContext, useMemo, useReducer } from 'react';

const uid = () => Math.random().toString(36).slice(2, 10);

const initialDocuments = [
  {
    id: 'd1', name: 'Magazine.udani', kind: 'magazine', language: 'urdu',
    pages: 12, lastOpened: 'Today', updated: Date.now() - 60 * 60 * 1000, dirty: false,
  },
  {
    id: 'd2', name: 'Urdu Book.udani', kind: 'book', language: 'urdu',
    pages: 48, lastOpened: 'Yesterday', updated: Date.now() - 26 * 60 * 60 * 1000, dirty: false,
  },
  {
    id: 'd3', name: 'Invitation.udani', kind: 'invitation', language: 'urdu',
    pages: 1, lastOpened: '2 days ago', updated: Date.now() - 50 * 60 * 60 * 1000, dirty: false,
  },
];

const initialState = {
  route: 'home',
  lang: 'en',         // UI language: en | ur
  theme: 'light',     // light | dark | system
  scale: 100,
  palette: {
    navy: '#102A43', emerald: '#008F76', ivory: '#F7F5EF', gold: '#C69B47', slate: '#64748B', white: '#FFFFFF',
  },
  fonts: [
    { id: 'f1', family: 'Noto Nastaliq Urdu', subtitle: 'Elegant and traditional Urdu typeface', favorite: true, imported: false, kind: 'urdu' },
    { id: 'f2', family: 'Noto Naskh Arabic',  subtitle: 'Clean and modern Urdu typeface',       favorite: false, imported: false, kind: 'urdu' },
    { id: 'f3', family: 'Custom Urdu Font',    subtitle: 'Your imported font',                   favorite: false, imported: true,  kind: 'urdu' },
  ],
  colors: [
    { id: 'c1', name: 'Navy',    hex: '#102A43' },
    { id: 'c2', name: 'Emerald', hex: '#008F76' },
    { id: 'c3', name: 'Ivory',   hex: '#F7F5EF' },
    { id: 'c4', name: 'Gold',    hex: '#C69B47' },
    { id: 'c5', name: 'Slate',   hex: '#64748B' },
    { id: 'c6', name: 'White',   hex: '#FFFFFF' },
  ],
  documents: initialDocuments,
  openDocs: [], // [{ id, unsaved }]
  activeDocId: null,
  plugins: [
    { id: 'p1', name: 'Urdu spell check', enabled: true,  icon: 'A✓', description: 'Check Urdu spelling and grammar as you write.' },
    { id: 'p2', name: 'Unicode converter', enabled: true,  icon: '↔',  description: 'Convert between different Urdu encodings.' },
    { id: 'p3', name: 'QR generator',     enabled: false, icon: '⊞',  description: 'Create QR codes for pages, links or text.' },
    { id: 'p4', name: 'Document tools',   enabled: false, icon: '⌘',  description: 'Additional tools for working with Urdu documents.' },
  ],
  settings: {
    general: {
      theme: 'light', uiLanguage: 'English', uiScale: '100%',
      keyboard: 'Urdu Phonetic', textDirection: 'Right to left', defaultFont: 'Noto Nastaliq Urdu',
    },
    saving: { autosave: true, autosaveInterval: 'Every 2 minutes', keepRecovery: true, recoveryLocation: 'Default' },
    performance: {
      renderVisibleFirst: true, backgroundLayout: true, imagePreviewQuality: 'Balanced',
      loadThumbnailsOnDemand: true, previewCacheLimit: '512 MB', pauseUnusedPlugins: true, hardwareAccel: 'Auto',
    },
  },
  shortcuts: {
    'undo':                       { cmd: 'Undo',                keys: ['Ctrl', 'Z'],                 cat: 'editing' },
    'redo':                       { cmd: 'Redo',                keys: ['Ctrl', 'Shift', 'Z'],        cat: 'editing' },
    'save':                       { cmd: 'Save',                keys: ['Ctrl', 'S'],                 cat: 'editing' },
    'find':                       { cmd: 'Find',                keys: ['Ctrl', 'F'],                 cat: 'editing' },
    'insert-text-frame':          { cmd: 'Insert text frame',   keys: ['Ctrl', 'Shift', 'T'],        cat: 'layout' },
    'duplicate':                  { cmd: 'Duplicate selection', keys: ['Ctrl', 'D'],                 cat: 'layout' },
    'focus-mode':                 { cmd: 'Focus mode',          keys: ['F11'],                       cat: 'view'   },
  },
  cmdPalette: { open: false, query: '' },
  toast: null,
  spell: {
    enabled: true, language: 'Urdu (ur)', suggestions: [
      { id: 's1', find: 'خوبصورتی', replace: 'خوبصورتی' },
      { id: 's2', find: 'خوبصورتیاں', replace: 'خوبصورتیاں' },
      { id: 's3', find: 'خوبصورت',  replace: 'خوبصورت' },
    ], current: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'set-route': return { ...state, route: action.route };
    case 'set-lang':  return { ...state, lang: action.lang };
    case 'set-theme': return { ...state, theme: action.theme, settings: { ...state.settings, general: { ...state.settings.general, theme: action.theme } } };
    case 'set-scale': return { ...state, scale: action.scale };
    case 'open-cmd':  return { ...state, cmdPalette: { ...state.cmdPalette, open: true } };
    case 'close-cmd': return { ...state, cmdPalette: { ...state.cmdPalette, open: false } };
    case 'cmd-query': return { ...state, cmdPalette: { ...state.cmdPalette, query: action.q } };
    case 'open-doc': {
      const exists = state.openDocs.find(d => d.id === action.id);
      const openDocs = exists ? state.openDocs : [...state.openDocs, { id: action.id, unsaved: false }];
      return { ...state, openDocs, activeDocId: action.id, route: 'editor' };
    }
    case 'close-doc': {
      const openDocs = state.openDocs.filter(d => d.id !== action.id);
      const activeDocId = state.activeDocId === action.id ? (openDocs[0]?.id ?? null) : state.activeDocId;
      return { ...state, openDocs, activeDocId, route: openDocs.length === 0 ? 'home' : state.route };
    }
    case 'select-doc': return { ...state, activeDocId: action.id };
    case 'toggle-plugin': {
      const plugins = state.plugins.map(p => p.id === action.id ? { ...p, enabled: !p.enabled } : p);
      return { ...state, plugins };
    }
    case 'new-doc': {
      const id = uid();
      const newDoc = {
        id, name: (action.name || 'Untitled') + '.udani', kind: action.kind || 'blank',
        language: 'urdu', pages: action.pages || 1, lastOpened: 'Just now', updated: Date.now(), dirty: true,
      };
      return {
        ...state, documents: [newDoc, ...state.documents],
        openDocs: [{ id, unsaved: true }], activeDocId: id, route: 'editor',
      };
    }
    case 'update-setting': {
      const { section, key: k, value } = action;
      return { ...state, settings: { ...state.settings, [section]: { ...state.settings[section], [k]: value } } };
    }
    case 'set-shortcut': {
      const { id, keys } = action;
      return { ...state, shortcuts: { ...state.shortcuts, [id]: { ...state.shortcuts[id], keys } } };
    }
    case 'toast': return { ...state, toast: action.t };
    case 'spell-skip': return { ...state, spell: { ...state.spell, current: state.spell.current + 1 } };
    case 'spell-replace': return { ...state, spell: { ...state.spell, current: state.spell.current + 1 } };
    case 'spell-add':   return { ...state, spell: { ...state.spell, current: state.spell.current + 1 } };
    default: return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const v = useContext(StoreContext);
  if (!v) throw new Error('useStore must be inside StoreProvider');
  return v;
};