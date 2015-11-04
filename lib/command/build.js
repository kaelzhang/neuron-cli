'use strict';

var build = exports;
var neuron_build = require('neuron-build');
var async = require('async');
var node_path = require('path');
var fs = require('graceful-fs');
var neuron = require('neuron.js');

build.run = function (options, callback) {
  var self = this;
  async.parallel([
    function (done) {
      self.build_packages(options, done);
    },

    function (done) {
      self.build_neuron(options, done);
    }
  ], callback);
};


build.build_packages = function (options, callback) {
  var root = options.root;
  var dest = options.dest;
  var logger = this.logger;

  logger.info('{{cyan build}} ' + options.name.join(', ') + ' ...');

  async.each(options.name, function (name, done) {
    var from = node_path.join(root, name);
    var to = node_path.join(dest, name);

    neuron_build(from, to, function (err) {
      if (err && err.code === 'NEURON_NO_ENTRY') {
        logger.warn('"' + name + '" is an empty package, skip building.');
        return done(null);
      }

      done(err);
    });

  }, callback);
};


build.build_neuron = function (options, callback) {
  var neuron_dest = node_path.join(options.dest, 'neuron.js');
  fs.exists(neuron_dest, function (exists) {
    if (exists) {
      return callback(null);
    }

    neuron.write(neuron_dest, callback);
  });
};
