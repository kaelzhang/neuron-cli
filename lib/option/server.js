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
    info: 'server port.',
    // Neur -> 9027
    default: 9027
  },

  open: {
    type: Boolean,
    info: 'whether should open browser after server started.',
    default: true
  },

  watch: {
    type: Boolean,
    info: 'enable watcher and live reload.',
    default: true
  }
};

exports.info = 'Start a static server.';

exports.usage = [
  '{{name}} server [options]'
];
