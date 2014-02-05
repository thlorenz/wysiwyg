'use strict';

exports.normalizeLocation = function (loc) {
  return { line: loc.row, column: loc.column };
}
