'use strict';

var ace = require('brace');
require('brace/mode/markdown');
require('brace/theme/monokai');

module.exports = MarkdownEditor;

function MarkdownEditor(opts) {
  if (!(this instanceof MarkdownEditor)) return new MarkdownEditor(opts);

  var self = this;
  self.editor = ace.edit(opts.id);
  self.editor.getSession().setMode('ace/mode/markdown');
  self.editor.setTheme('ace/theme/monokai');
  self.editor.clearSelection();

  self.markdown = opts.markdown;
  self.markdown.on('value-changed', function (e) {
    self.editor.setValue(e.val);
  });

  if (opts.val) self.update(opts.val);
}

var proto = MarkdownEditor.prototype;

proto.update = function (val) {
  this.editor.setValue(val);
}
