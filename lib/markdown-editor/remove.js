'use strict';
var assert = require('assert');

var remove = module.exports = function (md, start, end) {
  var md_rows = md.split('\n')
    , updated;

  assert(start.row === end.row, 'removing test happens on one row');

  var update_row = md_rows[start.row];
  var updated_row = update_row.slice(0, start.col) + update_row.slice(end.col)

  md_rows[start.row] = updated_row;

  return md_rows.join('\n');
}

// Test
if (!module.parent && typeof window === 'undefined') {
  var md = 'Line1\nLine2\nLine3';
  var start = { row: 1, column: 4}
  var end = { row: 1, column: 5}

  var res = remove(md, start, end);
  console.log(res);

}
