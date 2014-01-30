'use strict';

var remove = module.exports = function (md, start, end) {
  var md_rows = md.split('\n')
    , updated;

  var row, updated_row;

  // TODO: handle multiline removes (i.e. via a selection)
  if (start.row !== end.row) {
      md_rows[start.row] += md_rows[end.row];
      md_rows.splice(end.row, 1);
  } else {
    row = md_rows[start.row];
    updated_row = row.slice(0, start.col) + row.slice(end.col)

    md_rows[start.row] = updated_row;
  }

  return md_rows.join('\n');
}

// Test
if (!module.parent && typeof window === 'undefined') {
  console.log(remove(
      'Line1\nLine2\nLine3'
    , { row: 0, col: 5 }
    , { row: 1, col: 0 }
  ))
}
