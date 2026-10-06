// templates.js — the UrduOfDani template library.
//
// Each template is a full document definition (multi-page, multi-frame)
// that the user can open in the editor and customize. Templates cover:
//   - Books, magazines, reports (long-form)
//   - Cards, invitations (short-form)
//   - Newsletters, posters (medium-form)
//
// Fields per template:
//   id           unique slug
//   title        English title
//   titleUrdu    Urdu title (used in the page header)
//   sub          short description (gallery card)
//   cat          'book' | 'magazine' | 'card' | 'newsletter' | 'poster' | 'report' | 'form' | 'cv' | 'brochure'
//   kind         document kind (passed to newDoc)
//   tag          page-size chip
//   size         'A4' | 'A5' | 'A3' | 'Letter' | 'B5' | 'DL' | 'A6'
//   orientation  'portrait' | 'landscape'
//   direction    'rtl' | 'ltr'
//   dir          (legacy) alias for direction (used by TemplatesPage chip)
//   palette      { bg, fg, accent, secondary }
//   featured     boolean — shown in the Featured row
//   pages        array of page definitions, each with frames
//   description  long description (modal)
//
// Frame format (matches emptyDocument):
//   { id, kind: 'text', x, y, w, h, content, font, size, weight, align, dir, color, italic, etc. }

/* ============================================================ *
 *  Sample text snippets (used in templates)
 * ============================================================ */
const SAMPLE_URDU_PROSE = `یہ ایک نمونہ متن ہے جو آپ کی دستاویز میں ترمیم اور تبدیلی کے لیے حاضر ہے۔ آپ اسے حذف کر کے اپنا مواد شامل کر سکتے ہیں۔

اردو زبان کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔

زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔`;

const SAMPLE_URDU_POETRY = `کوئی تو ہے جو میرے دل کو سنتا ہے
کوئی تو ہے جو میری آنکھوں سے پڑھتا ہے

میں خاموشی سے بیٹھا ہوں دیکھو
میری خاموشی بھی کچھ کہتی ہے

— اقبال`;

const SAMPLE_URDU_ARTICLE = `اس دور میں جب کہ ٹیکنالوجی نے ہر شعبے کو اپنی لپیٹ میں لے لیا ہے، اردو زبان کا تحفظ اور فروغ ایک اہم ترین موضوع بن گیا ہے۔ ڈیجیٹل میڈیا کے ذریعے اردو کو نئی نسل تک پہنچانا آج کے دور کی ضرورت ہے۔

مختلف سافٹ ویئرز اور ایپلیکیشنز نے اردو ٹائپنگ اور اشاعت کو بہت آسان بنا دیا ہے۔ اردوآف دانی جیسا سافٹ ویئر اردو کمپیوٹنگ کے لیے ایک اہم سنگ میل ہے جو آف لائن کام کرتا ہے اور مفت میں دستیاب ہے۔`;

const SAMPLE_LTRS_PROSE = `This is sample English text. Replace it with your own content. The font, size, colour and alignment are all customisable from the ribbon above.

The design system is inspired by classic print typography: a single body face set in a comfortable measure, with generous leading and clear hierarchy through size, weight and colour.`;

const SAMPLE_LTRS_REPORT = `Executive Summary
The findings of this report indicate a significant shift in the market. The detailed analysis follows on the next page.

Introduction
This report examines the broader context and presents a thorough investigation into the key questions raised by stakeholders.

Methodology
Our approach combined qualitative interviews with quantitative analysis of the available data sets.

Findings
The primary finding is consistent across all regions. The detailed breakdown is shown in the appendix.`;

const SAMPLE_LTRS_INVITE = `You are cordially invited to the wedding reception of

Aisha & Dani

Saturday, the fifteenth of November
Two thousand and twenty-five
At seven o'clock in the evening

Pearl Continental Hotel, Lahore

With love from both families`;

const SAMPLE_LTRS_CV = `Muhammad Danish

Senior Software Engineer
DaniLabs · Lahore, Pakistan

Experience
DaniLabs (2020 — present)
· Lead the design of UrduOfDani, a desktop publishing suite.
· Mentor 5 junior engineers and run the weekly architecture review.`;

const SAMPLE_LTRS_BROCHURE = `Welcome to the DaniLabs Family

We build open-source software that respects your language, your privacy, and your time.

What we make
· UrduOfDani — a free desktop publishing app for Urdu and Arabic.
· Other open-source tools in development.

Get involved
hello.danilabs@gmail.com`;

/* ============================================================ *
 *  Template factory helpers
 * ============================================================ */
const tFrame = (id, x, y, w, h, content, opts = {}) => ({
  id, kind: 'text', x, y, w, h, content,
  font: opts.font || 'Noto Nastaliq Urdu',
  size: opts.size || 14,
  weight: opts.weight || 'normal',
  italic: opts.italic || false,
  align: opts.align || 'right',
  dir: opts.dir || 'rtl',
  color: opts.color || '#102A43',
});

const pageSize = (size, orientation) => {
  // mm-to-mm base; the editor uses pt internally but for templates we
  // store layout as 0..200 relative units, the editor scales to fit.
  const sizes = {
    A4:    { p: { w: 200, h: 283 } },
    A5:    { p: { w: 148, h: 210 } },
    A3:    { p: { w: 297, h: 420 } },
    Letter:{ p: { w: 215, h: 279 } },
    Legal: { p: { w: 215, h: 356 } },
    B5:    { p: { w: 176, h: 250 } },
    DL:    { p: { w: 99,  h: 210 } },  // business card / invitation
    A6:    { p: { w: 105, h: 148 } },
  };
  const s = sizes[size] || sizes.A4;
  return orientation === 'landscape' ? { w: s.p.h, h: s.p.w } : s.p;
};

/* ============================================================ *
 *  TEMPLATES
 * ============================================================ */
