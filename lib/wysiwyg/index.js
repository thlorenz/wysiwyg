'use strict';

var EventEmitter = require('events').EventEmitter
  , util = require('util')

module.exports = Wysiwyg;

function Wysiwyg(opts) {
  if (!(this instanceof Wysiwyg)) return new Wysiwyg(opts);
}
util.inherits(Wysiwyg, EventEmitter);

var proto = Wysiwyg.prototype;

proto.remove = function (e) {
  this.emit('remove', e);
}

proto.insert = function (e) {
  this.emit('insert', e);
}

proto.render = function (html) {
   // TODO
}
