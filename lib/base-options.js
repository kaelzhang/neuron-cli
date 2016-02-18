'use strict'

var base = exports

var neuron_config = require('neuron-project-config')
var node_path = require('path')
var mix = require('mix2')

var BASE_OPTIONS = {
  config: {
    info: 'specify the config file to load'
  },

  cwd: {
    info: 'current working directory.',
    type: node_path,
    default: process.cwd(),
    set: function (cwd) {
      var done = this.async()

      function set_config (err, config) {
        if (err) {
          return done(err)
        }

        this.set('src', node_path.resolve(config.src))
        this.set('dist', node_path.resolve(config.dist))
        this.set('config', config)
        done(null, cwd)
      }

      var config_file = this.get('config')
      if (config_file) {
        config_file = node_path.resolve(cwd, config_file)
        return neuron_config.read_file(config_file, set_config.bind(this))
      }

      neuron_config.read(cwd, set_config.bind(this))
    }
  }
}


base.extend = function (options) {
  var ret = {}
  mix(ret, BASE_OPTIONS)
  options && mix(ret, options)

  return ret
}
