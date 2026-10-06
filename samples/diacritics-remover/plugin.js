// Strip optional Arabic diacritics (ً-ٟ) from the current selection.
(function () {
  if (typeof ud === 'undefined') return;
  ud.ui.registerAction({
    id: 'diacritics-remover.run',
    label: 'Remove diacritics',
    onRun: function () {
      var sel = ud.selection.text();
      if (!sel) { ud.ui.toast('Select some text first.'); return; }
      var stripped = sel.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
      ud.document.replace({ start: 0, end: sel.length }, stripped);
      ud.ui.toast('Diacritics removed.');
    }
  });
})();
