'use strict';

exports.normalizeLocation = function (loc) {
  if (!loc.col) {
    loc.col = loc.column;
    delete loc.column;
  }
}
