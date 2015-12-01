'use strict';

var server = exports;

var node_path = require('path');
var http = require('http');

var express = require('express');
var open = require('open');
var serve_index = require('serve-index');
var dev_server = require('neuron-dev-server');
var simple_lr = require('simple-lr');

server.run = function (options, callback) {
  var app = express();
  var config = options.config;
  var server_config = dev_server.options(config.server, config.root);

  var default_router = server_config.routers.default || {};
  var dev_index = default_router.location || '/mod';
  var dev_root = default_router.root || options.dist;

  var lr = simple_lr({
    patch: server_config.patch || 'neuron.js'
  });

  this.lr = lr;

  app.use(lr);

  // index
  app.use(dev_index, serve_index(dev_root));

  // static and reverse proxy
  app.use(dev_server(server_config));

  // TODO: reload server and patch files
  // app.use();

  var logger = this.logger;

  var server = http.createServer(app);
  lr.attach(server);

  server.listen(options.port, function () {
    var url = 'http://localhost:' + options.port + dev_index;
    logger.info('{{cyan server}} started at ' + url);
    if (options.open) {
      open(url);
    }
  });
};


server.watch = function () {
  
};
