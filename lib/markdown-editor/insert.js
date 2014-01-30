'use strict';

// todo: handle multi line inserts if we want to support paste
var insert = module.exports = function (md, start, end, text) {
  console.log({ start: start, end: end, text: text });
  var md_rows = md.split('\n')
    , updated;

  var row, updated_row;

  row = md_rows[start.row];
  updated_row = row.slice(0, start.col) + text + row.slice(start.col)

  md_rows[start.row] = updated_row;

  return md_rows.join('\n');
}
