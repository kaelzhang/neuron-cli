'use strict';

var node_path = require('path');
var paths = require('../paths');
var jf = require('jsonfile');
var async = require('async');
var fs = require('fs');
var unique = require('array-unique');


exports.shorthands = {
  c: 'cwd'
};

exports.options = {
  cwd: paths.cwd_property,

  name: {
    info: 'specify the package to build',
    set: function (name) {
      // neuron build --name a,b
      // {name: ['a', 'b']}
      if (name) {
        name = name.split(',')
          .map(function(n){
            return n.trim();
          })
          .filter(Boolean);
        name = unique(name);

      // neuron build a b
      } else {
        name = unique(this.get('_'));
      }

      if (name.length) {
        return name;
      }

      var cwd = this.get('cwd');
      var root = this.get('src');
      var done = this.async();

      // neuron build
      paths.get_names_from_path(cwd, root, done);
    }
  },

  'check-mtime': {
    type: Boolean,
    info: 'check mtime of package folder, if the mtime is in the cache, it will skip buiding.',
    set: function (check) {
      var done = this.async();

      function cb (err) {
        if (err) {
          return done(err);
        }

        return done(null, check);
      }

      if (!check) {
        return cb();
      }

      var config = this.get('config');
      var mtime_cache = node_path.join(config.dist, '.mtime-cache');
      this.set('mtime_cache_file', mtime_cache);

      var self = this;
      async.parallel([
        function (done) {
          jf.readFile(mtime_cache, function (err, json) {
            self.set('mtime_cache', err ? {} : json);
            return done(null);
          });
        },

        function (done) {
          var names = self.get('name');
          async.map(names, function (name, done) {
            var pkg_dir = node_path.join(config.src, name);
            fs.stat(pkg_dir, function (err, stat) {
              if (err) {
                return done(err);
              }

              done(null, stat.mtime);
            });

          }, function (err, mtimes) {
            if (err) {
              return done(err);
            }

            var mtime = {};
            names.forEach(function (name, i) {
              mtime[name] = + mtimes[i];
            });
            self.set('mtime', mtime);

            done(null);
          });
        }
      ], cb);
    }
  }
};


exports.info = 'Build a package.';

exports.usage = [
  '{{name}} build [options]',
  '{{name}} build <name>[,<name>] [options]'
];
