'use strict';

var util = require('./lib/util');

var marked = require('marked');
var createMdEditor = require('./lib/markdown-editor/');
var createEditor = require('./lib/editor/');

var debug = require('./lib/debug');

var initialValue = 'Line1\nLine2\nLine3';
var mdEditor= createMdEditor({ val: initialValue }); 
var editor= createEditor({ val: initialValue }); 

window.editor = editor;
editor
  .on('bold', function () {
    var ed = editor.editor;
    var range = ed.getSelectionRange()
      , start  = util.normalizeLocation(range.start)
      , end    = util.normalizeLocation(range.end)
    ;
    mdEditor.insertMark(start, end, '**', true)
  })
  .editor
  .on('change', function (e) {
    var action = e.data.action
      , start  = util.normalizeLocation(e.data.range.start)
      , end    = util.normalizeLocation(e.data.range.end)
    ;

    switch (action) {
      case 'removeText':
      case 'removeLines':
        mdEditor.remove(start, end);
        break;
      case 'insertText':
        mdEditor.insert(start, end, e.data.text);
        break;
      case 'insertLines':
        mdEditor.insert(start, end, e.data.lines.join('\n'));
        break;
      default: 
        console.log('unknown action', action);
        break;
    }
  });
