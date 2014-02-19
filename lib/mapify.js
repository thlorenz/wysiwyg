'use strict';

module.exports = function mapify(otree) {
  var nodes = [];

  function walk(node) {
    if (node.content) {
      nodes.push({ content: node.content, pos: node.totalPos, offset: node.totalOffset });
    }
    if (node.children) node.children.forEach(walk);
  }

  walk(otree);

  var mapToMd = []
    , len = nodes.length
    , node
    , offset
    , nodeIdx
    , pos
    ;

  for (nodeIdx = 0; nodeIdx < len; ++nodeIdx) { 
    node = nodes[nodeIdx];
    offset = node.offset[0];
    for (pos = node.pos[0]; pos <= node.pos[1]; ++pos) { 
      mapToMd[pos] = pos + offset;
    }
  }

  var mapToRaw = []
    , rawIdx
    , lastMdPos
    , nextMdPos
    , mapToMdLen
    ;

  mapToMdLen = mapToMd.length;
  lastMdPos = 0;

  for (rawIdx = 0; rawIdx < mapToMdLen; ++rawIdx) {
    nextMdPos = mapToMd[rawIdx];
    for (var i = lastMdPos; i <  nextMdPos; ++i) {
      mapToRaw[i] = rawIdx;
    }
    lastMdPos = nextMdPos;
  }

  return { mapToMd: mapToMd, mapToRaw: mapToRaw, nodes: nodes };
}
