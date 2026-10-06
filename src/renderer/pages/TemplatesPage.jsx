import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useDocActions } from '../lib/useDocActions.js';

const CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'book',        label: 'Books' },
  { id: 'magazine',    label: 'Magazines' },
  { id: 'card',        label: 'Cards' },
  { id: 'newsletter',  label: 'Newsletters' },
  { id: 'poster',      label: 'Posters' },
  { id: 'report',      label: 'Reports' },
];

const TEMPLATES = [
  { id: 't-book-urdu',  title: 'Urdu Book',          sub: 'A clean, elegant book layout',         cat: 'book',       bg: 'linear-gradient(135deg,#F7F5EF,#EFEBDF)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'book',       titleUrdu: 'اردو کتاب',         lines: 4 },
  { id: 't-mag-edit',   title: 'Editorial Magazine', sub: 'For articles, columns and features',  cat: 'magazine',   bg: 'linear-gradient(135deg,#102A43,#1E3A5F)', fg: '#F7F5EF', tag: 'A4',   dir: 'rtl', kind: 'magazine',   titleUrdu: 'اداری مجلہ',         lines: 6 },
  { id: 't-card-wed',   title: 'Wedding Invitation', sub: 'A graceful invitation design',        cat: 'card',       bg: 'linear-gradient(135deg,#FBF3E1,#F5E5BD)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'card',       titleUrdu: 'شادی کی دعوت',     lines: 3 },
  { id: 't-news-school',title: 'School Newsletter',  sub: '4-page A4 newsletter for schools',    cat: 'newsletter', bg: 'linear-gradient(135deg,#E7F8F4,#A5E5D6)', fg: '#102A43', tag: 'A4',   dir: 'ltr', kind: 'newsletter', titleUrdu: 'School Newsletter',  lines: 5 },
  { id: 't-rpt-res',    title: 'Research Report',    sub: 'Title page + body + bibliography',    cat: 'report',     bg: 'linear-gradient(135deg,#FFFFFF,#F8FAFC)', fg: '#0F172A', tag: 'A4',   dir: 'ltr', kind: 'book',       titleUrdu: 'Research Report',    lines: 5 },
  { id: 't-poetry',     title: 'Poetry Collection',  sub: 'A beautiful layout for Urdu poetry',  cat: 'book',       bg: 'linear-gradient(135deg,#FED7D7,#FBF3E1)', fg: '#102A43', tag: 'A5',   dir: 'rtl', kind: 'book',       titleUrdu: 'شعری مجموعہ',         lines: 4 },
  { id: 't-poster',     title: 'Event Poster',       sub: 'A3 poster with hero image area',      cat: 'poster',     bg: 'linear-gradient(135deg,#0A1F33,#102A43)', fg: '#F7F5EF', tag: 'A3',   dir: 'rtl', kind: 'poster',     titleUrdu: 'پوسٹر',              lines: 3 },
  { id: 't-mag-tech',   title: 'Tech Magazine',      sub: 'Modern editorial layout, English',    cat: 'magazine',   bg: 'linear-gradient(135deg,#1E3A5F,#243B53)', fg: '#F7F5EF', tag: 'A4',   dir: 'ltr', kind: 'magazine',   titleUrdu: 'Tech Magazine',      lines: 5 },
  { id: 't-card-biz',   title: 'Business Card',      sub: 'Single-page business card design',    cat: 'card',       bg: 'linear-gradient(135deg,#E7F8F4,#D1F2EB)', fg: '#102A43', tag: 'Card', dir: 'ltr', kind: 'card',       titleUrdu: 'کارڈ',                lines: 2 },
  { id: 't-news-corp',  title: 'Corporate News',     sub: 'Bilingual newsletter, EN+UR',         cat: 'newsletter', bg: 'linear-gradient(135deg,#FFFFFF,#F7F5EF)', fg: '#102A43', tag: 'A4',   dir: 'ltr', kind: 'newsletter', titleUrdu: 'Corporate News',     lines: 4 },
  { id: 't-rpt-annual', title: 'Annual Report',      sub: 'Cover + TOC + chapters + appendix',  cat: 'report',     bg: 'linear-gradient(135deg,#F8FAFC,#E2E8F0)', fg: '#102A43', tag: 'A4',   dir: 'ltr', kind: 'book',       titleUrdu: 'Annual Report',      lines: 5 },
  { id: 't-poster-mos', title: 'Mosque Poster',      sub: 'A2 event poster with Urdu typography',cat:'poster',      bg: 'linear-gradient(135deg,#FBF3E1,#F7F5EF)', fg: '#102A43', tag: 'A2',   dir: 'rtl', kind: 'poster',     titleUrdu: 'مسجد پوسٹر',         lines: 3 },
];

export default function TemplatesPage() {
  const { dispatch } = useStore();
  const { newDoc } = useDocActions();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  const filtered = TEMPLATES.filter(t =>
    (cat === 'all' || t.cat === cat) &&
    (!q || t.title.toLowerCase().includes(q.toLowerCase()) || t.sub.toLowerCase().includes(q.toLowerCase()))
  );

  const useTemplate = (t) => {
    newDoc(t.title, { kind: t.kind });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: `Created "${t.title}"` } });
  };

  return (
    <div className="page">
      <PageHeader
        title="Templates"
        subtitle="Beautiful, RTL-ready designs to get you started in seconds."
        back
      />

      <div className="page-body">
        {/* Filter bar */}
        <div className="row-between mb-6" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id}
                      className={`btn btn-sm ${cat === c.id ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              className="input input-sm input-search"
              placeholder="Search templates…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Icon.Tiles />
            <h3>No templates found</h3>
            <p>Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid-auto-lg">
            {filtered.map(t => (
              <div key={t.id} className="tpl-card" onClick={() => useTemplate(t)}>
                <div className="tpl-preview" style={{ background: t.bg, color: t.fg }}>
                  <span className="chip tpl-chip" style={{ background: t.fg, color: t.bg }}>{t.tag}</span>
                  <div className="urdu" style={{ fontSize: 22, fontWeight: 700, textAlign: t.dir === 'rtl' ? 'right' : 'left', lineHeight: 1.2, marginBottom: 8 }}>
                    {t.titleUrdu}
                  </div>
                  <div className="tpl-lines" style={{ opacity: 0.7 }}>
                    {Array.from({ length: t.lines }).map((_, i) => (
                      <div key={i} className={`tpl-line ${i % 3 === 0 ? 'long' : i % 3 === 1 ? 'med' : 'short'}`} style={{ background: t.fg, opacity: 0.4 }} />
                    ))}
                  </div>
                </div>
                <div className="tpl-info">
                  <h4>{t.title}</h4>
                  <p>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
