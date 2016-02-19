'use strict'

var server = exports

var node_path = require('path')
var http = require('http')
var node_url = require('url')

var express = require('express')
var open = require('open')
var serve_index = require('serve-index')
var dev_server = require('neuron-dev-server')
var simple_lr = require('simple-lr')
var reverse_router = require('neuron-reverse-router')
var make_array = require('make-array')
var access = require('object-access')


server.run = function (options, callback) {
  var port = this.port = access(options, 'config.server.port', options.port)
  var self = this

  this._check_master(
    port,
    // on master
    function () {
      self._init_master_server(options, port)
      callback(null)
    },

    // on slave
    function () {
      self._delegate(options)
      callback(null)
    },

    function (err) {
      callback(err)
    }
  )
}


server._init_master_server = function (options, port) {
  var logger = this.logger

  logger.info('start {{cyan master}} server.')

  var server_config = options.config.server
  var middleware = dev_server(server_config)
  var router = middleware.router

  var default_router = router.default_route() || {}
  var dev_index = default_router.location || '/s'
  var dev_root = make_array(default_router.root)[0] || options.dist

  var lr = this.lr = simple_lr({
    patch: server_config.patch || 'neuron.js'
  })

  var app = this.app
  app.use(lr)
  lr.attach(this.server)

  this._create_delegate_server(options)

  // index
  app.use(dev_index, serve_index(dev_root))

  // static and reverse proxy
  app.use(middleware)

  var url = 'http://localhost:' + port + dev_index
  logger.info('{{cyan server}} started at ' + url)
  if (options.open) {
    open(url)
  }

  if (options.watch) {
    this._watch(options)
  }
}


// Test if the server port is already in use
server._check_master = function (port, on_master, on_slave, on_error) {
  var app = this.app = express()
  var server = this.server = http.createServer(app)
  .once('error', function (err) {
    if (err.code !== 'EADDRINUSE') {
      return on_error(err)
    }

    on_slave()
  })
  .once('listening', function () {
    on_master()
  })
  .listen(port)
}


server._create_delegate_server = function (options) {
  this.app.post('/_delegate', function (req, res) {
    console.log(req.body)
  })
}


// delegate a server request to the server
server._delegate = function (options, callback) {
  var logger = this.logger
  logger.info('port {{' + port + '}} already in use, try to delegate to master server.')


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
      logger.error('could not initialize neuron watch.')
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
