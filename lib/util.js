'use strict';
var translocator = require('translocator');

exports.normalizeLocation = function (loc) {
  return { line: loc.row, column: loc.column };
}

exports.rangeIn = function (text, start, end) {
  return translocator(text).range({ start: start, end: end });
}
