'use strict';

var md = require('markdown').markdown
  , objectify = require('./objectify')
  , offsetify = require('./offsetify');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function mapify(otree) {
  var nodes = [];

  function walk(node) {
    if (node.content) {
      nodes.push({ content: node.content, pos: node.totalPos, offset: node.totalOffset });
    }
    if (node.children) node.children.forEach(walk);
  }

  walk(otree);

  var map = []
    , len = nodes.length
    , node
    , offs
    , nodeIdx
    , idx
    ;

  for (nodeIdx = 0; nodeIdx < len; ++nodeIdx) { 
    node = nodes[nodeIdx];
    offs = node.offset[0];
    console.log(offs);
    for (idx = node.pos[0]; idx <= node.pos[1]; ++idx) map[idx] = idx + offs;
  }

  return { map: map, nodes: nodes };
}


var fs = require('fs');

var readme = fs.readFileSync(__dirname + '/../README.md', 'utf8');

var tree = md.parse(readme);
var otree  = objectify(tree);
delete otree.raw;

var offset = offsetify(otree.content);
mapify(offset);

/*var text = [
    '# headline'
  , ''
  , 'Hi you **awful** peo*p *le'
].join('\n');*/

