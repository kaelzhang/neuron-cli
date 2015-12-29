'use strict';

var jade_compiler = require('neuron-jade-compiler');
var stylus_compiler = require('neuron-stylus-compiler');

var config = module.exports = {
  src: 'static_modules',
  dist: '.static_modules'
}


// Default compilers
config.compilers = [
  {
    test: /\.jade$/,
    compiler: jade_compiler

  }, {
    test: /\.styl$/,
    compiler: stylus_compiler
  }
];


config.workspaces = [
  // workspaces extends config
  {
    src:
    dist:
    release:
    compilers:
  }
];


// neuron server
config.server = {
  patch: 'neuron.js',
  routers: [
    {
      default: true,
      location: '/mod',
      root: '.static_modules/'
    }
  ],
  by_pass: 'http://www.xiaohongshu.com'
};
