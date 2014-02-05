'use strict';

var initialValue = 'Line1\nLine2\nLine3';
var renderer = require('./lib/markdown/renderer');
var common = require('./lib/common');

var markdown = require('./lib/markdown')({ raw: initialValue });
require('./lib/markdown/editor')({ 
    markdown : markdown
  , id       : 'markdown-editor'
  , val      : initialValue
});

var wysiwyg = require('./lib/wysiwyg')({ val: initialValue });
var wysiwygEditor = require('./lib/wysiwyg/editor')({ 
    wysiwyg : wysiwyg
  , id      : 'wysiwyg-editor'
  , val     : initialValue
}); 

var $indicators = document.getElementById('style-indicators');
var indicators = [
    'bold'
  , 'italic'
  ].reduce(function (acc, type) {
      acc[type] = $indicators.getElementsByClassName(type)[0]
      return acc;
  }, {})


wysiwyg
  .on('bold', function (e) {
    markdown.insertMark('bold', e.start, e.end, '**', true)
  })
  .on('italic', function (e) {
    markdown.insertMark('italic', e.start, e.end, '*', true)
  })
  .on('remove', function (e) {
    markdown.remove(e.start, e.end);
  })
  .on('insert', function (e) {
    markdown.insert(e.start, e.end, e.text);
  });

wysiwygEditor.editor
  .on('changeSelection', function () {
    var cursorPos = wysiwygEditor.editor.getCursorPosition();
    markdown.updateCursor(common.normalizeLocation(cursorPos));
  });

markdown
  .on('value-changed', function (e) {
    var rendered = renderer.render(e.val);
    var html = rendered.slice('<p>'.length, -('</p>'.length + 1))
    wysiwyg.render(html);
  })
  .on('active-marks-changed', function (e) {
    Object.keys(indicators).forEach(function (k) {
      var indicator = indicators[k];
      if (indicator) indicator.classList.remove('active');
    })
    e.marks.forEach(function (m) {
      var indicator = indicators[m.type];
      if (indicator) indicator.classList.add('active');
    });
  })
