'use strict';

var md = require('markdown').markdown;

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function escapeHTML( text ) {
  if (typeof text !== 'string') return text;
  return text.replace( /&/g, "&amp;" )
              .replace( /</g, "&lt;" )
              .replace( />/g, "&gt;" )
              .replace( /"/g, "&quot;" )
              .replace( /'/g, "&#39;" );
}

function objectify(jsonml) {
  var raw = [];

  function walk( jsonml ) {
    // basic case
    if ( typeof jsonml === 'string' ) {
      var text = escapeHTML(jsonml);
      raw.push(text);
      return { content: text };
    }

    var tag = jsonml.shift(),
        attributes = {},
        content = [];

    if ( jsonml.length && typeof jsonml[ 0 ] === 'object' && !( jsonml[ 0 ] instanceof Array ) )
      attributes = jsonml.shift();

    while ( jsonml.length )
      content.push( walk( jsonml.shift() ) );

    var node = {};
    if (tag && tag.length) node.tag = tag;
    if (Object.keys(attributes).length) node.attr = attributes;
    if (content && content.length) node.children = content;

    return node;
  }

  var content = walk(jsonml);
  return { content: content, raw: raw };
}

var fs = require('fs');

var text = [
    '# headline'
  , ''
  , 'Hi you **awful** peo*p *le'
].join('\n');

var readme = fs.readFileSync(__dirname + '/../README.md', 'utf8');

var tree = md.parse(readme, require('./dialect'));
var o  = objectify(tree);
delete o.raw;
o
