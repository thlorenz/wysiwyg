'use strict';
var markdown = require('./markdown');

var remove = module.exports = function (md, range) {
  var start = markdown.offset(range[0])
    , end = markdown.offset(range[1])
  return md.slice(0, start) + md.slice(end);
}
