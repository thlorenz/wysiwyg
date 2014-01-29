'use strict';

var offset = require('./offset')
  , remove = require('./remove')

var marked = require('marked');
var ace = require('brace');
require('brace/mode/markdown');
require('brace/theme/monokai');

var editor;

marked.setOptions({ 
    gfm       :  true
  , pedantic  :  false
  , sanitize  :  true
})

exports.init = function () {
  editor = ace.edit('markdown-editor');
  editor.getSession().setMode('ace/mode/markdown');
  editor.setTheme('ace/theme/monokai');
  editor.clearSelection();
};

var value = exports.value = function () {
  return editor.getValue();
}

var update = exports.update = function (md) {
  editor.setValue(md);      
};

exports.remove = function (start, end) {
  return remove(value(), offset(start), offset(end));
}
