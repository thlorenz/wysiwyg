'use strict';

var translocator = require('translocator')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util')
  , debug        = require('../debug')

module.exports = Markdown;

function initialState() {
  return  {
    marks: []
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
  var r = translocator(text).range({ start: start, end: end });
  return { start: this.offset(r[0]), end: this.offset(r[1]) };
}

proto.offset = function (x) {
  return x;
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
  var range  = this.rangeIn(text, start, end);

  var val = text.slice(0, range.start) + text.slice(range.end);

  this.update(val);
}

proto.insert = function (start, end, insertText) {
  var text  = this.value();
  var range  = this.rangeIn(text, start, end);

  var val = text.slice(0, range.start) + insertText + text.slice(range.start);

  debug({ insertText: insertText, text: text, val: val,  range: range });
  this.update(val);
}

proto.insertMark = function (start, end, mark, surround) {
  var text  = this.value();
  var range  = this.rangeIn(text, start, end);

  var val = surround 
    ? text.slice(0, range.start) + mark + text.slice(range.start, range.end) + mark + text.slice(range.end)
    : text.slice(0, range.start) + mark + text.slice(range.end);

  this.update(val);
}
