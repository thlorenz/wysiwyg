'use strict';

var markdown = require('./markdown');

// todo: updated markdown markings 
var insert = module.exports = function (md, range, text) {
  var start = markdown.offset(range[0])
    , end   = markdown.offset(range[1])

  return md.slice(0, start) + text + md.slice(start);
}
