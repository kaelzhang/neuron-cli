'use strict';

var server = exports;
var express = require('express');
var node_path = require('path');
var open = require('open');
var serve_index = require('serve-index');

server.run = function (options, callback) {
  var app = express();
  var server_root = options.config.server_root;

  server_root = clean_root(server_root);

  app.use(server_root, express.static(options.dist));
  app.use(server_root, serve_index(options.dist));

  var logger = this.logger;
  app.listen(options.port, function(){
    var url = 'http://localhost:' + options.port + server_root;
    logger.info('{{cyan server}} started at ' + url);

    if (options.open) {
      open(url);
    }
  });
};


function clean_root (root) {
  return root
  .replace(/^\/*/, '/')
  .replace(/\/+$/, '');
}
