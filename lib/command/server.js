'use strict'

var server = exports

var node_path = require('path')
var http = require('http')

var express = require('express')
var open = require('open')
var serve_index = require('serve-index')
var dev_server = require('neuron-dev-server')
var simple_lr = require('simple-lr')
var reverse_router = require('neuron-reverse-router')
var make_array = require('make-array')
var access = require('object-access')


server.run = function (options, callback) {
  if (options.watch) {
    this.watch(options)
  }

  var app = express()
  var config = options.config
  var server_config = dev_server.options(config.server, config.root)
  options.server_config = server_config

  var default_router = server_config.routers.default || {}
  var dev_index = default_router.location || '/mod'
  var dev_root = make_array(default_router.root)[0] || options.dist



  app.use(lr)

  // index
  app.use(dev_index, serve_index(dev_root))

  // static and reverse proxy
  app.use(dev_server(server_config))

  var logger = this.logger


  lr.attach(server)


  .on('error', function (err) {
    if (err.code !== 'EADDRINUSE') {
      return callback(err)
    }

    logger.info('port {{' + port + '}} already in use, try to delegate')
  })
  .on('listening', function () {
    var url = 'http://localhost:' + port + dev_index
    logger.info('{{cyan server}} started at ' + url)
    if (options.open) {
      open(url)
    }
  })
  .listen(port)
}


//
server._init_server = function (options, on_master, on_slave, on_error) {
  var port = access(options, 'config.server.port', options.port)
  var server = http.createServer(app)



}


server._attach_socket_server = function (options, app) {

}


// delegate a server request to the server
server._delegate = function (options, callback) {

}


// handle a delegation
server._handle_delegation = function (options, callback) {

}


server._get_watcher = function () {

}


server._watch = function (options) {
  var logger = this.logger
  var self = this
  this.commander.commander('build', function (err, commander) {
    if (err) {
      logger.error('could not initialize neuron build.')
      process.exit(1)
      return
    }

    commander.turn_on_content_check()
    commander.on('write', function (file) {
      var path = self.reverse_route(file, options)
      logger.info('    {{cyan reload}} -> ' + path)
      self.lr.reload(path)
    })
  })

  this.commander.commander('watch', function (err, commander) {
    if (err) {
      logger.error('could not initialize neuron build.')
      process.exit(1)
      return
    }

    commander.run(options, function (err) {
      if (err) {
        logger.error(err)
      }
    })
  })
}


server.reverse_route = function (file, options) {
  return reverse_router.route(file, options.server_config.routers)
}
