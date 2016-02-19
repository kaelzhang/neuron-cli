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
var request = require('request')
var body_parser = require('body-parser')
var async = require('async')


server.run = function (options, callback) {
  var server_config = access(options, 'config.server')
  if (Object(server_config) !== server_config) {
    return callback('{{no server config found}}')
  }

  var port = server_config.port || options.port
  var self = this
  this.port = port

  this._check_master(
    port,
    // on master
    function () {
      self._init_master_server(options, port)
      callback(null)
    },

    // on slave
    function () {
      self._delegate(options, callback)
    },

    function (err) {
      callback(err)
    }
  )
}


// Test if the server port is already in use
server._check_master = function (port, on_master, on_slave, on_error) {
  var app = express()
  var server = http.createServer(app)
  .once('error', function (err) {
    if (err.code !== 'EADDRINUSE') {
      return on_error(err)
    }

    on_slave()
  })
  .once('listening', function () {
    on_master()
  })

  this.app = app
  this.server = server

  server.listen(port)
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

  this._delegation_middleware(options)

  // index
  app.use(dev_index, serve_index(dev_root))

  // static and reverse proxy
  app.use(middleware)

  var url = 'http://localhost:' + port + dev_index
  logger.info('{{cyan server}} started at ' + url)
  if (options.open) {
    open(url)
  }

  this.router = router
  this.watcher = {}

  this._handle_watch(options)
}


server._delegation_middleware = function (options) {
  this.app.use(body_parser.json())
  this.app.post('/_delegate', function (req, res) {
    this._handle_delegation(options, function () {
      // TODO
      res.json({
        code: 200
      })
    })

  }.bind(this))
}


// delegate a server request to the server
server._delegate = function (options, callback) {
  var logger = this.logger
  logger.info('port {{cyan ' + this.port + '}} already in use, delegating to the {{cyan master}} server...')

  request({
    url: 'http://localhost:' + this.port + '/_delegate',
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: {
      options: options
    }

  }, function (err, res, json) {
    if (!err && json.code === 200) {
      logger.info('{{green success!}}')
      return callback(null)
    }

    callback(new Error('fails to delegate to master server.'))
  })
}


// handle a delegation
server._handle_delegation = function (options) {
  this._handle_watch(options)

  if (options.config.server.routes) {
    this.router.add(routes)
  }
}


server._handle_watch = function (options) {
  if (options.watch) {
    this._watch(options, function (err) {
      if (err) {
        logger.error(err)
      }
    })
  }
}


server._watch = function (options, callback) {
  this._get_sub_commanders(function (err) {
    if (err) {
      return callback(err)
    }

    this.watcher.run(options, callback)
  }.bind(this))
}


server._get_sub_commanders = function (callback) {
  var self = this

  async.parallel([
    function (done) {
      self._get_builder(done)
    },

    function (done) {
      self._get_watcher(done)
    }

  ], callback)
}


server._get_builder = function (callback) {
  if (this.builder) {
    return callback(null)
  }

  this.commander.commander('build', function (err, commander) {
    if (err) {
      return callback('could not initialize neuron builder.')
    }

    commander.turn_on_content_check()
    commander.on('write', function (file) {
      var path = self.reverse_route(file, options)
      logger.info('    {{cyan reload}} -> ' + path)
      self.lr.reload(path)
    })

    this.builder = commander
    callback(null)

  }.bind(this))
}


server._get_watcher = function (callback) {
  if (this.watcher) {
    return callback(null)
  }

  this.commander.commander('watch', function (err, commander) {
    if (err) {
      return callback('could not initialize neuron watcher.')
    }

    this.watcher = commander
    callback(null)

  }.bind(this))
}


server.reverse_route = function (file, options) {
  return reverse_router.route(file, this.router.routes())
}
