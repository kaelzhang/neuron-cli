'use strict';

var build = exports;
var neuron_build = require('neuron-build');
var async = require('async');
var node_path = require('path');

build.run = function (options, callback) {
  var root = options.root;
  var dest = options.dest;
  async.each(options.name, function (name, done) {
    var from = node_path.join(root, name);
    var to = node_path.join(dest, name);

    neuron_build(from, to, done);

  }, callback);
};