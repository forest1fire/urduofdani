// Bridge between the renderer and either:
//   - the Electron main process (which shells out to the Python engine), or
//   - the bundled JS spell engine (used in the web preview without Electron).
//
// Both paths return the same shape: { unknown: string[], suggestions: string[] }.

import { build, check, suggest as suggestLocal, norm } from './spell.js';

const SEED_WORDS = [
  'اردو','زبان','خوبصورتی','ہماری','ثقافت','صدیوں','الفاظ','زبانیں','دوسری','گہرائی',
  'ممتاز','زباں','منفرد','تاریخ','ابتدائی','جدید','لسانی','خصوصیات','اثرات','ادب','شاعری',
  'غزل','نظم','رجحانات','امکانات','اختتام','تعارف','تہذیب','بنیادی','ڈھانچہ','لہجہ',
  'محاورے','گفتگو','دور','مادری','سحر','انسانوں','خوبصورت','پہلو','دیوان','معنی','قابل',
  'داد','اہمیت','لاکھوں','لوگوں','جھکڑ','رکھا','جمال','حسن','دوچند','کر','دیتے','ہیں',
  'تہوار','حسن','زبانوں','بیچ','کہتے','ہوئے','کرتے','کہا','جانا','پڑھا','لکھا','سیکھا',
  'کتاب','صفحہ','باب','حصہ','نظر','نگاہ','دل','دماغ','روح','جسم','ہاتھ','پاؤں','آنکھ',
  'کان','ناک','منہ','ہونٹ','دانتوں','سر','بال','چہرہ','رخ','رخسار','گال','آنکھیں','ابرو',
  'پیشانی','ناک','ہونٹ','ٹھوڑی','گردن','کندھا','بازو','کہنی','ہتھیلی','انگلیاں','ناخن',
  'سینہ','پیٹ','پیٹھ','کمر','ران','گھٹنا','پنڈلی','ٹخنہ','ایڑھی','پاؤں','پیر','پنجے',
  'دل','دل','دل','دل','دل','دل','دل','دل','دل','دل',
  'صبح','شام','رات','دن','دوپہر','سہ','صبح','شام','صبح','رات','صبح','شام','دن',
  'سال','ماہ','ہفتہ','دن','گھنٹہ','منٹ','سیکنڈ','لمبائی','چوڑائی','اونچائی','گہرائی',
  'ہندوستان','پاکستان','چین','ایران','عراق','افغانستان','بنگلہ','دیش','شہر','قصبہ','گاؤں',
  'مکان','گھر','کمرہ','دروازہ','کھڑکی','دیوار','چھت','فرش','زینہ','چھٹی','پلیٹ','کرسی',
  'میز','صوفہ','بستر','تکیہ','چادر','بچہ','بچی','بچوں','لڑکا','لڑکی','مرد','عورت',
  'لڑکے','عورتیں','لوگ','آدمی','بچے','بڑا','چھوٹا','لمبا','موٹا','پتلا','گولا','لاغر',
  'سیاہ','سفید','سرخ','نیلا','پیلا','سبز','گلابی','جامنی','سنہری','چاندی','بھورا',
  'ہے','ہیں','ہوں','ہو','تھا','تھی','تھے','ہوں','ہوں','کروں','کریں','کرے','کر','کرتا',
  'کرتی','کرتے','کیا','کیے','گیا','گئی','گئے','جا','جاؤ','جاتا','جاتی','جاتے','آ','آؤ',
  'آیا','آئی','آئے','دے','دیا','دیے','لو','لے','لیا','لیے','دیکھو','سنو','کہو','بتاؤ',
];

// Build the in-memory dictionary once at module load (~ms).
const DICT = build(SEED_WORDS);

// Public API.
export async function spellCheck(text) {
  if (typeof window !== 'undefined' && window.udani && window.udani.spell) {
    try {
      const r = await window.udani.spell.check(text);
      return { unknown: r.unknown || [] };
    } catch (err) {
      console.warn('[spell] electron bridge failed, using local engine', err);
    }
  }
  const bad = check(DICT, text);
  return { unknown: bad.map(b => b.word) };
}

export async function suggest(word, limit = 5) {
  if (typeof window !== 'undefined' && window.udani && window.udani.spell) {
    try {
      const r = await window.udani.spell.suggest(word, limit);
      return r.suggestions || [];
    } catch (err) {
      console.warn('[spell] electron bridge failed, using local engine', err);
    }
  }
  return suggest(DICT, word, limit).slice(0, limit);
}

export async function engineInfo() {
  if (typeof window !== 'undefined' && window.udani && window.udani.spell) {
    try { return await window.udani.spell.info(); }
    catch (err) { console.warn('[spell] electron bridge failed', err); }
  }
  return {
    'engine':     'urduofdani.spell (bundled)',
    'database':   'seed (web preview)',
    'words':      String(DICT.size),
    'load':       '0 ms',
    'sample':     Array.from(DICT).slice(0, 8).join(' '),
  };
}