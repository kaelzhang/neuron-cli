'use strict';

var node_path = require('path');
var expand = require('fs-expand');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: require('../cwd'),

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
