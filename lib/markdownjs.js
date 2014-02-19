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

  var mapToMd = []
    , mapToRaw = []
    , len = nodes.length
    , node
    , offset
    , nodeIdx
    , pos
    ;

  for (nodeIdx = 0; nodeIdx < len; ++nodeIdx) { 
    node = nodes[nodeIdx];
    offset = node.offset[0];
    for (pos = node.pos[0]; pos < node.pos[1]; ++pos) { 
      mapToMd[pos] = pos + offset;
    }
  }

  var rawIdx
    , lastMdPos
    , nextMdPos
    , mapToMdLen
    ;

  mapToMdLen = mapToMd.length;
  lastMdPos = 0;

  for (rawIdx = 0; rawIdx < mapToMdLen; ++rawIdx) {
    nextMdPos = mapToMd[rawIdx];
    for (var i = lastMdPos; i <  nextMdPos; ++i) mapToRaw[i] = rawIdx;
    lastMdPos = nextMdPos;
  }

  return { mapToMd: mapToMd, mapToRaw: mapToRaw, nodes: nodes };
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

