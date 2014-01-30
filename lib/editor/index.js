'use strict';

var EE = require('events').EventEmitter
  , commands = require('./commands')
  , inherits = require('util').inherits
;

var ace = require('brace');
require('brace/mode/text');
require('brace/theme/clouds');

var $editor = document.getElementById('wysiwyg-editor');
var $textlayer = $editor.getElementsByClassName('ace_text-layer')[0];

var Editor = module.exports = function (opts) {
  if (!(this instanceof Editor)) return new Editor(opts);
  opts = opts || {};

  this.editor   = ace.edit('wysiwyg-editor');
  this.session  = this.editor.getSession();
  this.renderer = this.editor.renderer;

  this.session.setMode('ace/mode/text');
  this.editor.setTheme('ace/theme/clouds');

  this.renderer.setShowGutter(false);
  this.renderer.setOption('fontSize', 20)

  if (opts.val) this.update(opts.val);

  commands(this.editor, this);
}

inherits(Editor, EE);

var proto = Editor.prototype;

proto.update = function (val) {
  this.editor.setValue(val);
}
