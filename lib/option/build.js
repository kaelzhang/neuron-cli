'use strict';

var node_path = require('path');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: {
    default: process.cwd(),
    set: function (cwd) {
      var done = this.async();
    }
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]'
];
