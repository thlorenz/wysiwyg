'use strict';

var initialValue = 'Line1\nLine2\nLine3';

var markdown = require('./lib/markdown')({ raw: initialValue });
require('./lib/markdown/editor')({ 
    markdown : markdown
  , id       : 'markdown-editor'
  , val      : initialValue
});

var wysiwyg = require('./lib/wysiwyg')({ val: initialValue });
var wysiwygEditor = require('./lib/wysiwyg/editor')({ 
    wysiwyg : wysiwyg
  , id      : 'wysiwyg-editor'
  , val     : initialValue
}); 


wysiwyg
  .on('bold', function (e) {
    markdown.insertMark('bold', e.start, e.end, '**', true)
  })
  .on('italic', function (e) {
    markdown.insertMark('italic', e.start, e.end, '*', true)
  })
  .on('remove', function (e) {
    markdown.remove(e.start, e.end);
  })
  .on('insert', function (e) {
    markdown.insert(e.start, e.end, e.text);
  });
