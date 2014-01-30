'use strict';

var util = require('./lib/util');

var markdown = [
  'Line1', '**Line2**', 'Line3'
];

var mdEditor = require('./lib/markdown-editor/');
var debug = require('./lib/debug');
mdEditor.init();

var ace = require('brace');
require('brace/mode/text');
require('brace/theme/clouds');

var editor = ace.edit('wysiwyg-editor');
var session = editor.getSession();
var renderer = editor.renderer;
var marked = require('marked');

session.setMode('ace/mode/text');

editor.setTheme('ace/theme/clouds');

editor.setValue('Line1\nLine2\nLine3');
mdEditor.update('Line1\nLine2\nLine3');

renderer.setShowGutter(false);
renderer.setOption('fontSize', 20)

var $editor = document.getElementById('wysiwyg-editor');
var $textlayer = $editor.getElementsByClassName('ace_text-layer')[0];

editor.on('change', function (e) {
  var action = e.data.action
    , start  = util.normalizeLocation(e.data.range.start)
    , end    = util.normalizeLocation(e.data.range.end)
  ;

  switch (action) {
    case 'removeText':
      mdEditor.remove(start, end);
      break;
    default: 
      console.log('unknown action', action);
      break;
  }
});

window.g = { 
    editor     : editor
  , session    : session
  , renderer   : renderer
  , $editor    : $editor
  , $textlayer : $textlayer
};
