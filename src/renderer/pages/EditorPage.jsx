import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import { useDocActions } from '../lib/useDocActions.js';
import { emptyDocument } from '../lib/document.js';

/**
 * EditorPage — the heart of the app.
 *
 * Inspired by Microsoft Word, InPage, CorelDRAW and Adobe InDesign.
 * The editor is a 3-zone workspace:
 *   - Top:    Menu bar + Ribbon (Home / Insert / Layout / Type / Review / View)
 *   - Middle: Tool rail | Page list / Layers / Assets | Canvas
 *   - Bottom: Editor statusbar (word count, page, line, col, zoom, language, saved)
 *
 * Features:
 *   - Collapsible ribbon groups with descriptive tooltips
 *   - 4 zoom levels + fit-to-width
 *   - 3 canvas themes (white paper / sepia / dark)
 *   - 8 page sizes (A4 portrait/landscape, A3, A5, Letter, Legal, B5, Custom)
 *   - RTL/LTR direction toggle, multi-column layout
 *   - Live word/character count
 *   - Ruler with margin markers
 *   - Page navigation (prev/next)
 *   - Document title in breadcrumb
 *   - Floating selection mini-toolbar (Word-style)
 *   - Find & replace (Ctrl+H)
 *   - Save indicator with last-saved time
 */

const SAMPLE_URDU = `اردو زبان کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔

زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔`;

const PAGE_SIZES = {
  A4P: { label: 'A4 Portrait',  w: 595,  h: 842  },
  A4L: { label: 'A4 Landscape', w: 842,  h: 595  },
  A3P: { label: 'A3 Portrait',  w: 842,  h: 1190 },
  A5P: { label: 'A5 Portrait',  w: 420,  h: 595  },
  LTR: { label: 'Letter',       w: 612,  h: 792  },
  LGL: { label: 'Legal',        w: 612,  h: 1008 },
  B5P: { label: 'B5 Portrait',  w: 499,  h: 709  },
  CUS: { label: 'Custom',       w: 595,  h: 842  },
};

const STYLES = [
  { id: 'body',    label: 'Body Urdu',     size: 18, bold: false, italic: false, color: '#102A43' },
  { id: 'h1',      label: 'Heading 1',     size: 32, bold: true,  italic: false, color: '#0F4C3A' },
  { id: 'h2',      label: 'Heading 2',     size: 26, bold: true,  italic: false, color: '#0F4C3A' },
  { id: 'h3',      label: 'Heading 3',     size: 22, bold: true,  italic: false, color: '#102A43' },
  { id: 'caption', label: 'Caption',       size: 12, bold: false, italic: true,  color: '#64748B' },
  { id: 'quote',   label: 'Quote',         size: 18, bold: false, italic: true,  color: '#475569' },
  { id: 'code',    label: 'Code',          size: 14, bold: false, italic: false, color: '#1E293B' },
  { id: 'sub',     label: 'Subtitle',      size: 16, bold: false, italic: true,  color: '#475569' },
];

