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

  this._value        = '';
  this._marks        = [];
  this._pendingMarks = [];
  this._raw          = '';

  // only inserting raw values supported at this point
  if (opts.raw) this._updateRaw(opts.raw);
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

// todo: on cursor move, clear all pending marks

proto._updateRaw = function (raw) {
  if (raw) this._raw = raw;

  this._value = this._applyMarks();
  this.emit('value-changed', { val: this._value });
}

proto.remove = function (start, end) {
  var text = this._raw;
  var range  = this.rangeIn(text, start, end);
  this._pendingMarks.length = 0;

  this._raw = text.slice(0, range.start) + text.slice(range.end);
  this._offsetMarks(range.start, -(range.end - range.start));
  this._updateRaw();
}

proto.insert = function (start, end, insertText) {
  var self = this;
  var text  = self._raw;
  var range  = self.rangeIn(text, start, end);

  self._raw = text.slice(0, range.start) + insertText + text.slice(range.start);
  self._offsetMarks(range.start, insertText.length);
  self._updateRaw();

  // todo: handle nested pending marks
  self._pendingMarks
    .forEach(function (m) {
      if (m.range.start === range.start) self._doInsertMark(m.type, range, m.mark);
    });

  self._pendingMarks.length = 0;
}

/*
 * Marks
 */

proto._startMarksToLeft = function (index) {
  var startMarks = [], mark;

  for (var i = 0; i < this._marks.length; i++) {
    mark = this._marks[i];
    if (mark.index >= index) break;
    if (mark.start) startMarks.push(mark);
    else startMarks.length = 0;
  }
  return startMarks;
}

proto._marksAt = function (index) {
  var marks = [], mark;
  for (var i = 0; i < this._marks.length; i++) {
    mark = this._marks[i];
    if (mark.index === index) marks.push(mark);
  }
  return marks;
}

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
  var isRemoval = offset < 0;
  this._marks
    .forEach(function (m) {
      if (isRemoval) {
        if (m.index > start) m.index += offset
      } else { 
        if(m.index >= start) m.index += offset;
      }
    });

  // clean up marks without any content left due to removal of test
  if (isRemoval) this._marks = this._filterOrphanedMarks(this._marks, true);
}

proto._filterOrphanedMarks = function (marks) {
  // assumes marks to be sorted so that start marks always come before end marks
  return marks
    .filter(function (m) {
      if (!m.buddy) return true;
      if (m.orphaned) return false;
      // not start and not marked orphaned by matching start
      if (!m.start) return true;


      // end marks will be marked as orphaned by the matching start mark
      var orphaned = m.start && ((m.index + m.len) > m.buddy.index)
      m.buddy.orphaned = orphaned;
      console.log('idx: %d, len: %d, bidx: %d, orph: %s', m.index, m.len, m.buddy.index, orphaned);
      return !orphaned;
    });
}

proto._updateMarks = function (type, mark, range) {
  var marks = this._marks;

  // if this area is already surrounded by this type of mark, we need to remove it
  // that way we can use the same keyboard shortcut to toggle a mark on and off

  var leftStartMarks = this._startMarksToLeft(range.start);

  var existingStart = leftStartMarks.filter(function (m) { return m.type === type }).pop();

  var startMark, endMark, added, removed;
  if (!existingStart) {
    // turn mark on
    startMark = { index: range.start, type: type,  mark: mark, len: mark.length, start: true }
    marks.push(startMark);

    if (range.end) { 
      endMark = { index: range.end, type: type, mark: mark, len: mark.length, start: false, buddy: startMark }
      startMark.buddy = endMark;
      marks.push(endMark)
    }
  } else {
    // turn mark off
    this._removeMarkAt(existingStart.arrIndex, marks);
    // assuming that the buddy is always after the start mark
    if (existingStart.buddy) this._removeMarkAt(existingStart.buddy.arrIndex - 1, marks);
  }

  this._marks = marks.sort(byIndex);
  this._marks.forEach(function (m, idx) { m.arrIndex = idx });
}

proto.insertMark = function (type, start, end, mark, surround) {
  var range = this.rangeIn(this._raw, start, end);
  var deferred;
  if (range.start === range.end){ 
    deferred = this._deferMark(type, range, mark, surround);
    return this._reportActiveMarks([ deferred ]);
  }
  this._doInsertMark(type, range, mark);
  this._reportActiveMarks(range.start + 1);
}

proto.updateCursor = function (location) {
  var index = this.indexIn(this._raw, location);
  this._reportActiveMarks(index);
}


proto._doInsertMark = function (type, range, mark) {
  this._updateMarks(type, mark, range);
  this._updateRaw();
}

proto._deferMark = function (type, range, mark, surround) {
  var m = { type: type, range: range, mark: mark };
  this._pendingMarks.push(m);
  return m;
}

proto._reportActiveMarks = function(index, marks) {
  if (Array.isArray(index)) marks = index;
  var activeMarks = marks || this._startMarksToLeft(index);
  this.emit('active-marks-changed', { marks: activeMarks });
}

/*
 * Util
 */
proto.rangeIn = function (text, start, end) {
  var r = translocator(text).range({ start: start, end: end });
  return { start: r[0], end: r[1] };
}

proto.indexIn = function (text, location) {
  return translocator(text).index(location);
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
  }
  return prev;
}

proto._removeMarkAt = function (index, marks) {
  marks = marks || this._marks;
  return marks.splice(index, 1);
}

