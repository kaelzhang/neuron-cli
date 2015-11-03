'use strict';

var node_path   = require('path');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: {
    default: process.cwd()
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]'
];
