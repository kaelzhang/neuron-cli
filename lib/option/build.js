'use strict';

var node_path = require('path');
var paths = require('../paths');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: paths.cwd_property,

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

      paths.get_names_from_path(cwd, root, done);
    }
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]'
];
