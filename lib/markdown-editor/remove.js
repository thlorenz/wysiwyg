'use strict';
var assert = require('assert');

var remove = module.exports = function (md, start, end) {
  var md_rows = md.split('\n')
    , updated;

  assert(start.row === end.row, 'removing happens on one row (for now)');

  var row = md_rows[start.row];
  var updated_row = row.slice(0, start.col) + row.slice(end.col)

  md_rows[start.row] = updated_row;

  return md_rows.join('\n');
}