const FONTS = [
  { id: 'noto-nastaliq', label: 'Noto Nastaliq Urdu', stack: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif' },
  { id: 'noto-naskh',    label: 'Noto Naskh Arabic',  stack: '"Noto Naskh Arabic", "Amiri", serif' },
  { id: 'scheherazade',  label: 'Scheherazade',       stack: '"Scheherazade New", serif' },
  { id: 'amiri',         label: 'Amiri',              stack: 'Amiri, serif' },
  { id: 'inter',         label: 'Inter',              stack: 'Inter, system-ui, sans-serif' },
  { id: 'roboto',        label: 'Roboto',             stack: 'Roboto, sans-serif' },
  { id: 'merriweather',  label: 'Merriweather',       stack: 'Merriweather, serif' },
  { id: 'jetbrains',     label: 'JetBrains Mono',     stack: '"JetBrains Mono", monospace' },
];

const RIBBON = [
  { id: 'Home',    label: 'Home',    groups: ['clipboard', 'font', 'paragraph', 'styles'] },
  { id: 'Insert',  label: 'Insert',  groups: ['pages', 'tables', 'media', 'shapes'] },
  { id: 'Layout',  label: 'Layout',  groups: ['page', 'margins', 'columns'] },
  { id: 'Type',    label: 'Type',    groups: ['typography', 'list', 'effects'] },
  { id: 'Review',  label: 'Review',  groups: ['spell', 'comments', 'tracking'] },
  { id: 'View',    label: 'View',    groups: ['display', 'zoom'] },
];

const TOOLS = [
  { id: 'select',  label: 'Select tool',  Icon: Icon.Arrow,    shortcut: 'V' },
  { id: 'text',    label: 'Text frame',   Icon: Icon.TextBox,  shortcut: 'T' },
  { id: 'image',   label: 'Image',        Icon: Icon.Image,    shortcut: 'I' },
  { id: 'table',   label: 'Table',        Icon: Icon.Table,    shortcut: 'G' },
  { id: 'shapes',  label: 'Shape',        Icon: Icon.Shapes,   shortcut: 'U' },
  { id: 'link',    label: 'Hyperlink',    Icon: Icon.Link,     shortcut: 'L' },
  { id: 'pen',     label: 'Free draw',    Icon: Icon.Pen,      shortcut: 'P' },
  { id: 'comment', label: 'Comment',      Icon: Icon.Comment,  shortcut: 'C' },
];

const URDU_PAGE_LABELS = ['زبان', 'اب', 'اردو', 'روشن', 'تقدس', 'شام', 'سحر', 'تصور', 'خواب', 'سفر', 'تاریخ', 'یاد'];

export default function EditorPage() {
  const { state, dispatch } = useStore();
  const { save, exportPdf, autosaveDoc } = useDocActions();
  const [ribbon, setRibbon]     = useState('Home');
  const [tool, setTool]         = useState('select');
  const [sideTab, setSideTab]   = useState('pages');
  const [style, setStyle]       = useState('body');
  const [font, setFont]         = useState('noto-nastaliq');
  const [fontSize, setFontSize] = useState(18);
  const [bold, setBold]         = useState(false);
  const [italic, setItalic]     = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign]       = useState('right');     // default for Urdu RTL
  const [zoom, setZoom]         = useState(80);
  const [pageSize, setPageSize] = useState('A4P');
  const [orientation, setOrientation] = useState('portrait');
  const [columns, setColumns]   = useState(1);
  const [direction, setDirection] = useState('rtl');
  const [theme, setTheme]       = useState('paper');     // paper | sepia | dark
  const [activePage, setActivePage] = useState(0);
  const [findOpen, setFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [savedAt, setSavedAt]   = useState(null);
  const [showMarginGuides, setShowMarginGuides] = useState(true);
  const [ruler, setRuler]       = useState({ top: 64, right: 64, bottom: 64, left: 64 }); // pt
  const [showRibbon, setShowRibbon] = useState(true);
  const canvasRef = useRef(null);
  const pageRefs = useRef([]);

  // Ensure a doc is active
  useEffect(() => {
    if (!state.activeDocId) {
      dispatch({ type: 'new-doc', name: 'Untitled', udani: emptyDocument('Untitled') });
    }
  }, [state.activeDocId, dispatch]);

  const activeDoc = state.activeDoc;
  const doc = state.documents.find(d => d.id === state.activeDocId);
  const titleText = activeDoc?.meta?.title || doc?.name || 'Untitled';
  const firstTextFrame = activeDoc?.pages?.[0]?.frames?.find(f => f.kind === 'text');
  const bodyText = firstTextFrame?.content || SAMPLE_URDU;

  // Update word/char counts
  useEffect(() => {
    const text = bodyText.replace(/[\u064B-\u065F\u0670]/g, ''); // strip diacritics for count
    const words = text.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(text.replace(/\s/g, '').length);
  }, [bodyText]);

  const setFrameContent = (frameId, content) => {
    if (!activeDoc) return;
    const next = JSON.parse(JSON.stringify(activeDoc));
    for (const p of next.pages) {
      const f = p.frames.find(fr => fr.id === frameId);
      if (f) { f.content = content; break; }
    }
    dispatch({ type: 'set-doc', id: state.activeDocId, udani: next });
    autosaveDoc();
    setSavedAt(new Date());
  };

  const handleSave = () => {
    save();
    setSavedAt(new Date());
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'h') { e.preventDefault(); setFindOpen(true); return; }
      if (cmd && e.key.toLowerCase() === 's') { e.preventDefault(); handleSave(); return; }
      if (cmd && e.key === '+') { e.preventDefault(); setZoom(z => Math.min(200, z + 10)); return; }
      if (cmd && e.key === '-') { e.preventDefault(); setZoom(z => Math.max(40, z - 10)); return; }
      if (cmd && e.key === '0') { e.preventDefault(); setZoom(80); return; }
      // Tool shortcuts (no modifier)
      if (!cmd && !e.altKey) {
        const k = e.key.toLowerCase();
        const t = TOOLS.find(t => t.shortcut.toLowerCase() === k);
        if (t) { setTool(t.id); return; }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.activeDocId]);

  // Sync selection to inspector
  useEffect(() => {
    if (state.activeDocId) {
      // bump inspector via custom action
      dispatch({ type: 'set-route', route: 'editor' });
    }
  }, [state.activeDocId, dispatch]);

  // Page dimensions
  const size = PAGE_SIZES[pageSize];
  const pageW = orientation === 'landscape' ? size.h : size.w;
  const pageH = orientation === 'landscape' ? size.w : size.h;
  const pageWPx = pageW * 96 / 72 * zoom / 100;  // pt → px (96dpi)
  const pageHPx = pageH * 96 / 72 * zoom / 100;
  const marginLpx = ruler.left  * 96 / 72 * zoom / 100;
  const marginRpx = ruler.right * 96 / 72 * zoom / 100;
  const marginTpx = ruler.top   * 96 / 72 * zoom / 100;
  const marginBpx = ruler.bottom* 96 / 72 * zoom / 100;

  const themeVars = theme === 'paper'
    ? { pageBg: '#FFFFFF', pageFg: '#102A43', accent: '#0F4C3A' }
    : theme === 'sepia'
    ? { pageBg: '#F4ECD8', pageFg: '#5B4636', accent: '#8B5E3C' }
    : { pageBg: '#1E293B', pageFg: '#E2E8F0', accent: '#FBE7B0' };

  const currentStyle = STYLES.find(s => s.id === style) || STYLES[0];
  const currentFont  = FONTS.find(f => f.id === font) || FONTS[0];
  const pages = activeDoc?.pages?.length || 1;

  return (
    <div className="editor">
      {/* ============================================== MENU BAR */}
      <div className="editor-menu">
        <div className="row" style={{ gap: 4, paddingRight: 12, borderRight: '1px solid var(--color-border)' }}>
          {RIBBON.map(m => (
            <button key={m.id}
                    className={`editor-menu-btn${ribbon === m.id ? ' active' : ''}`}
                    onClick={() => setRibbon(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="topbar-spacer" />
        <div className="row" style={{ gap: 4 }}>
          <button className="btn btn-ghost btn-sm" title="Find & replace (Ctrl+H)" onClick={() => setFindOpen(true)}>
            <Icon.Search style={{ width: 14, height: 14 }} /> Find
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowRibbon(r => !r)}>
            <Icon.Layers style={{ width: 14, height: 14 }} /> {showRibbon ? 'Hide ribbon' : 'Show ribbon'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'open-cmd' })}>
            <Icon.Sparkle style={{ width: 14, height: 14 }} /> Quick command
          </button>
          <button className="btn btn-primary btn-sm" onClick={exportPdf} style={{ marginLeft: 8 }}>
            <Icon.Print style={{ width: 14, height: 14 }} /> Export PDF
          </button>
        </div>
      </div>

      {/* ============================================== RIBBON */}
      {showRibbon && (
        <div className="editor-ribbon">
          {ribbon === 'Home' && (
            <>
              <Group title="Clipboard">
                <Tool label="Cut"   Icon={Icon.Cut}   onClick={() => { document.execCommand('cut'); }} shortcut="Ctrl+X" />
                <Tool label="Copy"  Icon={Icon.Copy}  onClick={() => { document.execCommand('copy'); }} shortcut="Ctrl+C" />
                <Tool label="Paste" Icon={Icon.Paste} onClick={() => { document.execCommand('paste'); }} shortcut="Ctrl+V" />
              </Group>
              <Group title="Font">
                <select className="select input-sm" style={{ width: 160 }} value={font} onChange={e => setFont(e.target.value)}>
                  {FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <select className="select input-sm" style={{ width: 56 }} value={fontSize} onChange={e => setFontSize(+e.target.value)}>
                  {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Tool label="Bold"          Icon={Icon.Bold}      active={bold}      onClick={() => setBold(b => !b)}      shortcut="Ctrl+B" />
                <Tool label="Italic"        Icon={Icon.Italic}    active={italic}    onClick={() => setItalic(i => !i)}    shortcut="Ctrl+I" />
                <Tool label="Underline"     Icon={Icon.Underline} active={underline} onClick={() => setUnderline(u => !u)} shortcut="Ctrl+U" />
                <Tool label="Strikethrough" Icon={Icon.Strike}    onClick={() => document.execCommand('strikeThrough')} />
                <Tool label="Superscript"   Icon={Icon.Super}     onClick={() => document.execCommand('superscript')} />
                <Tool label="Subscript"     Icon={Icon.Sub}       onClick={() => document.execCommand('subscript')} />
                <Tool label="Font color"    Icon={Icon.TextColor} />
                <Tool label="Highlight"     Icon={Icon.Highlight} />
              </Group>
              <Group title="Paragraph">
                <Tool label="Bullet list"   Icon={Icon.List}        onClick={() => document.execCommand('insertUnorderedList')} />
                <Tool label="Numbered list" Icon={Icon.ListOrdered} onClick={() => document.execCommand('insertOrderedList')} />
                <Tool label="Indent"        Icon={Icon.Indent}      onClick={() => document.execCommand('indent')} />
                <Tool label="Outdent"       Icon={Icon.Outdent}     onClick={() => document.execCommand('outdent')} />
                <Tool label="Quote"         Icon={Icon.Quote}       onClick={() => document.execCommand('formatBlock', false, 'blockquote')} />
                <Tool label="Align left"    Icon={Icon.AlignL}      active={align === 'left'}   onClick={() => setAlign('left')} />
                <Tool label="Center"        Icon={Icon.AlignC}      active={align === 'center'} onClick={() => setAlign('center')} />
                <Tool label="Align right"   Icon={Icon.AlignR}      active={align === 'right'}  onClick={() => setAlign('right')} />
                <Tool label="Justify"       Icon={Icon.AlignJ}      active={align === 'justify'} onClick={() => setAlign('justify')} />
                <Tool label="RTL"           Icon={Icon.RTL}         active={direction === 'rtl'} onClick={() => setDirection('rtl')} />
                <Tool label="LTR"           Icon={Icon.LTR}         active={direction === 'ltr'} onClick={() => setDirection('ltr')} />
              </Group>
              <Group title="Styles">
                <select className="select input-sm" style={{ width: 140 }} value={style} onChange={e => setStyle(e.target.value)}>
                  {STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <Tool label="Heading 1" Icon={Icon.Type} onClick={() => setStyle('h1')} />
                <Tool label="Heading 2" Icon={Icon.Type} onClick={() => setStyle('h2')} />
                <Tool label="Heading 3" Icon={Icon.Type} onClick={() => setStyle('h3')} />
                <Tool label="Body"      Icon={Icon.Type} onClick={() => setStyle('body')} />
                <Tool label="Quote"     Icon={Icon.Quote} onClick={() => setStyle('quote')} />
                <Tool label="Code"      Icon={Icon.Type} onClick={() => setStyle('code')} />
              </Group>
            </>
          )}

          {ribbon === 'Insert' && (
            <>
              <Group title="Pages">
                <Tool label="New page"    Icon={Icon.Plus} />
                <Tool label="Page break"  Icon={Icon.PageBreak} onClick={() => document.execCommand('insertHTML', false, '<div style="page-break-after:always"></div>')} />
                <Tool label="Cover page"  Icon={Icon.PageSize} />
              </Group>
              <Group title="Tables">
                <Tool label="Table"     Icon={Icon.Table}  />
                <Tool label="2 columns" Icon={Icon.Columns} onClick={() => setColumns(2)} />
                <Tool label="3 columns" Icon={Icon.ColumnAdd} onClick={() => setColumns(3)} />
              </Group>
              <Group title="Media">
                <Tool label="Image"   Icon={Icon.Image} />
                <Tool label="QR code" Icon={Icon.QR} />
                <Tool label="Video"   Icon={Icon.Video} />
                <Tool label="Audio"   Icon={Icon.Audio} />
                <Tool label="Camera"  Icon={Icon.Camera} />
              </Group>
              <Group title="Shapes">
                <Tool label="Rectangle" Icon={Icon.Rect} />
                <Tool label="Circle"    Icon={Icon.Circle} />
                <Tool label="Line"      Icon={Icon.Line} />
                <Tool label="Pen"       Icon={Icon.Pen} />
                <Tool label="Sticky note" Icon={Icon.StickyNote} />
              </Group>
            </>
          )}

          {ribbon === 'Layout' && (
            <>
              <Group title="Page size">
                <select className="select input-sm" style={{ width: 140 }} value={pageSize} onChange={e => setPageSize(e.target.value)}>
                  {Object.entries(PAGE_SIZES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <Tool label="Portrait"  Icon={Icon.PageSize} active={orientation === 'portrait'} onClick={() => setOrientation('portrait')} />
                <Tool label="Landscape" Icon={Icon.PageSize} active={orientation === 'landscape'} onClick={() => setOrientation('landscape')} />
              </Group>
              <Group title="Margins">
                <Tool label="Narrow"   Icon={Icon.PageSize} onClick={() => setRuler({ top: 36, right: 36, bottom: 36, left: 36 })} />
                <Tool label="Normal"   Icon={Icon.PageSize} onClick={() => setRuler({ top: 64, right: 64, bottom: 64, left: 64 })} active={ruler.top === 64} />
                <Tool label="Wide"     Icon={Icon.PageSize} onClick={() => setRuler({ top: 96, right: 96, bottom: 96, left: 96 })} />
                <Tool label="Custom"   Icon={Icon.Ruler} onClick={() => setShowMarginGuides(g => !g)} />
              </Group>
              <Group title="Columns">
                {[1, 2, 3, 4].map(n => (
                  <Tool key={n} label={`${n} column${n > 1 ? 's' : ''}`}
                        Icon={n === 1 ? Icon.Columns : Icon.ColumnAdd}
                        active={columns === n} onClick={() => setColumns(n)} />
                ))}
              </Group>
            </>
          )}

          {ribbon === 'Type' && (
            <>
              <Group title="Typography">
                <Tool label="Bold"        Icon={Icon.Bold}      active={bold}      onClick={() => setBold(b => !b)} />
                <Tool label="Italic"      Icon={Icon.Italic}    active={italic}    onClick={() => setItalic(i => !i)} />
                <Tool label="Underline"   Icon={Icon.Underline} active={underline} onClick={() => setUnderline(u => !u)} />
                <Tool label="Font color"  Icon={Icon.TextColor} />
                <Tool label="Highlight"   Icon={Icon.Highlight} />
                <Tool label="Font size"   Icon={Icon.FontSize} />
              </Group>
              <Group title="Spacing">
                <Tool label="Line height" Icon={Icon.Spacing} />
                <Tool label="Increase"    Icon={Icon.Increase} />
                <Tool label="RTL"         Icon={Icon.RTL} active={direction === 'rtl'} onClick={() => setDirection('rtl')} />
                <Tool label="LTR"         Icon={Icon.LTR} active={direction === 'ltr'} onClick={() => setDirection('ltr')} />
              </Group>
              <Group title="Effects">
                <Tool label="Superscript" Icon={Icon.Super} onClick={() => document.execCommand('superscript')} />
                <Tool label="Subscript"   Icon={Icon.Sub}   onClick={() => document.execCommand('subscript')} />
                <Tool label="Strikethrough" Icon={Icon.Strike} onClick={() => document.execCommand('strikeThrough')} />
              </Group>
            </>
          )}

          {ribbon === 'Review' && (
            <>
              <Group title="Spell-check">
                <Tool label="Spelling"   Icon={Icon.Check}   onClick={() => dispatch({ type: 'set-route', route: 'spell' })} />
                <Tool label="Find & replace" Icon={Icon.Search} onClick={() => setFindOpen(true)} shortcut="Ctrl+H" />
                <Tool label="Word count" Icon={Icon.Type} />
              </Group>
              <Group title="Comments">
                <Tool label="New comment" Icon={Icon.Comment} />
                <Tool label="Track changes" Icon={Icon.Edit} />
              </Group>
              <Group title="Tracking">
                <Tool label="Track changes" Icon={Icon.Edit} />
                <Tool label="Show markup"  Icon={Icon.Eye} />
              </Group>
            </>
          )}

          {ribbon === 'View' && (
            <>
              <Group title="Display">
                <Tool label="Ruler"           Icon={Icon.Ruler}    active={showMarginGuides} onClick={() => setShowMarginGuides(g => !g)} />
                <Tool label="Margin guides"   Icon={Icon.PageSize} active={showMarginGuides} onClick={() => setShowMarginGuides(g => !g)} />
                <Tool label="White paper"     Icon={Icon.Doc}      active={theme === 'paper'} onClick={() => setTheme('paper')} />
                <Tool label="Sepia"           Icon={Icon.Book}     active={theme === 'sepia'} onClick={() => setTheme('sepia')} />
                <Tool label="Dark page"       Icon={Icon.Moon}     active={theme === 'dark'}  onClick={() => setTheme('dark')} />
                <Tool label="Fullscreen"      Icon={Icon.Maximize} />
              </Group>
              <Group title="Zoom">
                <Tool label="Zoom out"   Icon={Icon.Minus}     onClick={() => setZoom(z => Math.max(40, z - 10))} />
                <span className="zoom-pill">{zoom}%</span>
                <Tool label="Zoom in"    Icon={Icon.Plus}      onClick={() => setZoom(z => Math.min(200, z + 10))} />
                <Tool label="Fit width"  Icon={Icon.Columns}   onClick={() => setZoom(100)} />
                <Tool label="100%"       Icon={Icon.Ruler}     onClick={() => setZoom(100)} />
                <Tool label="Reset 80%"  Icon={Icon.Sparkle}   onClick={() => setZoom(80)} shortcut="Ctrl+0" />
              </Group>
            </>
          )}
        </div>
      )}

      {/* ============================================== RULER */}
      <div className="editor-ruler" aria-hidden="true">
        <div className="ruler-corner" />
        <div className="ruler-h">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="ruler-tick" style={{ left: `${(i + 1) * 100 / 30}%` }}>
              {i % 2 === 0 && <span>{i + 1}</span>}
            </div>
          ))}
        </div>
        <div className="ruler-v">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="ruler-tick" style={{ top: `${(i + 1) * 100 / 36}%` }}>
              {i % 3 === 0 && <span>{i + 1}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================== MAIN AREA */}
      <div className="editor-main">
        {/* Tool rail */}
        <aside className="editor-rail">
          {TOOLS.map(t => (
            <button key={t.id}
                    className={`editor-tool${tool === t.id ? ' active' : ''}`}
                    onClick={() => setTool(t.id)}
                    title={`${t.label} (${t.shortcut})`}>
              <t.Icon />
              <span className="editor-tool-shortcut">{t.shortcut}</span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="editor-tool" title="Undo (Ctrl+Z)"><Icon.Undo style={{ width: 18, height: 18 }} /></button>
          <button className="editor-tool" title="Redo (Ctrl+Y)"><Icon.Redo style={{ width: 18, height: 18 }} /></button>
        </aside>

        {/* Page list / layers / assets / outline */}
        <aside className="editor-side">
          <div className="editor-side-tabs">
            {[
              { id: 'pages',  label: 'Pages' },
              { id: 'layers', label: 'Layers' },
              { id: 'assets', label: 'Assets' },
              { id: 'outline',label: 'Outline' },
            ].map(t => (
              <button key={t.id} className={`editor-side-tab${sideTab === t.id ? ' active' : ''}`} onClick={() => setSideTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="editor-side-body">
            {sideTab === 'pages' && (
              <div>
                <div style={{ padding: '0 4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="text-xs text-muted">{pages} {pages === 1 ? 'page' : 'pages'}</span>
                  <button className="btn btn-ghost btn-sm" title="Add page" style={{ padding: '2px 6px' }}>
                    <Icon.Plus style={{ width: 12, height: 12 }} />
                  </button>
                </div>
                <div className="grid-2" style={{ gap: 8 }}>
                  {Array.from({ length: pages }).map((_, i) => (
                    <div key={i} ref={el => pageRefs.current[i] = el}
                         className={`card card-hoverable${i === activePage ? ' selected' : ''}`}
                         onClick={() => setActivePage(i)}
                         style={{ padding: 6, borderColor: i === activePage ? 'var(--color-primary)' : 'var(--color-border)', cursor: 'pointer' }}>
                      <div style={{ aspectRatio: pageW / pageH, background: themeVars.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', borderRadius: 2 }}>
                        <span className="urdu" style={{ fontSize: 16, color: themeVars.pageFg }}>{URDU_PAGE_LABELS[i % URDU_PAGE_LABELS.length]}</span>
                      </div>
                      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>صفحہ {i + 1}</div>
                    </div>
                  ))}
                  <button className="card card-flat" style={{ padding: 8, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--fs-12)', cursor: 'pointer', aspectRatio: pageW / pageH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <Icon.Plus style={{ width: 16, height: 16 }} />
                      <div style={{ marginTop: 4 }}>Add page</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {sideTab === 'layers' && (
              <div>
                {['Background', 'Master A', 'Image 4', 'Frame 2 (Text)', 'Frame 1 (Title)'].map((l, i) => (
                  <div key={l} className={`editor-layer${i === 4 ? ' active' : ''}`}>
                    <Icon.Eye style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                    <span style={{ flex: 1 }}>{l}</span>
                    <span className="chip chip-neutral" style={{ fontSize: 10 }}>{l.includes('Text') ? 'A' : l.includes('Title') ? 'T' : l.includes('Image') ? 'IMG' : 'M'}</span>
                  </div>
                ))}
              </div>
            )}
            {sideTab === 'assets' && (
              <div>
                <div className="input-with-icon" style={{ marginBottom: 8, position: 'relative' }}>
                  <Icon.Search style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12, color: 'var(--color-text-muted)' }} />
                  <input className="input input-sm" placeholder="Search assets" style={{ paddingLeft: 28, width: '100%' }} />
                </div>
                <div className="grid-2" style={{ gap: 8 }}>
                  {['Mountain.jpg', 'Garden.jpg', 'Pattern.png', 'Logo.png', 'Lahore.jpg', 'Iqbal.png'].map(a => (
                    <div key={a} className="card card-flat" style={{ padding: 4, cursor: 'pointer' }}>
                      <div style={{ aspectRatio: 1.4, background: 'linear-gradient(135deg,#D1F2EB,#FBF3E1)', borderRadius: 4 }} />
                      <div className="text-xs" style={{ marginTop: 4, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sideTab === 'outline' && (
              <div>
                {['Title', 'Heading 1', 'Heading 2', 'Heading 3', 'Body', 'Quote', 'Body'].map((l, i) => (
                  <div key={i} className="editor-outline-item" style={{ paddingLeft: 4 + (l === 'Body' ? 12 : l === 'Quote' ? 8 : 0) }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>اردو زبان کی خوبصورتی…</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main className="editor-canvas" ref={canvasRef}>
          {/* Find & replace bar */}
          {findOpen && (
            <div className="editor-findbar">
              <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                <Icon.Search style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                <input className="input input-sm" placeholder="Find…" value={findQuery} onChange={e => setFindQuery(e.target.value)} style={{ width: 200 }} autoFocus />
                <input className="input input-sm" placeholder="Replace with…" style={{ width: 200 }} />
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  if (!firstTextFrame || !findQuery) return;
                  const re = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                  const next = bodyText.replace(re, 'replacement');
                  setFrameContent(firstTextFrame.id, next);
                }}>Replace</button>
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  if (!firstTextFrame || !findQuery) return;
                  const re = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                  const next = bodyText.replace(re, '');
                  setFrameContent(firstTextFrame.id, next);
                }}>Replace all</button>
                <span className="text-xs text-muted">Esc to close</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setFindOpen(false)} style={{ marginLeft: 'auto' }}>
                  <Icon.Close style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
          )}

          <div className="editor-pages-wrap">
            {/* Single page (activePage) — we render just one for now */}
            <div className="editor-page-sheet"
                 style={{
                   width: pageWPx, minHeight: pageHPx,
                   background: themeVars.pageBg,
                   color: themeVars.pageFg,
                   paddingTop: marginTpx, paddingBottom: marginBpx,
                   paddingLeft: marginLpx, paddingRight: marginRpx,
                   fontFamily: currentFont.stack,
                 }}>
              {showMarginGuides && (
                <>
                  <div className="margin-guide mg-top"    style={{ top: marginTpx }} />
                  <div className="margin-guide mg-bottom" style={{ bottom: marginBpx }} />
                  <div className="margin-guide mg-left"   style={{ left: marginLpx }} />
                  <div className="margin-guide mg-right"  style={{ right: marginRpx }} />
                </>
              )}

              {/* Title */}
              <h1
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => firstTextFrame && setFrameContent(firstTextFrame.id, e.currentTarget.textContent)}
                onClick={() => setStyle('h1')}
                style={{
                  outline: 'none',
                  color: themeVars.accent,
                  fontSize: 32 * zoom / 100,
                  fontWeight: 700,
                  textAlign: align,
                  direction: direction,
                  fontFamily: currentFont.stack,
                  margin: 0,
                  marginBottom: 8,
                  border: '1px solid transparent',
                  padding: '2px 4px',
                  borderRadius: 2,
                  lineHeight: 1.2,
                }}>
                {titleText}
              </h1>
              <div className="urdu" style={{ width: 60, height: 2, background: themeVars.accent, margin: '0 auto 16px' }} />

              {/* Lead paragraph */}
              <div
                className="urdu"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => firstTextFrame && setFrameContent(firstTextFrame.id, e.currentTarget.textContent)}
                onClick={() => setStyle('body')}
                style={{
                  fontSize: fontSize * zoom / 100,
                  lineHeight: 1.8,
                  color: themeVars.pageFg,
                  outline: 'none',
                  textAlign: align,
                  direction: direction,
                  fontFamily: currentFont.stack,
                  fontWeight: bold ? 700 : 400,
                  fontStyle: italic ? 'italic' : 'normal',
                  textDecoration: underline ? 'underline' : 'none',
                  border: '1px solid transparent',
                  padding: '2px 4px',
                  borderRadius: 2,
                  columnCount: columns,
                  columnGap: 24,
                  minHeight: 200,
                }}>
                {bodyText.split('\n\n')[0]}
              </div>

              {/* Continue paragraph */}
              {bodyText.split('\n\n')[1] && (
                <div
                  className="urdu"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => firstTextFrame && setFrameContent(firstTextFrame.id, e.currentTarget.textContent)}
                  onClick={() => setStyle('body')}
                  style={{
                    fontSize: fontSize * zoom / 100,
                    lineHeight: 1.8,
                    color: themeVars.pageFg,
                    outline: 'none',
                    textAlign: align,
                    direction: direction,
                    fontFamily: currentFont.stack,
                    marginTop: 16,
                  }}>
                  {bodyText.split('\n\n')[1]}
                </div>
              )}

              {/* Page footer with page number */}
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: 11 * zoom / 100 }}>
                — {activePage + 1} —
              </div>
            </div>

            {/* Page nav */}
            <div className="editor-page-nav">
              <button className="btn btn-secondary btn-sm" disabled={activePage === 0} onClick={() => setActivePage(p => Math.max(0, p - 1))}>
                <Icon.ArrowLeft style={{ width: 12, height: 12 }} /> Prev
              </button>
              <span className="text-sm text-muted">Page {activePage + 1} of {pages}</span>
              <button className="btn btn-secondary btn-sm" disabled={activePage >= pages - 1} onClick={() => setActivePage(p => Math.min(pages - 1, p + 1))}>
                Next <Icon.Arrow style={{ width: 12, height: 12 }} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================== STATUS BAR */}
      <div className="editor-statusbar" role="status">
        <button className="status-item" onClick={handleSave} title="Save (Ctrl+S)">
          {savedAt ? <Icon.Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Icon.Download style={{ width: 12, height: 12 }} />}
          {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Save now'}
        </button>
        <span className="status-item">{wordCount.toLocaleString()} words</span>
        <span className="status-item">{charCount.toLocaleString()} characters</span>
        <span className="status-item">Page {activePage + 1} of {pages}</span>
        <span className="status-item">Line {currentLine} · Col {currentCol}</span>
        <span className="status-item">{direction === 'rtl' ? 'RTL' : 'LTR'}</span>
        <span className="status-item">{theme === 'paper' ? '☀ Paper' : theme === 'sepia' ? '📜 Sepia' : '🌙 Dark'}</span>
        <span className="spacer" />
        <div className="row" style={{ gap: 4 }}>
          <button className="status-item" onClick={() => setZoom(z => Math.max(40, z - 10))} aria-label="Zoom out">−</button>
          <span className="status-item" style={{ minWidth: 44, textAlign: 'center' }}>{zoom}%</span>
          <button className="status-item" onClick={() => setZoom(z => Math.min(200, z + 10))} aria-label="Zoom in">+</button>
        </div>
        <span className="status-item">{PAGE_SIZES[pageSize].label}</span>
        <span className="status-item">{columns} col{columns > 1 ? 's' : ''}</span>
        <span className="status-item">UrduOfDani v1.2.5</span>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function Group({ title, children }) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-children">{children}</div>
      <div className="ribbon-group-title">{title}</div>
    </div>
  );
}

function Tool({ label, Icon, onClick, active, shortcut, disabled }) {
  return (
    <button className={`ribbon-tool${active ? ' active' : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={shortcut ? `${label} (${shortcut})` : label}>
      <Icon />
      <span>{label}</span>
    </button>
  );
}
