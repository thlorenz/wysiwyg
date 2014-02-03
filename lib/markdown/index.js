'use strict';

var translocator = require('translocator')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util')
  , debug        = require('../debug')

module.exports = Markdown;

function initialState() {
  return  {
    bold: false
  };
}

function Markdown(opts) {
  if (!(this instanceof Markdown)) return new Markdown(opts);
  opts = opts || {};

  this.state = initialState();
  this._value = '';

  if (opts.val) this.update(opts.val);
}
util.inherits(Markdown, EventEmitter);

var proto = Markdown.prototype;

proto.rangeIn = function (text, start, end) {
  return translocator(text).range({ start: start, end: end });
}

proto.offset = function (x) {
  return x;
}

proto.loc = function (range) {
  return { start: this.offset(range[0]), end: this.offset(range[1]) };
}

proto.locIn = function (text, start, end) {
  var range  = this.rangeIn(text, start, end);
  return this.loc(range);
}

proto.update = function (val) {
  this._value = val;
  debug({ _value: this._value });
  this.emit('value-changed', { val: val });
}

proto.value = function () {
  return this._value;
}

proto.remove = function (start, end) {
  var text = this.value();
  var loc  = this.locIn(text, start, end);

  var val = text.slice(0, loc.start) + text.slice(loc.end);

  this.update(val);
}

proto.insert = function (start, end, insertText) {
  var text  = this.value();
  var loc  = this.locIn(text, start, end);

  var val = text.slice(0, loc.start) + insertText + text.slice(loc.start);
  

  debug({ insertText: insertText, text: text, val: val,  loc: loc });
  this.update(val);
}

proto.insertMark = function (start, end, mark, surround) {
  var text  = this.value();
  var loc  = this.locIn(text, start, end);

  var val = surround 
    ? text.slice(0, loc.start) + mark + text.slice(loc.start, loc.end) + mark + text.slice(loc.end)
    : text.slice(0, loc.start) + mark + text.slice(loc.end);

  this.update(val);
}
