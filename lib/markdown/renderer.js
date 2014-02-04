'use strict';

var marked = require('marked');
marked.setOptions({ 
    gfm       :  true
  , pedantic  :  false
  , sanitize  :  true
})

exports.render = function (val) {
  return marked(val);
}
