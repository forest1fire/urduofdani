// ResponsivePage — a tiny, semantic 1/2/3-column page wrapper.
//
// Usage:
//   <ResponsivePage left={...} right={...}>main content</ResponsivePage>
//   <ResponsivePage left={...} right={...} center={...}>centered</ResponsivePage>
//   <ResponsivePage right={...}>main only with right inspector</ResponsivePage>
//
// The CSS classes .page-3col / .page-2col / .page-1col (in responsive.css)
// handle the actual media queries. We render all three slots but with
// .col-aside-l / .col-aside-r selectors so CSS can hide them per breakpoint.

import React from 'react';

export default function ResponsivePage({ left, center, right, children, className = '', as: Tag = 'div' }) {
  const cols = (left ? 1 : 0) + (center ? 1 : 0) + (right ? 1 : 0);
  let cls = '';
  if (cols >= 3) cls = 'page-3col';
  else if (cols === 2) cls = 'page-2col';
  else cls = 'page-1col';
  return (
    <Tag className={`${cls} ${className}`} style={{ padding: 'clamp(16px, 2.5vw, 32px)', width: '100%', boxSizing: 'border-box' }}>
      {left   && <aside className="col-aside-l"  style={{ minWidth: 0 }}>{left}</aside>}
      {center && <main   className="col-main"    style={{ minWidth: 0 }}>{center}</main>}
      {children && !center && <main className="col-main" style={{ minWidth: 0 }}>{children}</main>}
      {right  && <aside className="col-aside-r" style={{ minWidth: 0 }}>{right}</aside>}
    </Tag>
  );
}