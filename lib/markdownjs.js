'use strict';

var md = require('markdown').markdown;


function objectTree(jsonml) {
  var index = 0, raw = [];
  function walkTree(jsonml) {
    if (typeof jsonml === 'string') {
      var ret =  { text: jsonml, index: index };
      index += jsonml.length;
      raw.push(ret);
      return ret;
    }

    var tag = jsonml.shift(),
        attributes = {},
        content = [];

    if ( jsonml.length && typeof jsonml[ 0 ] === 'object' && !( jsonml[ 0 ] instanceof Array ) ) {
      attributes = jsonml.shift();
    }

    while (jsonml.length) {
      content.push( walkTree(jsonml.shift(), acc));
    }

    var tag_attrs = '';
    for ( var a in attributes ) {
      tag_attrs += ' ' + a + '="' +  attributes[ a ] + '"';
    }

    // be careful about adding whitespace here for inline elements
    if ( tag === 'img' || tag === 'br' || tag === 'hr' ) {
      return { tag: tag, attr: tag_attrs };
    }
    else {
      return { children: content,  tag: tag, attr: tag_attrs }
    }

    return content;
  }

  var content = walkTree(jsonml);
  return { tree: content, raw: raw };
}

function readmeTree() {
  var fs = require('fs');
  var rdm = fs.readFileSync(__dirname + '/../README.md', 'utf8');
  return md.parse(rdm);
}

var text = [
    '# Hello'
  , ''
  , 'Hi you **awful** peo*p *le'
].join('\n');


var tree = md.parse(text);
var rtree = readmeTree();
var acc = {};
var otree = objectTree(rtree);

