'use strict';

var marked = require('marked');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function fillin(offsets, offset, line, start, end) {
  for (var i = start; i < end; i++) { 
    if (offsets[i] && offsets[i].mark) continue;
    offsets[i] = { mark: false, off: offset, char: line[i] }
  }
}

function fillmark(offsets, line, start, end, mark) { 
  for (var i = start; i < end; i++) { 
    offsets[i] = { mark: mark, char: line[i] }
  }
}

function legend(line) {
  return line.split('').reduce(function(acc, x, idx) { return acc + x + ':' + idx + ' ' }, '');
}

var go = module.exports = function findOffsets (line) {
  var defRenderer = new marked.Renderer();
  var renderer = new marked.Renderer();
  var linelen = line.length;
  var offsets = [];
  var offset = 0;
  var lastend = 0;

  function process(cap, mark) {
      var token    = cap[0]
        , word     = cap[2]
        , tokenlen = token.length
        , wordlen  = word.length
        , inlen    = cap.input.length;

      var start = (linelen - inlen) + cap.index
        , end   = start + token.length;

      // i.e.: token: '**bold**', word: 'bold' => marklen: 2
      var marklen = (tokenlen - wordlen) / 2;
      inspect({
          mark    : mark
        , marklen : marklen
        , input   : cap.input
        , word    : word
        , token   : token
        , cap2    : cap[2]
        , start   : start
        , end     : end
      })

      // fill all slots up to this marker with last offset
      //fillin(offsets, offset, line, lastend, start);
      fillmark(offsets, line, start, start + marklen, mark);

      offset += marklen;

      // fill all slots between start and end to be offset correctly
      //fillin(offsets, offset, line, start + marklen, end - 1);
      fillmark(offsets, line, end - marklen, end, mark);

      offset += marklen;
      lastend = end;
  }

  [ 'strong'
  , 'em'
  ].forEach(function (mark) {
      renderer[mark] = function (word, cap) {
        process(cap, mark);
        return defRenderer[mark].apply(this, arguments);
      };
    })

  marked(line, { renderer: renderer });
  return offsets;
}

// Test
if (!module.parent && typeof window === 'undefined') {
  //var text = 'hello *world* m**y** friends';
  //var text = 'hello ***world*** m**y** friends';
  var text = '*e* **s** ***i*** ';

  console.log(marked(text));
  go(text);
}
