'use strict';

var markdown = [
  'Line1', '**Line2**', 'Line3'
];

var mdEditor = require('./lib/markdown-editor');
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

renderer.setShowGutter(false);
renderer.setOption('fontSize', 20)

var $editor = document.getElementById('wysiwyg-editor');
var $textlayer = $editor.getElementsByClassName('ace_text-layer')[0];

setInterval(function () {
  var $textlayer = $editor.getElementsByClassName('ace_text-layer')[0];
  var $lines = $textlayer.getElementsByTagName('div');
  window.g.$lines = $lines;
  [].forEach.call($lines, function (l) { 
    l.classList.add('wysiwyg-italic');
  })
}, 500);

editor.commands.addCommand({
    name: 'refresh',
    bindKey: { win: 'Ctrl-M',  mac: 'Option-M'},
    exec: function(editor) {
      console.log('executing');
      editor.setValue('Line1\nLine2\nLine3\n\nhello why');
    },
    readOnly: true // false if this command should not apply in readOnly mode
});

window.g = { 
    editor     : editor
  , session    : session
  , renderer   : renderer
  , $editor    : $editor
  , $textlayer : $textlayer
};
