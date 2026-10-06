import React from 'react';

// Brand asset paths — served by Vite from /resources/.
// The PNGs are the real brand files committed to design/brands/.
const URDUOF_DANI_ICON     = './resources/icon.png';
const URDUOF_DANI_WORDMARK = './resources/wordmark-1100.png';
const DANILABS_ICON        = './resources/danilabs-icon.png';
const DANILABS_ICON_LIGHT  = './resources/danilabs-icon-light.png';
const MD_WORDMARK          = './resources/muhammad-danish-wordmark.png';

/**
 * <Brand /> — UrduOfDani brand surface.
 *
 *  <Brand size={28} />                            — square app icon
 *  <Brand wordmark />                             — full UrduOfDani wordmark banner
 *  <Brand wordmark twoTone />                     — same banner (real PNG is already two-tone)
 *  <Brand parent />                               — DaniLabs parent-brand mark (32 px)
 *  <Brand personal />                             — Muhammad Danish personal wordmark
 *
 * The real PNGs ship in resources/ and are served from /resources/* at runtime.
 * The Brand component is a thin <img> wrapper that lets the OS handle scaling
 * and the browser cache handle repeat loads.
 */
export default function Brand({ size, wordmark, twoTone, parent, personal, light, className, style, alt, ...rest }) {
  let src, width, height, defaultAlt;

  if (wordmark) {
    src = URDUOF_DANI_WORDMARK;
    width  = size || 600;
    height = Math.round(width * (400 / 1200));
    defaultAlt = 'UrduOfDani — Created by Dani';
  } else if (parent) {
    src = light ? DANILABS_ICON_LIGHT : DANILABS_ICON;
    width  = size || 32;
    height = width;
    defaultAlt = 'DaniLabs';
  } else if (personal) {
    src = MD_WORDMARK;
    width  = size || 280;
    height = Math.round(width * (300 / 1200));
    defaultAlt = 'Muhammad Danish — WordPress Developer';
  } else {
    src = URDUOF_DANI_ICON;
    width  = size || 28;
    height = width;
    defaultAlt = 'UrduOfDani';
  }

  return (
    <img
      src={src}
      alt={alt || defaultAlt}
      width={width}
      height={height}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      draggable={false}
      {...rest}
    />
  );
}
