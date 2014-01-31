'use strict';
/*jshint asi: true */

var test = require('tap').test
var util = require('util');
var insert = require('../../lib/markdown-editor/insert');

// Currently these tests are not necessary since the logic is now handled by translocator
return;
function check(t, md, start, end, text, expected) {
  var obj = { md: md.split('\n'), start: start, end: end, text: text }
  var given = util.inspect(obj, false, 5, true);
 
  t.test('\n# given ' + given, function (t) {
    var res = insert(md, start, end, text);
    t.equal(res, expected, 'returns ' + util.inspect(expected.split('\n')));
    t.end()
  })
}

test('\ninsert', function (t) {
  check(
      t
    , 'Line1\nLine2\nLine3'
    , { row: 1, col: 4 }
    , { row: 1, col: 5 }
    , 'f'
    , 'Line1\nLinef2\nLine3'
  )
  t.end()
})
