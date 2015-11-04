'use strict';

var paths = exports;

var package_root = require('neuron-package-root');
var node_path = require('path');
var expand = require('fs-expand');

paths.cwd_property = {
  info: 'current working directory.',
  default: process.cwd(),
  set: function (cwd) {
    var done = this.async();
    paths.get_paths(cwd, function (err, root, dest) {
      if (err) {
        return done(err);
      }

      this.set('root', root);
      this.set('dest', dest);
      done(null, cwd);

    }.bind(this));
  }
};


paths.get_paths = function (cwd, callback) {
  package_root(cwd, function (root) {
    if (!root) {
      return done('no "neuron.config.js" found.');
    }

    var config = require(node_path.join(root, 'neuron.config.js'));
    callback(null, node_path.resolve(config.root), node_path.resolve(config.dest));
  });
};


paths.get_names_from_path = function (path, root, callback) {
  var relative = node_path.relative(root, path);

  // If cwd === root,
  // or cwd outside root
  if (!relative || relative.indexOf('..') === 0) {
    return expand(['*'], {
      cwd: root
    }, callback);
  }

  var name = relative.match(/[^\/]+/)[0];
  callback(null, [name]);
};
