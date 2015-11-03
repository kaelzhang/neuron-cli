'use strict';

var node_path = require('path');
var package_root = require('neuron-package-root');
var expand = require('fs-expand');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: {
    info: 'current working directory.',
    default: process.cwd(),
    set: function (cwd) {
      var done = this.async();
      package_root(cwd, function (root) {
        if (!root) {
          return done('no "neuron.config.js" found.');
        }

        var config = require(node_path.join(root, 'neuron.config.js'));
        this.set('root', config.root);
        this.set('dest', config.dest);

        done(null, cwd);

      }.bind(this));
    }
  },

  name: {
    info: 'specify the package to build',
    set: function (name) {
      if (name) {
        return name.split(',')
        .map(function(n){
          return n.trim();
        })
        .filter(Boolean);
      }

      name = this.get('_');
      if (name.length) {
        return name;
      }

      var cwd = this.get('cwd');
      var root = this.get('root');
      var done = this.async();

      var relative = node_path.relative(root, cwd);

      // If cwd === root,
      // or cwd outside root
      if (!relative || relative.indexOf('..') === 0) {
        return expand(['*'], {
          cwd: root
        }, done);
      }

      name = relative.match(/[^\/]+/)[0];
      done(null, [name]);
    }
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]'
];
