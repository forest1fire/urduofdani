import React from 'react';

// Inline SVG icons. Uses heroicons-style 1.5px stroke. Sized by parent font-size.
const make = (paths, viewBox = '0 0 24 24') => (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {paths}
  </svg>
);

export const Icon = {
  Pen:        make(<><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /><path d="m14.5 6.5 3 3" /></>),
  Home:       make(<><path d="m3 12 9-9 9 9" /><path d="M5 10v10h14V10" /></>),
  Clock:      make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  Doc:        make(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></>),
  Book:       make(<><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" /><path d="M20 4h-3a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h4Z" /></>),
  Layers:     make(<><path d="m12 2 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>),
  Tiles:      make(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>),
  Image:      make(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  Table:      make(<><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></>),
  Shapes:     make(<><circle cx="7" cy="17" r="3" /><rect x="11" y="3" width="10" height="10" rx="2" /><path d="m16 17 3 3" /></>),
  Plug:       make(<><path d="M9 2v6M15 2v6" /><path d="M6 8h12v3a6 6 0 0 1-12 0Z" /><path d="M12 17v5" /></>),
  Keyboard:   make(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>),
  Settings:   make(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>),
  Cog:        make(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.7.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>),
  Help:       make(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 4.7 1c0 1.7-2.2 2-2.2 4" /><path d="M12 17h.01" /></>),
  Search:     make(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  Plus:       make(<><path d="M12 5v14M5 12h14" /></>),
  Check:      make(<><path d="m4 12 5 5 11-12" /></>),
  Arrow:      make(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  ArrowLeft:  make(<><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>),
  Close:      make(<><path d="M6 6l12 12M18 6 6 18" /></>),
  Chevron:    make(<><path d="m9 6 6 6-6 6" /></>),
  Star:       make(<><path d="m12 3 2.7 6 6.3.6-4.8 4.2 1.4 6.2L12 17l-5.6 3 1.4-6.2L3 9.6 9.3 9Z" /></>),
  Bold:       make(<><path d="M7 5h6a3 3 0 0 1 0 6H7Zm0 6h7a3 3 0 0 1 0 6H7Z" /></>),
  Italic:     make(<><path d="M10 5h8M6 19h8M14 5l-4 14" /></>),
  Underline:  make(<><path d="M6 4v8a6 6 0 0 0 12 0V4" /><path d="M4 20h16" /></>),
  AlignL:     make(<><path d="M3 6h14M3 12h10M3 18h16" /></>),
  AlignC:     make(<><path d="M3 6h12M3 12h10M3 18h14" /></>),
  AlignR:     make(<><path d="M3 6h16M7 12h10M5 18h14" /></>),
  AlignJ:     make(<><path d="M3 6h14M3 12h10M3 18h16" /></>),
  Link:       make(<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>),
  QR:         make(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM18 18h3v3h-3z" /></>),
  Eye:        make(<><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>),
  Hide:       make(<><path d="M3 12s4-8 9-8c2 0 3.5.5 5 1.5" /><path d="M21 12s-4 8-9 8c-2 0-3.5-.5-5-1.5" /><path d="m3 3 18 18" /></>),
  Refresh:    make(<><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>),
  Edit:       make(<><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  Trash:      make(<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>),
  Download:   make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>),
  Upload:     make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>),
  Print:      make(<><path d="M6 9V2h12v7" /><rect x="3" y="9" width="18" height="9" rx="2" /><path d="M6 14h12v8H6Z" /></>),
  Sparkle:    make(<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>),
  Recovery:   make(<><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></>),
  Help_O:     make(<><circle cx="12" cy="12" r="9" /></>),
  Globe:      make(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>),
  Type:       make(<><path d="M4 6V4h16v2" /><path d="M12 4v16" /><path d="M9 20h6" /></>),
  Color:      make(<><circle cx="12" cy="12" r="9" /><circle cx="8" cy="9" r="1.5" fill="currentColor" /><circle cx="15" cy="9" r="1.5" fill="currentColor" /><circle cx="17" cy="14" r="1.5" fill="currentColor" /></>),
  Minimize:   make(<><path d="M5 19h14" /></>),
  Maximize:   make(<><rect x="5" y="5" width="14" height="14" rx="1" /></>),
  Restore:    make(<><rect x="7" y="7" width="12" height="12" rx="1" /><path d="M5 15V5h10" /></>),
};

export default Icon;