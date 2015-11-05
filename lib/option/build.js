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
      // neuron build --name a,b
      // {name: ['a', 'b']}
      if (name) {
        return name.split(',')
        .map(function(n){
          return n.trim();
        })
        .filter(Boolean);
      }

      // neuron build a b
      name = this.get('_');
      if (name.length) {
        return name;
      }

      var cwd = this.get('cwd');
      var root = this.get('root');
      var done = this.async();

      // neuron build
      paths.get_names_from_path(cwd, root, done);
    }
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]'
];
