import React from 'react';

// Brand asset paths — served by Vite from /brands/.
// The PNGs are the real brand files committed to brands/ in the repo root,
// and `npm run build` copies them into dist/brands/ via scripts/copy-assets.mjs.
const URDUOF_DANI_ICON     = './brands/urduofdani-icon.png';
const URDUOF_DANI_WORDMARK = './brands/urduofdani-wordmark.png';
const DANILABS_ICON        = './brands/danilabs-icon.png';
const DANILABS_ICON_LIGHT  = './brands/danilabs-icon-light.png';
const MD_WORDMARK          = './brands/muhammad-danish-wordmark.png';

/**
 * <Brand /> — UrduOfDani brand surface.
 *
 *  <Brand size={28} />                            — square app icon
 *  <Brand wordmark />                             — full UrduOfDani wordmark banner
 *  <Brand wordmark twoTone />                     — same banner (real PNG is already two-tone)
 *  <Brand personal />                             — Muhammad Danish personal wordmark
 *  <Brand parent />                               — DaniLabs "D" mark on navy
 *  <Brand parent light />                         — DaniLabs "D" mark on light
 *  <Brand mark />                                 — inline "D" mark, navy
 */
export default function Brand({ size = 28, wordmark, twoTone, parent, personal, light, mark, className, style, alt, ...rest }) {
  if (wordmark) {
    return (
      <img src={URDUOF_DANI_WORDMARK}
           alt={alt || 'UrduOfDani — Created by Dani'}
           className={className} style={{ height: size, ...style }} {...rest} />
    );
  }
  if (personal) {
    return (
      <img src={MD_WORDMARK}
           alt={alt || 'Muhammad Danish — DaniLabs'}
           className={className} style={{ height: size, ...style }} {...rest} />
    );
  }
  if (parent) {
    return (
      <img src={light ? DANILABS_ICON_LIGHT : DANILABS_ICON}
           alt={alt || 'DaniLabs'}
           className={className} style={{ height: size, width: size, ...style }} {...rest} />
    );
  }
  if (mark) {
    return (
      <img
        src={URDUOF_DANI_ICON}
        alt={alt || 'UrduOfDani'}
        className={className}
        style={{ width: size, height: size, borderRadius: size * 0.22, ...style }}
        {...rest}
      />
    );
  }
  return (
    <img src={URDUOF_DANI_ICON}
         alt={alt || 'UrduOfDani'}
         className={className}
         style={{ width: size, height: size, borderRadius: size * 0.18, ...style }}
         {...rest} />
  );
}
