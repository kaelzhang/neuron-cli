'use strict';

var server = exports;
var express = require('express');
var node_path = require('path');
var open = require('open');
var serve_index = require('serve-index');
var dev_server = require('neuron-dev-server');

server.run = function (options, callback) {
  var app = express();
  var config = options.config;
  var server_config = dev_server.options(config.server, config.root);

  var default_router = server_config.routers.default || {};
  var dev_index = default_router.location || '/mod';
  var dev_root = default_router.root || options.dist;

  // index
  app.use(dev_index, serve_index(dev_root));

  // static and reverse proxy
  app.use(dev_server(server_config));

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
