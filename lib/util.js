'use strict';

exports.normalizeLocation = function (loc) {
  return { row: loc.row, col: loc.column };
}
