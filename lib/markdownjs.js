'use strict';

var md = require('markdown').markdown
  , objectify = require('./objectify');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function offset(tag, attr) {
  switch(tag) {
    case 'header':
      // ## Heading
      return [ attr.level + 1 ]; 
    case 'link':
      // todo
      return 0;
    case 'img':
      // todo
      return 0;
    case 'para': return 0;
    case 'inlinecode':
      // todo: has a before ``` and after ```
      return 0;
    case 'code_block':
      // todo: has before ` and after `
      return 0;
    case 'bulletlist':
    case 'listitem':
      return 0;
    case 'strong':
      // **xxx**
      return [ 2, 2 ]; 

    default:
      return 0;
  }
}

function offsetify(otree) {
  var totalOffset = 0;

  function walk(node) {
    if (node.tag) {
      node.offset = offset(node.tag, node.attr);
      totalOffset = node.totalOffset = totalOffset + node.offset;
    }
    if (node.content) node.totalOffset = totalOffset;
    if (node.children) node.children.forEach(walk);
  }

  walk(otree);
  return otree;
}

var fs = require('fs');

var text = [
    '# headline'
  , ''
  , 'Hi you **awful** peo*p *le'
].join('\n');

var readme = fs.readFileSync(__dirname + '/../README.md', 'utf8');

var tree = md.parse(readme);
var otree  = objectify(tree);
delete otree.raw;
offsetify(otree.content);
