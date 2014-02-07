'use strict';

var markdown = require('markdown').markdown;
var Markdown = markdown.Markdown;
var DialectHelpers = markdown.DialectHelpers;

var gruber = Markdown.dialects.Gruber;

var Dialect = DialectHelpers.subclassDialect(gruber);
module.exports = Dialect;

var block = Dialect.block;

block.atxHeader = function (block, next) {
  var g = gruber.block.atxHeader.apply(this, arguments);
  return g;
}

