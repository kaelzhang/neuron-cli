'use strict';

var server = exports;
var express = require('express');
var node_path = require('path');
var open = require('open');
var serve_index = require('serve-index');
var dev = require('neuron-dev-server');

server.run = function (options, callback) {
  var app = express();
  var config = options.config;
  var dev_index = '/_index';

  app.use(dev_index, serve_index(options.dist));

  var server_config = dev.clean_options(config.server, config.root);

  app.use(dev(server_config));

  // TODO: reload server and patch files
  // app.use();

  var logger = this.logger;
  app.listen(options.port, function(){
    var url = 'http://localhost:' + options.port + dev_index;
    logger.info('{{cyan server}} started at ' + url);

    if (options.open) {
      open(url);
    }
  });
};
