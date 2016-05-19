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

      var config_file = this.get('config')
      if (config_file) {
        config_file = node_path.resolve(cwd, config_file)
        return neuron_config.read_file(config_file, set_config.bind(this))
      }

      neuron_config.read(cwd, set_config.bind(this))

      function set_config (err, config) {
        if (err) {
          return done(err)
        }

        this.set('_src', config.src)
        this.set('_dist', config.dist)
        this.set('config', config)
        done(null, cwd)
      }
    }
  },

  src: {
    info: 'specify the source folder.',
    set: function (src) {
      return node_path.resolve(src || this.get('_src'))
    }
  },

  dist: {
    info: 'specify the dist folder.',
    set: function (dist) {
      return node_path.resolve(dist || this.get('_dist'))
    }
  },
}


base.extend = function (options) {
  var ret = {}
  mix(ret, BASE_OPTIONS)
  options && mix(ret, options)

  return ret
}
