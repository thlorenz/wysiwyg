'use strict';

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

exports.update = function (md) {
  editor.setValue(md);      
};
