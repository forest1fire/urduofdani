// Document statistics panel plugin.
(function () {
  if (typeof ud === 'undefined') return;
  ud.ui.registerAction({
    id: 'statistics.run',
    label: 'Show statistics',
    onRun: function () {
      var text = ud.document.text();
      var chars = text.length;
      var words = text.match(/[\u0600-\u06FF]+/g);
      var wordCount = words ? words.length : 0;
      var sentences = text.match(/[\u06D4\u0964\.\!\?]+/g);
      var sentenceCount = sentences ? sentences.length : 0;
      ud.ui.toast(
        'Characters: ' + chars +
        '   Words: ' + wordCount +
        '   Sentences: ' + sentenceCount
      );
    }
  });
})();