export const TEMPLATES = [
  /* ---------------------- BOOK / 1. Urdu book ---------------------- */
  {
    id: 't-book-urdu',
    title: 'Urdu Book',
    titleUrdu: 'اردو کتاب',
    sub: 'A clean, elegant book layout for prose and essays',
    description: 'A5 portrait book with 4 pages: cover, half-title, opening chapter, and back cover. Uses Noto Nastaliq Urdu and a generous margin for an old-world reading feel.',
    cat: 'book', kind: 'book', tag: 'A5',
    size: 'A5', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#F7F5EF', fg: '#102A43', accent: '#0F4C3A', secondary: '#C69B47' },
    featured: true,
    pages: [
      {
        id: 'p1', kind: 'cover',
        bg: '#F7F5EF',
        frames: [
          { ...tFrame('f-cover-bar', 0, 0, 200, 12, '', { font: 'Inter', size: 4, color: '#C69B47' }), weight: 'bold' },
          { ...tFrame('f-cover-title', 12, 60, 176, 40, 'اردو کتاب', { size: 36, weight: 'bold', color: '#0F4C3A', align: 'center' }) },
          { ...tFrame('f-cover-divider', 80, 108, 40, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-cover-author', 12, 116, 176, 12, 'مصنف کا نام', { size: 14, color: '#102A43', align: 'center' }) },
          { ...tFrame('f-cover-tagline', 12, 200, 176, 8, 'چند صفحات کا مجموعہ', { size: 10, italic: true, color: '#475569', align: 'center' }) },
          { ...tFrame('f-cover-pub', 12, 260, 176, 8, 'دنی لیبز · 2025', { size: 10, color: '#475569', align: 'center' }) },
        ],
      },
      {
        id: 'p2', kind: 'half-title',
        frames: [
          { ...tFrame('f-ht', 0, 110, 200, 30, 'اردو کتاب', { size: 24, color: '#0F4C3A', align: 'center' }) },
        ],
      },
      {
        id: 'p3', kind: 'chapter',
        frames: [
          { ...tFrame('f-ch1', 16, 16, 168, 8, 'باب ۱', { size: 10, color: '#C69B47', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-ch-title', 16, 30, 168, 18, 'شروع', { size: 22, weight: 'bold', color: '#0F4C3A', align: 'center' }) },
          { ...tFrame('f-ch-rule', 80, 52, 40, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-ch-body', 16, 64, 168, 200, SAMPLE_URDU_PROSE, { size: 12, color: '#102A43' }) },
        ],
      },
      {
        id: 'p4', kind: 'back-cover',
        bg: '#0F4C3A',
        frames: [
          { ...tFrame('f-bc-title', 16, 90, 168, 24, 'دنی لیبز', { size: 24, color: '#FBE7B0', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-bc-sub', 16, 124, 168, 12, 'آزاد سافٹ ویئر', { size: 12, color: '#F7F5EF', align: 'center' }) },
          { ...tFrame('f-bc-url', 16, 200, 168, 8, 'danilabs.com', { size: 10, color: '#FBE7B0', align: 'center' }) },
        ],
      },
    ],
  },

  /* ---------------------- MAGAZINE / 2. Editorial magazine ---------------------- */
  {
    id: 't-mag-edit',
    title: 'Editorial Magazine',
    titleUrdu: 'اداری مجلہ',
    sub: 'Multi-column editorial layout for articles and features',
    description: 'A4 portrait magazine with a striking navy cover, 4-page content section, and a back-cover credits page. Uses a two-column body and drop caps.',
    cat: 'magazine', kind: 'magazine', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#FFFFFF', fg: '#102A43', accent: '#0A1F33', secondary: '#C69B47' },
    featured: true,
    pages: [
      {
        id: 'p1', kind: 'cover', bg: '#0A1F33',
        frames: [
          { ...tFrame('f-mast', 0, 8, 200, 8, 'اداری مجلہ', { font: 'Noto Nastaliq Urdu', size: 14, weight: 'bold', color: '#FBE7B0', align: 'center' }) },
          { ...tFrame('f-issue', 0, 22, 200, 6, 'شمارہ ۱۲ · اکتوبر ۲۰۲۵', { font: 'Inter', size: 8, color: '#C69B47', align: 'center' }) },
          { ...tFrame('f-rule', 70, 32, 60, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-cover-title', 12, 80, 176, 80, 'اردو کی\nخوبصورتی', { size: 56, weight: 'bold', color: '#FFFFFF', align: 'center' }) },
          { ...tFrame('f-cover-sub', 16, 180, 168, 12, 'ادب، ثقافت اور فن', { size: 12, color: '#C69B47', align: 'center', italic: true }) },
          { ...tFrame('f-cover-tag', 16, 240, 168, 8, 'خصوصی شمارہ', { font: 'Inter', size: 9, color: '#FFFFFF', align: 'center' }) },
        ],
      },
      {
        id: 'p2', kind: 'contents',
        frames: [
          { ...tFrame('f-c-title', 16, 16, 168, 14, 'فہرست', { size: 22, weight: 'bold', color: '#0A1F33' }) },
          { ...tFrame('f-c-rule', 16, 38, 30, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-c-item1', 16, 50, 168, 6, 'بانی کا کالم ............................ ۳', { size: 11, color: '#102A43' }) },
          { ...tFrame('f-c-item2', 16, 62, 168, 6, 'اردو شاعری کا سفر ................. ۶', { size: 11, color: '#102A43' }) },
          { ...tFrame('f-c-item3', 16, 74, 168, 6, 'ڈیجیٹل اردو ............................ ۱۲', { size: 11, color: '#102A43' }) },
          { ...tFrame('f-c-item4', 16, 86, 168, 6, 'خواتین کہانیاں ...................... ۱۸', { size: 11, color: '#102A43' }) },
          { ...tFrame('f-c-item5', 16, 98, 168, 6, 'سفرنامہ ہندوستان ............... ۲۲', { size: 11, color: '#102A43' }) },
        ],
      },
      {
        id: 'p3', kind: 'article',
        frames: [
          { ...tFrame('f-a-cat', 16, 14, 168, 6, 'بانی کا کالم', { font: 'Inter', size: 9, color: '#C69B47', weight: 'bold' }) },
          { ...tFrame('f-a-title', 16, 26, 168, 18, 'اردو کے مستقبل کا سوچنا', { size: 22, weight: 'bold', color: '#0A1F33' }) },
          { ...tFrame('f-a-byline', 16, 48, 168, 6, 'تحریر: ڈینی', { font: 'Noto Nastaliq Urdu', size: 9, color: '#475569', italic: true }) },
          { ...tFrame('f-a-rule', 16, 56, 30, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-a-body', 16, 66, 80, 200, SAMPLE_URDU_ARTICLE, { size: 10, color: '#102A43' }) },
          { ...tFrame('f-a-body2', 102, 66, 80, 200, SAMPLE_URDU_ARTICLE, { size: 10, color: '#102A43' }) },
        ],
      },
      {
        id: 'p4', kind: 'closing',
        frames: [
          { ...tFrame('f-z-1', 0, 100, 200, 30, '— اختتام —', { size: 18, color: '#C69B47', align: 'center', italic: true }) },
          { ...tFrame('f-z-2', 16, 200, 168, 8, 'اگلے شمارے میں', { font: 'Inter', size: 10, color: '#475569', align: 'center' }) },
        ],
      },
    ],
  },

  /* ---------------------- CARDS / 3. Wedding invitation ---------------------- */
  {
    id: 't-card-wed',
    title: 'Wedding Invitation',
    titleUrdu: 'شادی کی دعوت',
    sub: 'A graceful invitation design with bilingual greeting',
    description: 'A5 portrait invitation with a gold-leaf border, central Urdu and English title, and event details. Embossed-style design.',
    cat: 'card', kind: 'card', tag: 'A5',
    size: 'A5', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#FBF3E1', fg: '#102A43', accent: '#C69B47', secondary: '#8B5E3C' },
    featured: true,
    pages: [
      {
        id: 'p1', kind: 'invite', bg: '#FBF3E1',
        frames: [
          { ...tFrame('f-w-border', 8, 8, 184, 245, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-w-ornament', 80, 28, 40, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-w-en', 16, 50, 168, 10, 'You are cordially invited', { font: 'Inter', size: 11, color: '#8B5E3C', align: 'center', italic: true }) },
          { ...tFrame('f-w-urdu-title', 16, 80, 168, 28, 'شادی کی دعوت', { size: 32, weight: 'bold', color: '#0F4C3A', align: 'center' }) },
          { ...tFrame('f-w-rule', 90, 120, 20, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-w-names-urdu', 16, 132, 168, 16, 'عائشہ & ڈینی', { size: 22, color: '#102A43', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-w-names-en', 16, 152, 168, 8, 'Aisha & Dani', { font: 'Inter', size: 12, color: '#8B5E3C', align: 'center', italic: true }) },
          { ...tFrame('f-w-date-urdu', 16, 180, 168, 10, '۱۵ نومبر ۲۰۲۵', { size: 14, color: '#102A43', align: 'center' }) },
          { ...tFrame('f-w-venue', 16, 200, 168, 10, 'پرل کانٹنینٹل، لاہور', { size: 12, color: '#475569', align: 'center' }) },
          { ...tFrame('f-w-ornament2', 80, 240, 40, 1, '', { size: 1, color: '#C69B47' }) },
        ],
      },
    ],
  },

  /* ---------------------- NEWSLETTER / 4. School newsletter ---------------------- */
  {
    id: 't-news-school',
    title: 'School Newsletter',
    titleUrdu: 'سکول نیوز لیٹر',
    sub: '4-page bilingual newsletter for schools',
    description: 'A4 portrait newsletter with a 3-column body, photo placeholders, an event calendar, and a back-page student spotlight.',
    cat: 'newsletter', kind: 'newsletter', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#102A43', accent: '#008F76', secondary: '#FBF3E1' },
    pages: [
      {
        id: 'p1', kind: 'newsletter-cover',
        frames: [
          { ...tFrame('f-n-mast', 0, 8, 200, 10, 'SCHOOL NEWSLETTER', { font: 'Inter', size: 10, color: '#475569', weight: 'bold', align: 'center' }) },
          { ...tFrame('f-n-issue', 0, 22, 200, 6, 'Vol. 12 · Issue 3', { font: 'Inter', size: 8, color: '#008F76', align: 'center' }) },
          { ...tFrame('f-n-rule', 70, 34, 60, 1, '', { size: 1, color: '#008F76' }) },
          { ...tFrame('f-n-h1', 16, 60, 168, 24, 'Term Highlights', { font: 'Inter', size: 28, color: '#0F4C3A', weight: 'bold' }) },
          { ...tFrame('f-n-lead', 16, 92, 168, 30, 'A round-up of the most important events, achievements and stories from the past term.', { font: 'Inter', size: 11, color: '#475569', italic: true }) },
          { ...tFrame('f-n-image', 16, 130, 168, 80, '', { size: 1, color: '#E2E8F0' }) },
          { ...tFrame('f-n-photocap', 16, 215, 168, 6, '[ Photograph: Annual sports day ]', { font: 'Inter', size: 8, color: '#475569', italic: true, align: 'center' }) },
          { ...tFrame('f-n-footer', 0, 270, 200, 6, 'دنی لیبز · 2025', { font: 'Inter', size: 8, color: '#475569', align: 'center' }) },
        ],
      },
      {
        id: 'p2', kind: 'article',
        frames: [
          { ...tFrame('f-n2-h', 16, 14, 168, 10, 'FROM THE PRINCIPAL', { font: 'Inter', size: 9, color: '#008F76', weight: 'bold' }) },
          { ...tFrame('f-n2-t', 16, 28, 168, 16, 'A year of growth', { font: 'Inter', size: 20, color: '#0F4C3A', weight: 'bold' }) },
          { ...tFrame('f-n2-b', 16, 52, 168, 220, SAMPLE_LTRS_PROSE, { font: 'Inter', size: 10, color: '#102A43', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p3', kind: 'event-calendar',
        frames: [
          { ...tFrame('f-n3-h', 16, 14, 168, 10, 'UPCOMING EVENTS', { font: 'Inter', size: 9, color: '#008F76', weight: 'bold' }) },
          { ...tFrame('f-n3-list', 16, 32, 168, 240,
            'Nov 5   Science fair\nNov 12  Inter-house debate\nNov 18  Annual day rehearsal\nNov 25  Parent-teacher meeting\nDec 1   Cultural programme\nDec 12  Winter break begins',
            { font: 'Inter', size: 11, color: '#102A43', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p4', kind: 'closing',
        frames: [
          { ...tFrame('f-n4-h', 16, 14, 168, 10, 'STUDENT SPOTLIGHT', { font: 'Inter', size: 9, color: '#008F76', weight: 'bold' }) },
          { ...tFrame('f-n4-t', 16, 28, 168, 16, 'Meet the winners', { font: 'Inter', size: 20, color: '#0F4C3A', weight: 'bold' }) },
          { ...tFrame('f-n4-image', 16, 60, 60, 60, '', { size: 1, color: '#E2E8F0' }) },
          { ...tFrame('f-n4-b', 80, 60, 100, 200,
            'This term, we celebrate the achievements of our students in academics, sports, and the arts. Their stories are inspiring — read on to learn more.',
            { font: 'Inter', size: 10, color: '#102A43', dir: 'ltr', align: 'left' }) },
        ],
      },
    ],
  },

  /* ---------------------- POSTER / 5. Event poster ---------------------- */
  {
    id: 't-poster-event',
    title: 'Event Poster',
    titleUrdu: 'تقریب کا پوسٹر',
    sub: 'A3 portrait poster with hero image area and event info',
    description: 'A3 poster with a hero image placeholder, big event title, and a date/venue block at the bottom. Suitable for concerts, lectures, and exhibitions.',
    cat: 'poster', kind: 'poster', tag: 'A3',
    size: 'A3', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#0A1F33', fg: '#F7F5EF', accent: '#FBE7B0', secondary: '#C69B47' },
    pages: [
      {
        id: 'p1', kind: 'poster', bg: '#0A1F33',
        frames: [
          { ...tFrame('f-pt-image', 30, 30, 240, 200, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-pt-image-cap', 30, 232, 240, 6, '[ HERO IMAGE ]', { font: 'Inter', size: 8, color: '#475569', align: 'center' }) },
          { ...tFrame('f-pt-eyebrow', 30, 250, 240, 8, 'خصوصی تقریب', { size: 10, color: '#FBE7B0', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-pt-title', 30, 270, 240, 60, 'شاعری کی\nمحفل', { size: 64, color: '#FFFFFF', weight: 'bold', align: 'center' }) },
          { ...tFrame('f-pt-rule', 120, 350, 60, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-pt-byline', 30, 360, 240, 8, 'ممتاز شعرا کی شرکت', { size: 12, color: '#FBE7B0', align: 'center' }) },
          { ...tFrame('f-pt-date', 30, 540, 240, 12, '۲۰ نومبر ۲۰۲۵', { size: 16, color: '#FBE7B0', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-pt-venue', 30, 560, 240, 8, 'علامہ اقبال ہال، لاہور', { size: 11, color: '#F7F5EF', align: 'center' }) },
          { ...tFrame('f-pt-footer', 30, 580, 240, 6, 'داخلہ مفت', { size: 9, color: '#C69B47', align: 'center' }) },
        ],
      },
    ],
  },

  /* ---------------------- REPORT / 6. Research report ---------------------- */
  {
    id: 't-rpt-res',
    title: 'Research Report',
    titleUrdu: 'تحقیقی رپورٹ',
    sub: 'Title page, abstract, body and bibliography',
    description: 'A4 portrait report with 4 pages: cover, abstract, body, and a bibliography in a smaller serif font. The body uses 1.5x line spacing.',
    cat: 'report', kind: 'report', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0F4C3A', secondary: '#94A3B8' },
    pages: [
      {
        id: 'p1', kind: 'cover',
        frames: [
          { ...tFrame('f-rc-mark', 0, 60, 200, 6, 'DANILABS · RESEARCH', { font: 'Inter', size: 9, color: '#0F4C3A', weight: 'bold', align: 'center' }) },
          { ...tFrame('f-rc-rule', 70, 72, 60, 1, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-rc-title', 20, 100, 160, 60, 'The State of Open-Source Publishing', { font: 'Inter', size: 28, color: '#0F172A', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-sub', 20, 168, 160, 12, 'A 2025 review of community-driven desktop publishing software.', { font: 'Inter', size: 12, color: '#475569', italic: true, dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-author', 20, 240, 160, 8, 'Muhammad Danish', { font: 'Inter', size: 11, color: '#0F4C3A', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-date', 20, 250, 160, 6, 'October 2025', { font: 'Inter', size: 9, color: '#94A3B8', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p2', kind: 'abstract',
        frames: [
          { ...tFrame('f-rc-abs-h', 16, 16, 168, 12, 'Abstract', { font: 'Inter', size: 18, color: '#0F4C3A', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-abs', 16, 36, 168, 230, SAMPLE_LTRS_REPORT, { font: 'Inter', size: 10, color: '#0F172A', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p3', kind: 'body',
        frames: [
          { ...tFrame('f-rc-body-h', 16, 16, 168, 12, '1. Introduction', { font: 'Inter', size: 16, color: '#0F4C3A', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-body', 16, 36, 168, 230, SAMPLE_LTRS_PROSE, { font: 'Inter', size: 10, color: '#0F172A', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p4', kind: 'bibliography',
        frames: [
          { ...tFrame('f-rc-bib-h', 16, 16, 168, 12, 'Bibliography', { font: 'Inter', size: 16, color: '#0F4C3A', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-rc-bib', 16, 36, 168, 230,
            '[1]  D. Muhammad, "Open-Source Desktop Publishing", Journal of Open Tools, 2024.\n\n[2]  R. Williams, "Typography in the Digital Age", MIT Press, 2023.\n\n[3]  P. J. Smith, "Multi-script Layout", Typographica, 2022.',
            { font: 'Inter', size: 9, color: '#475569', dir: 'ltr', align: 'left' }) },
        ],
      },
    ],
  },

  /* ---------------------- POETRY / 7. Poetry collection ---------------------- */
  {
    id: 't-poetry',
    title: 'Poetry Collection',
    titleUrdu: 'شعری مجموعہ',
    sub: 'A beautiful layout for Urdu poetry collections',
    description: 'A5 portrait book with a 2-page opening (cover + blank), 3 poetry pages each with a single ghazal, and a back cover. Each poetry page has a large title, a thin rule, the poem, and a small attribution.',
    cat: 'book', kind: 'poetry', tag: 'A5',
    size: 'A5', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#FBF3E1', fg: '#102A43', accent: '#C53030', secondary: '#8B5E3C' },
    pages: [
      {
        id: 'p1', kind: 'cover', bg: '#FBF3E1',
        frames: [
          { ...tFrame('f-pc-title', 0, 70, 200, 32, 'شعری مجموعہ', { size: 36, color: '#C53030', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-pc-rule', 80, 116, 40, 1, '', { size: 1, color: '#8B5E3C' }) },
          { ...tFrame('f-pc-sub', 0, 130, 200, 10, 'غزلیات، نظمیں اور قطعات', { size: 14, color: '#8B5E3C', align: 'center', italic: true }) },
          { ...tFrame('f-pc-author', 0, 200, 200, 8, 'ڈینی · 2025', { size: 11, color: '#102A43', align: 'center' }) },
        ],
      },
      {
        id: 'p2', kind: 'poem',
        frames: [
          { ...tFrame('f-pm-title', 16, 24, 168, 16, 'ایک غزل', { size: 22, color: '#C53030', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-pm-rule', 80, 48, 40, 1, '', { size: 1, color: '#8B5E3C' }) },
          { ...tFrame('f-pm-body', 16, 64, 168, 160, SAMPLE_URDU_POETRY, { size: 14, color: '#102A43', align: 'right' }) },
          { ...tFrame('f-pm-byline', 16, 240, 168, 8, '— ڈینی', { size: 10, color: '#8B5E3C', italic: true, align: 'left' }) },
        ],
      },
      {
        id: 'p3', kind: 'poem',
        frames: [
          { ...tFrame('f-pm2-title', 16, 24, 168, 16, 'ایک نظم', { size: 22, color: '#C53030', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-pm2-rule', 80, 48, 40, 1, '', { size: 1, color: '#8B5E3C' }) },
          { ...tFrame('f-pm2-body', 16, 64, 168, 200, SAMPLE_URDU_PROSE, { size: 12, color: '#102A43', align: 'right' }) },
        ],
      },
      {
        id: 'p4', kind: 'back-cover', bg: '#FBF3E1',
        frames: [
          { ...tFrame('f-pc-back', 16, 110, 168, 16, 'شعر کی طاقت', { size: 18, color: '#8B5E3C', align: 'center', italic: true }) },
          { ...tFrame('f-pc-back-sub', 16, 140, 168, 8, 'اردو زبان کا دل', { size: 11, color: '#102A43', align: 'center' }) },
        ],
      },
    ],
  },

  /* ---------------------- CV / 8. Professional CV ---------------------- */
  {
    id: 't-cv-pro',
    title: 'Professional CV',
    titleUrdu: 'پیشہ ورانہ سی وی',
    sub: 'A4 one-page CV with side panel for skills',
    description: 'A4 portrait CV with a left sidebar for contact info and skills, and a main area for experience and education. Bilingual support.',
    cat: 'report', kind: 'cv', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0F4C3A', secondary: '#E2E8F0' },
    pages: [
      {
        id: 'p1', kind: 'cv',
        frames: [
          { ...tFrame('f-cv-side-bg', 0, 0, 60, 283, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-cv-name', 8, 16, 48, 8, 'M. Danish', { font: 'Inter', size: 14, color: '#FFFFFF', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-cv-title', 8, 28, 48, 6, 'Senior Engineer', { font: 'Inter', size: 9, color: '#FBE7B0', dir: 'ltr' }) },
          { ...tFrame('f-cv-rule', 8, 40, 40, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-cv-contact', 8, 50, 48, 6, 'hello.danilabs@gmail.com', { font: 'Inter', size: 8, color: '#FFFFFF', dir: 'ltr' }) },
          { ...tFrame('f-cv-phone', 8, 60, 48, 6, '+92 300 0000000', { font: 'Inter', size: 8, color: '#FFFFFF', dir: 'ltr' }) },
          { ...tFrame('f-cv-loc', 8, 70, 48, 6, 'Lahore, Pakistan', { font: 'Inter', size: 8, color: '#FFFFFF', dir: 'ltr' }) },
          { ...tFrame('f-cv-skills-h', 8, 100, 48, 6, 'SKILLS', { font: 'Inter', size: 8, color: '#C69B47', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-cv-skills', 8, 110, 48, 90, 'TypeScript · React · Node\nPython · Rust\nUI / UX · Typography\nUrdu · English', { font: 'Inter', size: 8, color: '#FFFFFF', dir: 'ltr' }) },
          { ...tFrame('f-cv-main-name', 70, 16, 130, 16, 'Muhammad Danish', { font: 'Inter', size: 24, color: '#0F4C3A', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-cv-main-title', 70, 36, 130, 8, 'Senior Software Engineer · DaniLabs', { font: 'Inter', size: 12, color: '#475569', dir: 'ltr' }) },
          { ...tFrame('f-cv-exp-h', 70, 56, 130, 6, 'EXPERIENCE', { font: 'Inter', size: 8, color: '#0F4C3A', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-cv-rule2', 70, 64, 30, 1, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-cv-exp', 70, 72, 130, 200, SAMPLE_LTRS_CV, { font: 'Inter', size: 9, color: '#0F172A', dir: 'ltr', align: 'left' }) },
        ],
      },
    ],
  },

  /* ---------------------- BROCHURE / 9. Travel brochure ---------------------- */
  {
    id: 't-brochure-travel',
    title: 'Travel Brochure',
    titleUrdu: 'سفری بروشر',
    sub: 'Tri-fold travel brochure with image panels',
    description: 'A4 landscape tri-fold brochure with three panels: cover, attractions, and contact info. Image placeholders are tagged with captions.',
    cat: 'report', kind: 'brochure', tag: 'A4',
    size: 'A4', orientation: 'landscape', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0284C7', secondary: '#E0F2FE' },
    pages: [
      {
        id: 'p1', kind: 'brochure', bg: '#FFFFFF',
        frames: [
          { ...tFrame('f-tr-cover', 0, 0, 66, 0.3, '', { size: 1, color: '#0284C7' }) },
          { ...tFrame('f-tr-cover-eyebrow', 4, 30, 58, 6, 'VISIT', { font: 'Inter', size: 9, color: '#0284C7', weight: 'bold', dir: 'ltr', align: 'center' }) },
          { ...tFrame('f-tr-cover-title', 4, 60, 58, 24, 'Pakistan', { font: 'Inter', size: 30, color: '#0F4C3A', weight: 'bold', dir: 'ltr', align: 'center' }) },
          { ...tFrame('f-tr-cover-rule', 24, 92, 18, 1, '', { size: 1, color: '#0284C7' }) },
          { ...tFrame('f-tr-cover-sub', 4, 100, 58, 8, 'Land of the pure', { font: 'Inter', size: 12, color: '#475569', italic: true, dir: 'ltr', align: 'center' }) },
          { ...tFrame('f-tr-cover-img', 12, 130, 42, 30, '[Hunza image]', { font: 'Inter', size: 8, color: '#94A3B8', align: 'center' }) },
          { ...tFrame('f-tr-attr-h', 70, 16, 60, 6, 'TOP ATTRACTIONS', { font: 'Inter', size: 8, color: '#0284C7', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-tr-attr', 70, 28, 60, 220,
            '· Hunza Valley\n· Skardu & Deosai\n· Lahore Fort\n· Mohenjo-daro\n· Naran Kaghan\n· Fairy Meadows\n· Islamabad\n· Karimabad\n· Nanga Parbat view',
            { font: 'Inter', size: 10, color: '#0F172A', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-tr-info-h', 134, 16, 60, 6, 'PLAN YOUR TRIP', { font: 'Inter', size: 8, color: '#0284C7', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-tr-info', 134, 28, 60, 100, SAMPLE_LTRS_BROCHURE, { font: 'Inter', size: 9, color: '#0F172A', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-tr-contact', 134, 140, 60, 80, 'Pakistan Tourism\nwww.tourism.gov.pk\nhello@tourism.gov.pk\n+92 51 920 5337', { font: 'Inter', size: 9, color: '#475569', dir: 'ltr', align: 'left' }) },
        ],
      },
    ],
  },

  /* ---------------------- BUSINESS CARD / 10. Business card ---------------------- */
  {
    id: 't-card-biz',
    title: 'Business Card',
    titleUrdu: 'بزنس کارڈ',
    sub: 'A single-page business card design',
    description: 'A landscape DL-sized card with name, title, contact details, and a small mark area. Clean, professional layout.',
    cat: 'card', kind: 'card', tag: 'Card',
    size: 'DL', orientation: 'landscape', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0F4C3A', secondary: '#C69B47' },
    pages: [
      {
        id: 'p1', kind: 'card', bg: '#FFFFFF',
        frames: [
          { ...tFrame('f-bc-mark', 6, 12, 14, 14, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-bc-name', 24, 14, 70, 8, 'Muhammad Danish', { font: 'Inter', size: 14, color: '#0F172A', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-bc-role', 24, 24, 70, 6, 'Senior Engineer', { font: 'Inter', size: 9, color: '#0F4C3A', dir: 'ltr' }) },
          { ...tFrame('f-bc-rule', 24, 33, 14, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-bc-info', 24, 38, 70, 30, 'hello.danilabs@gmail.com\n+92 300 0000000\ndanilabs.com', { font: 'Inter', size: 8, color: '#475569', dir: 'ltr' }) },
        ],
      },
    ],
  },

  /* ---------------------- RESUME / 11. Resume ---------------------- */
  {
    id: 't-resume-modern',
    title: 'Modern Resume',
    titleUrdu: 'جدید ترین ریزیومے',
    sub: 'A clean two-column resume with skills sidebar',
    description: 'A4 portrait modern resume. Header with name and contact, sidebar with skills, main column with experience.',
    cat: 'report', kind: 'cv', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0284C7', secondary: '#E0F2FE' },
    pages: [
      {
        id: 'p1', kind: 'resume',
        frames: [
          { ...tFrame('f-r-name', 16, 16, 168, 12, 'Muhammad Danish', { font: 'Inter', size: 28, color: '#0284C7', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-r-role', 16, 36, 168, 8, 'Senior Software Engineer', { font: 'Inter', size: 12, color: '#475569', dir: 'ltr' }) },
          { ...tFrame('f-r-rule', 16, 50, 30, 1, '', { size: 1, color: '#0284C7' }) },
          { ...tFrame('f-r-contact', 16, 56, 168, 6, 'Lahore · hello.danilabs@gmail.com · +92 300 0000000', { font: 'Inter', size: 9, color: '#64748B', dir: 'ltr' }) },
          { ...tFrame('f-r-exp-h', 16, 80, 80, 6, 'EXPERIENCE', { font: 'Inter', size: 8, color: '#0284C7', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-r-exp', 16, 92, 80, 170, SAMPLE_LTRS_CV, { font: 'Inter', size: 9, color: '#0F172A', dir: 'ltr' }) },
          { ...tFrame('f-r-side', 104, 80, 80, 200, '', { size: 1, color: '#E0F2FE' }) },
          { ...tFrame('f-r-side-skills', 108, 88, 70, 6, 'SKILLS', { font: 'Inter', size: 8, color: '#0284C7', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-r-side-body', 108, 100, 70, 200, 'TypeScript · React\nPython · Rust\nUI/UX · Typography\nUrdu · English\nAdobe Suite\nFigma', { font: 'Inter', size: 9, color: '#0F172A', dir: 'ltr' }) },
        ],
      },
    ],
  },

  /* ---------------------- Annual Report / 12. Annual report ---------------------- */
  {
    id: 't-rpt-annual',
    title: 'Annual Report',
    titleUrdu: 'سالانہ رپورٹ',
    sub: 'Cover + TOC + chapters + appendix',
    description: 'A4 portrait annual report. 4 pages: cover, contents, body, appendix. Bilingual headings.',
    cat: 'report', kind: 'report', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#1E3A5F', secondary: '#94A3B8' },
    pages: [
      {
        id: 'p1', kind: 'cover', bg: '#1E3A5F',
        frames: [
          { ...tFrame('f-ar-cover-title', 16, 90, 168, 30, 'Annual Report 2025', { font: 'Inter', size: 36, color: '#FFFFFF', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-ar-cover-sub', 16, 130, 168, 12, 'A year of growth, learning, and impact.', { font: 'Inter', size: 14, color: '#C69B47', italic: true, dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-ar-cover-rule', 16, 152, 30, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-ar-cover-org', 16, 200, 168, 8, 'DANILABS', { font: 'Inter', size: 14, color: '#FFFFFF', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-ar-cover-year', 16, 220, 168, 8, '2025', { font: 'Inter', size: 24, color: '#C69B47', dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p2', kind: 'toc',
        frames: [
          { ...tFrame('f-ar-toc-h', 16, 16, 168, 12, 'Contents', { font: 'Inter', size: 24, color: '#1E3A5F', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-ar-toc-rule', 16, 38, 30, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-ar-toc-list', 16, 50, 168, 220,
            'Letter from the founder .......... 3\nThe year in numbers ................. 5\nProduct highlights ................. 8\nCommunity stories .................. 12\nLooking ahead ...................... 16\nFinancials ........................... 18\nAppendix ............................. 22',
            { font: 'Inter', size: 11, color: '#0F172A', dir: 'ltr' }) },
        ],
      },
      {
        id: 'p3', kind: 'chapter',
        frames: [
          { ...tFrame('f-ar-ch-h', 16, 16, 168, 8, 'CHAPTER 1', { font: 'Inter', size: 9, color: '#C69B47', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-ar-ch-t', 16, 30, 168, 18, 'Letter from the founder', { font: 'Inter', size: 24, color: '#1E3A5F', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-ar-ch-rule', 16, 56, 30, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-ar-ch-body', 16, 66, 168, 200, SAMPLE_LTRS_REPORT, { font: 'Inter', size: 10, color: '#0F172A', dir: 'ltr' }) },
        ],
      },
      {
        id: 'p4', kind: 'appendix',
        frames: [
          { ...tFrame('f-ar-ax-h', 16, 16, 168, 12, 'Appendix', { font: 'Inter', size: 18, color: '#1E3A5F', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-ar-ax-body', 16, 36, 168, 230, SAMPLE_LTRS_PROSE, { font: 'Inter', size: 9, color: '#475569', dir: 'ltr' }) },
        ],
      },
    ],
  },

  /* ---------------------- Magazine / 13. Tech magazine ---------------------- */
  {
    id: 't-mag-tech',
    title: 'Tech Magazine',
    titleUrdu: 'ٹیک میگزین',
    sub: 'Modern editorial layout, English',
    description: 'A4 portrait tech magazine. 3 pages: cover, contents, and a long-form article with a side callout.',
    cat: 'magazine', kind: 'magazine', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#1E3A5F', secondary: '#0EA5E9' },
    pages: [
      {
        id: 'p1', kind: 'cover', bg: '#1E3A5F',
        frames: [
          { ...tFrame('f-tm-mast', 0, 8, 200, 6, 'TECH MAGAZINE', { font: 'Inter', size: 8, color: '#0EA5E9', weight: 'bold', align: 'center' }) },
          { ...tFrame('f-tm-issue', 0, 18, 200, 5, 'Issue 04 · Oct 2025', { font: 'Inter', size: 7, color: '#94A3B8', align: 'center' }) },
          { ...tFrame('f-tm-rule', 70, 28, 60, 1, '', { size: 1, color: '#0EA5E9' }) },
          { ...tFrame('f-tm-title', 16, 80, 168, 80, 'The future\nof code.', { font: 'Inter', size: 48, color: '#FFFFFF', weight: 'bold', dir: 'ltr', align: 'left' }) },
          { ...tFrame('f-tm-sub', 16, 200, 168, 12, 'Six essays on programming, craft, and community.', { font: 'Inter', size: 12, color: '#94A3B8', italic: true, dir: 'ltr', align: 'left' }) },
        ],
      },
      {
        id: 'p2', kind: 'contents',
        frames: [
          { ...tFrame('f-tm2-h', 16, 16, 168, 12, 'In this issue', { font: 'Inter', size: 22, color: '#1E3A5F', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-tm2-list', 16, 36, 168, 220,
            'Letters .............................. 4\nThe shape of code ............. 6\nBuilding UrduOfDani ........ 12\nNotes on typography ......... 18\nA field guide to tests ........ 22\nReviews ........................... 28',
            { font: 'Inter', size: 11, color: '#0F172A', dir: 'ltr' }) },
        ],
      },
      {
        id: 'p3', kind: 'article',
        frames: [
          { ...tFrame('f-tm3-h', 16, 16, 168, 6, 'FEATURE', { font: 'Inter', size: 8, color: '#0EA5E9', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-tm3-t', 16, 28, 168, 16, 'Building UrduOfDani', { font: 'Inter', size: 24, color: '#1E3A5F', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-tm3-rule', 16, 50, 30, 1, '', { size: 1, color: '#0EA5E9' }) },
          { ...tFrame('f-tm3-body', 16, 60, 110, 200, SAMPLE_LTRS_REPORT, { font: 'Inter', size: 10, color: '#0F172A', dir: 'ltr' }) },
          { ...tFrame('f-tm3-callout', 134, 60, 50, 100, 'PULL QUOTE\n"Software is the\nsum of its\nconstraints."\n— M. Danish', { font: 'Inter', size: 11, color: '#1E3A5F', italic: true, weight: 'bold', dir: 'ltr' }) },
        ],
      },
    ],
  },

  /* ---------------------- Bilingual newsletter / 14. Corporate News ---------------------- */
  {
    id: 't-news-corp',
    title: 'Corporate News',
    titleUrdu: 'کارپوریٹ خبر',
    sub: 'Bilingual EN+UR newsletter for businesses',
    description: 'A4 portrait bilingual newsletter with side-by-side English and Urdu columns.',
    cat: 'newsletter', kind: 'newsletter', tag: 'A4',
    size: 'A4', orientation: 'portrait', direction: 'ltr',
    palette: { bg: '#FFFFFF', fg: '#0F172A', accent: '#0F4C3A', secondary: '#FBF3E1' },
    pages: [
      {
        id: 'p1', kind: 'newsletter',
        frames: [
          { ...tFrame('f-cn-mast', 0, 8, 200, 6, 'DANILABS · NEWSLETTER', { font: 'Inter', size: 8, color: '#0F4C3A', weight: 'bold', align: 'center' }) },
          { ...tFrame('f-cn-rule', 70, 18, 60, 1, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-cn-t-en', 16, 30, 80, 12, 'Q4 Highlights', { font: 'Inter', size: 18, color: '#0F4C3A', weight: 'bold', dir: 'ltr' }) },
          { ...tFrame('f-cn-t-ur', 110, 30, 80, 12, 'سہ ماہی رپورٹ', { size: 18, color: '#0F4C3A', weight: 'bold', align: 'right' }) },
          { ...tFrame('f-cn-en', 16, 50, 80, 220, SAMPLE_LTRS_PROSE, { font: 'Inter', size: 9, color: '#0F172A', dir: 'ltr' }) },
          { ...tFrame('f-cn-ur', 110, 50, 80, 220, SAMPLE_URDU_ARTICLE, { size: 9, color: '#0F172A', align: 'right' }) },
        ],
      },
    ],
  },

  /* ---------------------- Mosque poster / 15. Mosque poster ---------------------- */
  {
    id: 't-poster-mos',
    title: 'Mosque Poster',
    titleUrdu: 'مسجد پوسٹر',
    sub: 'A2 event poster with Urdu typography',
    description: 'A2 portrait poster with cream paper feel, a green central cartouche, and Urdu-heavy typography.',
    cat: 'poster', kind: 'poster', tag: 'A2',
    size: 'A3', orientation: 'portrait', direction: 'rtl',
    palette: { bg: '#FBF3E1', fg: '#0F4C3A', accent: '#0F4C3A', secondary: '#C69B47' },
    pages: [
      {
        id: 'p1', kind: 'mosque-poster', bg: '#FBF3E1',
        frames: [
          { ...tFrame('f-mp-frame', 12, 12, 176, 250, '', { size: 1, color: '#0F4C3A' }) },
          { ...tFrame('f-mp-eyebrow', 20, 36, 160, 8, 'بسم اللہ الرحمن الرحیم', { size: 14, color: '#0F4C3A', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-mp-title', 20, 80, 160, 40, 'جمعہ المبارک', { size: 60, color: '#0F4C3A', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-mp-rule', 80, 132, 40, 1, '', { size: 1, color: '#C69B47' }) },
          { ...tFrame('f-mp-line', 20, 144, 160, 12, 'خصوصی مہمان', { size: 16, color: '#0F4C3A', align: 'center', weight: 'bold' }) },
          { ...tFrame('f-mp-name', 20, 164, 160, 14, 'مولانا محمد احمد', { size: 20, color: '#0F4C3A', align: 'center' }) },
          { ...tFrame('f-mp-date', 20, 200, 160, 8, 'جمعہ · ۱۷ اکتوبر ۲۰۲۵', { size: 12, color: '#0F4C3A', align: 'center' }) },
          { ...tFrame('f-mp-venue', 20, 216, 160, 8, 'مرکزی مسجد، لاہور', { size: 10, color: '#475569', align: 'center' }) },
          { ...tFrame('f-mp-time', 20, 240, 160, 8, 'بعد از نماز مغرب', { size: 10, color: '#475569', align: 'center' }) },
        ],
      },
    ],
  },
];

/* ============================================================ *
 *  Helpers
 * ============================================================ */
export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id);
}

export function getFeaturedTemplates() {
  return TEMPLATES.filter(t => t.featured);
}

export function getCategories() {
  const cats = new Set(TEMPLATES.map(t => t.cat));
  return [
    { id: 'all', label: 'All' },
    { id: 'book',       label: 'Books' },
    { id: 'magazine',   label: 'Magazines' },
    { id: 'card',       label: 'Cards' },
    { id: 'newsletter', label: 'Newsletters' },
    { id: 'poster',     label: 'Posters' },
    { id: 'report',     label: 'Reports' },
  ].filter(c => c.id === 'all' || cats.has(c.id));
}

export function templateToDocument(t) {
  // Convert a template into the emptyDocument-style structure used by the editor.
  return {
    meta: {
      title: t.title,
      author: 'Muhammad Danish [Dani] · DaniLabs',
      page: { size: t.size, orientation: t.orientation, margin: 20 },
      template: t.id,
      paper: t.palette?.bg || '#F7F5EF',
      credit: true,
    },
    pages: t.pages.map(p => ({
      id: p.id,
      kind: p.kind,
      bg: p.bg,
      frames: p.frames.map(f => ({ ...f })),
    })),
  };
}
