'use strict';

var markdown = require('./markdown');

module.exports = function (md, range, mark, surround) {
    var start = markdown.offset(range[0])
      , end   = markdown.offset(range[1])

  // TODO: update markdown state, i.e. all text after added marks needs to be offset on that line
  //       interestingly since the original location data is line/column based, adding a marking on a line
  //       does not affect finding correct range on other lines since translocator counts the actual line length
  //       when jumping lines
  return surround 
    ? md.slice(0, start) + mark + md.slice(start, end) + mark + md.slice(end)
    : md.slice(0, start) + mark + md.slice(end);
}