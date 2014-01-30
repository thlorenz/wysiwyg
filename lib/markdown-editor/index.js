'use strict';

var markdown = require('./markdown')
  , remove = require('./remove')
  , insert = require('./insert')

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
  var val = remove(this.value(), markdown.offset(start), markdown.offset(end));
  this.editor.setValue(val);
}

proto.insert = function (start, end, text) {
  var val = insert(this.value(), markdown.offset(start), markdown.offset(end), text);
  this.editor.setValue(val);
}
