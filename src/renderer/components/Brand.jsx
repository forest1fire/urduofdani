import React from 'react';

// Brand: shows the UrduOfDani pen icon at any size, using a single inline
// SVG so the colour stays correct on any background.
//
//  Icon-only <Brand size={28} />
//  Wordmark  <Brand wordmark size={180} />
//  Wordmark navy + emerald <Brand wordmark twoTone size={220} />
//
// We don't load a PNG because the SVG recolours automatically and is
// only 1 KB. The exported PNGs in resources/ are used by Electron for
// the OS-level app icon.

const ICON_SVG = ({ size = 28, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32">
    <rect x="0" y="0" width="32" height="32" rx="7" fill="#008F76"/>
    <g transform="translate(16 16) rotate(-30) translate(-7 -16)">
      <path d="M 4.5 28 C 5 25, 6.5 22, 9 20.5 L 11 22 C 10 24, 8.5 27, 7 30 Z"
            fill="#0E7A65" stroke="#0a5d4d" strokeWidth="0.2"/>
      <rect x="5" y="7.5" width="4" height="16" rx="0.5" fill="#102A43"/>
      <rect x="5" y="7.5" width="4" height="1" fill="#1E3A5F"/>
      <rect x="5" y="22.5" width="4" height="0.8" fill="#1E3A5F"/>
      <path d="M 5 8.2 L 7 1 L 9 8.2 Z" fill="#102A43"/>
      <line x1="7" y1="2" x2="7" y2="7" stroke="#14B89A" strokeWidth="0.25"/>
      <circle cx="7" cy="4" r="0.4" fill="#14B89A"/>
      <text x="7" y="18" textAnchor="middle" fontFamily="'Noto Nastaliq Urdu',serif"
            fontSize="5" fill="#14B89A" fontWeight="700">داني</text>
    </g>
  </svg>
);

const WORDMARK_SVG = ({ size = 180, twoTone = false }) => {
  const emerald = '#008F76';
  const navy    = '#102A43';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * (400 / 1200)}
         viewBox="0 0 1200 400">
      <g transform="translate(50 200) rotate(-30) translate(-100 -200) scale(0.7)">
        <path d="M 70 470 C 80 410, 110 360, 150 340 L 180 360 C 160 400, 130 460, 100 490 Z"
              fill="#0E7A65" stroke="#0a5d4d" strokeWidth="3" strokeLinejoin="round"/>
        <rect x="80" y="120" width="60" height="260" rx="8" fill="#102A43"/>
        <rect x="80" y="120" width="60" height="14" fill="#1E3A5F" rx="2"/>
        <rect x="80" y="368" width="60" height="12" fill="#1E3A5F" rx="2"/>
        <path d="M 80 130 L 110 10 L 140 130 Z" fill="url(#nibGrad)"/>
        <defs>
          <linearGradient id="nibGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1E3A5F"/>
            <stop offset="1" stopColor="#102A43"/>
          </linearGradient>
        </defs>
        <line x1="110" y1="20" x2="110" y2="110" stroke="#14B89A" strokeWidth="3"/>
        <circle cx="110" cy="65" r="6" fill="#14B89A"/>
        <text x="110" y="290" textAnchor="middle"
              fontFamily="'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif"
              fontSize="80" fill="#14B89A" fontWeight="700">داني</text>
        <line x1="92" y1="320" x2="128" y2="320" stroke="#14B89A" strokeWidth="4" strokeLinecap="round"/>
      </g>
      <g transform="translate(310 0)">
        <text x="0" y="220" fontFamily="Inter, system-ui, -apple-system, sans-serif"
              fontSize="130" fontWeight="800" letterSpacing="-2"
              fill={twoTone ? emerald : emerald}>UrduOfDani</text>
        {twoTone && (
          <g fontFamily="Inter, system-ui, sans-serif" fontSize="130" fontWeight="800" letterSpacing="-2" fill={navy}>
            <text x="0"   y="220">U</text>
            <text x="270" y="220">O</text>
            <text x="413" y="220">D</text>
          </g>
        )}
        <text x="0" y="290" fontFamily="Inter, system-ui, sans-serif"
              fontSize="44" fontWeight="700" letterSpacing="6" fill="#1E3A5F">
          CREATED BY DANI
        </text>
        <rect x="0" y="310" width={twoTone ? 540 : 780} height="6" rx="3" fill="#14B89A"/>
      </g>
    </svg>
  );
};

export default function Brand({ size, wordmark, twoTone, className, style, ...rest }) {
  if (wordmark) {
    return <span className={className} style={{ display: 'inline-block', ...style }} {...rest}>
      <WORDMARK_SVG size={size || 180} twoTone={twoTone} />
    </span>;
  }
  return <span className={className} style={{ display: 'inline-block', ...style }} {...rest}>
    <ICON_SVG size={size || 28} />
  </span>;
}
