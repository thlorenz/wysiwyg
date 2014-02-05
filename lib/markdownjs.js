var md = require('markdown').markdown;

var text = [
    '# head'
  , ''
  , 'Hi you **awful** peo*p *le'
].join('\n');

var tree = md.parse(text);
