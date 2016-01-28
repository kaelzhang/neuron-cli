'use strict';

var paths = exports;

var neuron_config = require('neuron-project-config');
var node_path = require('path');
var expand = require('fs-expand');
var unique = require('array-unique');

paths.cwd_property = {
  info: 'current working directory.',
  type: node_path,
  default: process.cwd(),
  set: function (cwd) {
    var done = this.async();

    neuron_config.read(cwd, function (err, config) {
      if (err) {
        return done(err);
      }

      this.set('src', node_path.resolve(config.src));
      this.set('dist', node_path.resolve(config.dist));
      this.set('config', config);
      done(null, cwd);

    }.bind(this));
  }
};


paths.get_names_from_path = function (path, src_root, callback) {
  var relative = node_path.relative(src_root, path);

  // If cwd === root,
  // or cwd outside root
  if (!relative || relative.indexOf('..') === 0) {
    return expand(['*'], {
      cwd: src_root,
      filter: 'isDirectory'
    }, function (err, names) {
      if (err) {
        return callback(err);
      }

      callback(null, unique(names));
    });
  }

  var name = relative.match(/[^\/]+/)[0];
  callback(null, [name]);
};
