'use strict'

'use strict'

var node_path = require('path')
var expand = require('fs-expand')
var paths = require('../paths')
var base_options = require('../base-options')

exports.shorthands = {
  c: 'cwd'
}

exports.options = base_options.extend({
  port: {
    type: Number,
    info: 'server port.',
    // Neur -> 9027
    default: 9027
  },

  open: {
    type: Boolean,
    info: 'whether should open browser after server started.',
    default: true
  },

  watch: {
    type: Boolean,
    info: 'enable watcher and live reload.',
    default: true
  }
})

exports.info = 'Start a static server.'

exports.usage = [
  '{{name}} server [options]'
]
