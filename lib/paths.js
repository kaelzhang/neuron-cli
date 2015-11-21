'use strict';

var paths = exports;

var package_root = require('neuron-package-root');
var node_path = require('path');
var expand = require('fs-expand');

paths.cwd_property = {
  info: 'current working directory.',
  type: node_path,
  default: process.cwd(),
  set: function (cwd) {
    var done = this.async();
    paths.get_config(cwd, function (err, config, root) {
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


paths.get_config = function (cwd, callback) {
  package_root(cwd, function (root) {
    if (!root) {
      return callback('no "neuron.config.js" found in "' + root + '"');
    }

    var config = require(node_path.join(root, 'neuron.config.js'));
    callback(null, config, root);
  });
};


paths.get_names_from_path = function (path, src_root, callback) {
  var relative = node_path.relative(src_root, path);

  // If cwd === root,
  // or cwd outside root
  if (!relative || relative.indexOf('..') === 0) {
    return expand(['*'], {
      cwd: src_root
    }, callback);
  }

  var name = relative.match(/[^\/]+/)[0];
  callback(null, [name]);
};
