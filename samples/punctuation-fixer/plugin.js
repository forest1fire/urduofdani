// Punctuation fixer plugin. Replaces doubled full-stops and stray commas.
(function () {
  if (typeof ud === 'undefined') return;
  ud.ui.registerAction({
    id: 'punctuation-fixer.run',
    label: 'Fix punctuation',
    onRun: function () {
      var sel = ud.selection.text();
      if (!sel) { ud.ui.toast('Select some text first.'); return; }
      var fixed = sel
        .replace(/\.\.+/g, '۔')           // ..+ → ۔
        .replace(/\s+,/g, '،')             // space-before-comma → ۔
        .replace(/\s+\.\s*/g, '۔ ');       // space before full-stop
      var before_count = (sel.match(/\.\.+/g) || []).length;
      ud.document.replace({ start: 0, end: sel.length }, fixed);
      ud.ui.toast('Fixed ' + before_count + ' issues.');
    }
  });
})();
