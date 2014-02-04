'use strict';

var translocator = require('translocator')
  , EventEmitter = require('events').EventEmitter
  , util         = require('util')
  , debug        = require('../debug')

module.exports = Markdown;

function byIndex(m1, m2) {
  return m1.index - m2.index;
}

function Markdown(opts) {
  if (!(this instanceof Markdown)) return new Markdown(opts);
  opts = opts || {};

  this._value = '';
  this._marks = [];
  this._raw = '';

  // only inserting raw values supported at this point
  if (opts.raw) this._updateRaw(opts.val);
}
util.inherits(Markdown, EventEmitter);

var proto = Markdown.prototype;

/*
 * Getters
 */

proto.value = function () {
  return this._value;
}

/*
 * Edits
 */

proto._updateRaw = function (raw) {
  if (raw) this._raw = raw;

  this._value = this._applyMarks();
  this.emit('value-changed', { val: this._value });
}

proto.remove = function (start, end) {
  var text = this._raw;
  var range  = this.rangeIn(text, start, end);

  this._raw = text.slice(0, range.start) + text.slice(range.end);
  this._offsetMarks(range.start, -(range.end - range.start));
  this._updateRaw();
}

proto.insert = function (start, end, insertText) {
  var text  = this._raw;
  var range  = this.rangeIn(text, start, end);

  this._raw = text.slice(0, range.start) + insertText + text.slice(range.start);
  this._offsetMarks(range.start, insertText.length);
  this._updateRaw();
}

/*
 * Marks
 */

proto._applyMarks = function () {
  var offset = 0;
  var raw = this._raw;
  this._marks
    .forEach(function (m) {
      var start = m.index + offset;
      raw = raw.slice(0, start) + m.mark + raw.slice(start);
      offset += m.len;
    });

  return raw; 
}

proto._offsetMarks = function (start, offset) {
  this._marks
    .forEach(function (m) {
      if (m.index >= start) m.index += offset;
    });

  // remove all marks that are no longer surrounding text (maybe?)
}

proto._updateMarks = function (type, mark, range) {
  var marks = this._marks;

  marks.push({ index: range.start, type: type,  mark: mark, len: mark.length, start: true });
  if (range.end) marks.push({ index: range.end, type: type, mark: mark, len: mark.length, start: false });
  this._marks = marks.sort(byIndex);
}

proto.insertMark = function (type, start, end, mark, surround) {
  var range = this.rangeIn(this._raw, start, end);
  this._updateMarks(type, mark, range);
  this._updateRaw();
}

/*
 * Util
 */
proto.rangeIn = function (text, start, end) {
  var r = translocator(text).range({ start: start, end: end });
  return { start: r[0], end: r[1] };
}


/*
 * Future use ??
 */
proto._closestMarkToLeft = function (index) {
  var prev = null, mark;
  for (var i = 0; i < this._marks.length; i++) {
    mark = this._marks[i];
    if (mark.index + mark.len > index) break;
    prev = mark;
    prev.arrIndex = i;
  }
  return prev;
}

