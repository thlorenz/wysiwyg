'use strict';

var remove = require('./remove')
  , insert = require('./insert')
  , insertMark = require('./insert-mark') 
  , util = require('../util')

var marked = require('marked');
marked.setOptions({ 
    gfm       :  true
  , pedantic  :  false
  , sanitize  :  true
})

var ace = require('brace');
require('brace/mode/markdown');
require('brace/theme/monokai');

var MarkdownEditor = module.exports = function (opts) {
  if (!(this instanceof MarkdownEditor)) return new MarkdownEditor(opts);
  opts = opts || {};

  this.editor = ace.edit('markdown-editor');
  this.editor.getSession().setMode('ace/mode/markdown');
  this.editor.setTheme('ace/theme/monokai');
  this.editor.clearSelection();

  if (opts.val) this.update(opts.val);
}

var proto = MarkdownEditor.prototype;

proto.update = function (val) {
  this.editor.setValue(val);
}

proto.value = function () {
  return this.editor.getValue();
}

proto.update = function (md) {
  this.editor.setValue(md);      
};

proto.remove = function (start, end) {
  var text = this.value();
  var range = util.rangeIn(text, start, end);
  var val = remove(text, range);
  this.update(val);
}

proto.insert = function (start, end, insertText) {
  var text = this.value();
  var range = util.rangeIn(text, start, end);
  var val = insert(text, range, insertText);
  this.update(val);
}

proto.insertMark = function (start, end, mark, surround) {
  var text = this.value();
  var range = util.rangeIn(text, start, end);
  var val = insertMark(text, range, mark, surround);
  this.update(val);
}
