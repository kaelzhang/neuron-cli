'use strict'

var paths = exports

var node_path = require('path')
var expand = require('fs-expand')
var unique = require('array-unique')


paths.get_names_from_path = function (path, src_root, callback) {
  var relative = node_path.relative(src_root, path)

  // If cwd === root,
  // or cwd outside root
  if (!relative || relative.indexOf('..') === 0) {
    return expand(['*'], {
      cwd: src_root,
      filter: 'isDirectory'
    }, function (err, names) {
      if (err) {
        return callback(err)
      }

      callback(null, unique(names))
    })
  }

  var name = relative.match(/[^\/]+/)[0]
  callback(null, [name])
}
