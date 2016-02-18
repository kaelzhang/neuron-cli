'use strict'

var node_path = require('path')
var expand = require('fs-expand')
var paths = require('../paths')
var base_options = require('../base-options')

exports.shorthands = {
  c: 'cwd'
}

exports.options = base_options.extend()

exports.info = 'Watch a workspace.'

exports.usage = [
  '{{name}} watch [options]'
]
