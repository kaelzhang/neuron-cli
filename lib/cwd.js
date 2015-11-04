'use strict';

var package_root = require('neuron-package-root');
var node_path = require('path');

module.exports = {
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
};
