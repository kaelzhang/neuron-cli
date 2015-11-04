'use strict';

var node_path = require('path');
var comfort   = require('comfort');
var logger    = require('./logger');

var context = {
  logger: logger
};

var root = node_path.join(__dirname, '..');

// Commander for CLI
// cli entrance
// cache commander instance
var commander = module.exports = comfort({
  command_root: node_path.join(root, 'lib', 'command'),
  option_root: node_path.join(root, 'lib', 'option'),
  root: root,
  name: 'neuron'
});

context.commander = commander;

commander
.context(context)
.on('error', comfort.errorHandler({
  logger: logger
}));
