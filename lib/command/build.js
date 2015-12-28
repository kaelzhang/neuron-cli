'use strict';

var build = exports;
var neuron_build = require('neuron-build');
var async = require('async');
var node_path = require('path');
var fs = require('graceful-fs');
var neuron = require('neuron.js');
var mix = require('mix2');
var jf = require('jsonfile');
var LRUCache = require('lru-cache');
var fse = require('fs-extra');


build.run = function (options, callback) {
  var logger = this.logger;
  logger.info('');

  if (!options.name.length) {
    logger.warn('nothing to build.');
    return callback(null);
  }

  if (options.name.length > 3) {
    logger.info('{{cyan build}} ' + options.name.slice(0, 3).join(', ') + ', and ' + (options.name.length - 3) + ' more ...');
  } else {
    logger.info('{{cyan build}} ' + options.name.join(', ') + ' ...');
  }

  if (options['check-mtime']) {
    logger.info('{{cyan check}} the mtime of each package.');
    this.check_mtime(options);
  }

  var self = this;
  async.parallel([
    function (done) {
      self.build_packages(options, done);
    },

    function (done) {
      self.build_neuron(options, done);
    },

    function (done) {
      self.save_mtime(options, done);
    }

  ], callback);
};


build.turn_on_content_check = function () {
  this.check_content = true;

  if (!this.lc) {
    this.lc = new LRUCache({
      max: 1000
    });
  }
};


build.write = function (file, content, callback) {
  var self = this;

  if (!this.check_content) {
    return fse.outputFile(file, content, function (err) {
      if (err) {
        return callback(err);
      }

      self.emit('write', file);
      callback(null);
    });
  }

  var lc = this.lc;
  var cached = lc.get(file);
  if (cached && cached === content) {
    self.emit('skip', file);
    return callback(null);
  }

  fse.outputFile(file, content, function (err) {
    if (err) {
      return callback(err);
    }

    lc.set(file, content);
    self.emit('write', file);
    callback(null);
  });
};


build.check_mtime = function (options) {
  var logger = this.logger;
  options.name = options.name
    .map(function (name) {
      var mtime = options.mtime[name];
      var cached = options.mtime_cache[name];

      if (mtime === cached) {
        logger.info('  - ' + name + ': {{yellow skipped}}, cached.');
        return;
      }

      return name;
    })
    .filter(Boolean);
};


build.save_mtime = function (options, callback) {
  if (!options['check-mtime']) {
    return callback(null);
  }

  mix(options.mtime_cache, options.mtime);
  jf.writeFile(options.mtime_cache_file, options.mtime_cache, callback);
};


build.build_packages = function (options, callback) {
  var root = options.src;
  var dest = options.dist;
  var logger = this.logger;
  var write = this.write.bind(this);

  async.each(options.name, function (name, done) {
    var from = node_path.join(root, name);
    var to = node_path.join(dest, name);

    neuron_build(from, to, function (err) {
      if (err && err.code === 'NEURON_NO_ENTRY') {
        logger.info('  - ' + name + ': {{yellow skipped}}, due to empty package.');
        return done(null);
      }

      if (!err) {
        logger.info('  - ' + name + ': {{green success!}}');
        return done(null);
      }

      logger.info('  - ' + name + ': {{red failed}}:\n');
      done(err);
    }, write);

  }, callback);
};


build.build_neuron = function (options, callback) {
  var neuron_dest = node_path.join(options.dist, 'neuron.js');
  fs.exists(neuron_dest, function (exists) {
    if (exists) {
      return callback(null);
    }

    neuron.write(neuron_dest, callback);
  });
};
