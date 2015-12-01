'use strict';

var server = exports;

var node_path = require('path');
var http = require('http');

var express = require('express');
var open = require('open');
var serve_index = require('serve-index');
var dev_server = require('neuron-dev-server');
var simple_lr = require('simple-lr');
var reverse_route = require('neuron-reverse-router');

server.run = function (options, callback) {
  if (options.watch) {
    this.watch(options);
  }

  var app = express();
  var config = options.config;
  var server_config = dev_server.options(config.server, config.root);
  options.server_config = server_config;

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


server.watch = function (options) {
  var logger = this.logger;
  var self = this;
  this.commander.commander('build', function (err, commander) {
    if (err) {
      logger.error('could not initialize neuron build.');
      process.exit(1);
      return;
    }

    commander.turn_on_content_check();
    commander.on('write', function (file) {
      lr.reload(self.reverse_route(file, options));
    });
  });
};


server.reverse_route = function (file, options) {
  return reverse_route(file, options.server_config);
};
