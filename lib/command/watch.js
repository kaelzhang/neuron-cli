'use strict';

var watch = exports;
var gaze = require('gaze');
var paths = require('../paths');
var async = require('async');
var comfort = require('comfort');
var error_handler = comfort.errorHandler({
  harmony: true,
  logger: require('../../config/logger')
});


watch.run = function (options, callback) {
  var self = this;
  this.logger.info('{{cyan watcher started...}}')
  gaze(options.src + '/**/*', function (err, watcher) {
    if (err) {
      return callback(err);
    }

    this.on('all', function(event, filepath) {
      self._build(filepath, options);
    });
  });
};


watch._build = function (filepath, options) {
  if (this.building) {
    return this.building;
  }

  this.building = true;

  var logger = this.logger;
  var self = this;
  function callback (err) {
    self.building = false;
    if (err) {
      return error_handler(err);
    }

    logger.info('success!')
  }

  paths.get_config(filepath, function (err, config) {
    if (err) {
      return callback(err);
    }

    var root = config.src;
    var dest = config.dist;
    paths.get_names_from_path(filepath, root, function (err, name) {
      if (err) {
        return callback(err);
      }

      self.commander.command('build', {
        name: name,
        root: root,
        dest: dest
      }, callback);
    });
  });
};
