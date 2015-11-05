'use strict';

'use strict';

var node_path = require('path');
var expand = require('fs-expand');
var paths = require('../paths');

exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: paths.cwd_property,

  port: {
    type: Number,
    // Neur
    default: 9027
  },

  open: {
    type: Boolean,
    default: true
  }
};

exports.info = 'Start a static server.';

exports.usage = [
  '{{name}} server [options]'
];
