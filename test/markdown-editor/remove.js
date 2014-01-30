'use strict';
/*jshint asi: true */

var test = require('tap').test
var util = require('util');
var remove = require('../../lib/markdown-editor/remove');

function check(t, md, start, end, expected) {
  var obj = { md: md.split('\n'), start: start, end: end }
  var given = util.inspect(obj, false, 5, true);
 
  t.test('\n# given ' + given, function (t) {
    var res = remove(md, start, end);
    t.equal(res, expected, 'returns ' + util.inspect(expected.split('\n')));
    t.end()
  })
}

test('\nremove', function (t) {
  check(
      t
    , 'Line1\nLine2\nLine3'
    , { row: 1, col: 4 }
    , { row: 1, col: 5 }
    , 'Line1\nLine\nLine3'
  )

  check(
      t
    , 'Line1\nLine2\nLine3'
    , { row: 2, col: 2 }
    , { row: 2, col: 3 }
    , 'Line1\nLine2\nLie3'
  )
  t.end()
})
