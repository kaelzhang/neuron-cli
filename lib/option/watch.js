'use strict';

var node_path = require('path');
var expand = require('fs-expand');
var paths = require('../paths');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: paths.cwd_property
};

exports.info = 'Watch a workspace.';

exports.usage = [
  '{{name}} watch [options]'
];
