'use strict';

var translocator = require('translocator');

var ace = require('brace');
require('brace/mode/text');
require('brace/theme/clouds');

module.exports = WysiwygEditor;

function WysiwygEditor(opts) {
  if (!(this instanceof WysiwygEditor)) return new WysiwygEditor(opts);

  var self = this;
  
  opts = opts || {};

  self.id       = opts.id
  self.wysiwyg  = opts.wysiwyg;
  self.editor   = ace.edit(opts.id);
  self.session  = self.editor.getSession();
  self.renderer = self.editor.renderer;

  self.session.setMode('ace/mode/text');
  self.editor.setTheme('ace/theme/clouds');

  self.renderer.setShowGutter(false);
  self.renderer.setOption('fontSize', 20)

  if (opts.val) self.update(opts.val);

  self.addCommands();
  self.registerEdits();
}

var proto = WysiwygEditor.prototype;

proto.update = function (val) {
  this.editor.setValue(val);
}

proto.editorEl = function () {
  return document.getElementById(this.id);
}

proto.textLayer = function () {
  return this.editorEl().getElementsByClassName('ace_text-layer')[0];
}

proto.addCommands = function () {
  var self = this;

  function styleSelection(type, editor, arg) {
      var range  = self.editor.getSelectionRange()
        , start  = self.normalizeLocation(range.start)
        , end    = self.normalizeLocation(range.end)

      self.wysiwyg.emit(type, { start: start, end: end });
  }

  // CMD-B => bold
  self.editor.commands.addCommand({
    name      : 'bold',
    bindKey   : { win: 'Ctrl-B',  mac: 'Cmd-B'},
    exec      : styleSelection.bind(null, 'bold'),
    readOnly  : false
  });

  // CMD-I => italic
  self.editor.commands.addCommand({
    name      : 'italic',
    bindKey   : { win: 'Ctrl-I',  mac: 'Cmd-I'},
    exec      : styleSelection.bind(null, 'italic'),
    readOnly  : false
  });
}

proto.normalizeLocation = function (loc) {
  return { line: loc.row, column: loc.column };
}

proto.rangeIn = function (text, start, end) {
  return translocator(text).range({ start: start, end: end });
}

proto.registerEdits = function () {
  var self = this;

  self.editor
    .on('change', function (e) {
      var action = e.data.action
        , start  = self.normalizeLocation(e.data.range.start)
        , end    = self.normalizeLocation(e.data.range.end)
      ;

      switch (action) {
        case 'removeText':
        case 'removeLines':
          self.wysiwyg.remove({ start: start, end: end });
          break;
        case 'insertText':
          self.wysiwyg.insert({ start: start, end: end, text: e.data.text });
          break;
        case 'insertLines':
          self.wysiwyg.insert({ start: start, end: end, text: e.data.lines.join('\n') });
          break;
        default: 
          console.log('unknown action', action);
          break;
      }
    })
}
