'use strict';

var md = require('markdown').markdown;
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

    var tag_attrs = '';
    if (typeof attributes.src !== 'undefined') {
      tag_attrs += ' src="' + escapeHTML( attributes.src ) + '"';
      delete attributes.src;
    }

    for ( var a in attributes )
      tag_attrs += ' ' + a + '="' + escapeHTML( attributes[ a ] ) + '"';

    var node = {};
    if (tag && tag.length) node.tag = tag;
    if (tag_attrs && tag_attrs.length) node.attr = tag_attrs;
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

var tree = md.parse(readme);
var o  = objectify(tree);
o.content;
