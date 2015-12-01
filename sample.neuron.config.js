'use strict';

var jade_compiler = require('neuron-jade-compiler');
var stylus_compiler = require('neuron-stylus-compiler');

var config = module.exports = {
  src: 'static_modules',
  dist: '.static_modules',
  release: 'public/mod'
}


// neuron builder
config.compilers = [
  {
    test: /\.jade$/,
    extname: '.js',
    compiler: jade_compiler

  }, {
    test: /\.styl$/,
    extname: '.css',
    compiler: stylus_compiler
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
