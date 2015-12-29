[![Build Status](https://travis-ci.org/kaelzhang/neuron-cli.svg?branch=master)](https://travis-ci.org/kaelzhang/neuron-cli)

<!-- [![NPM version](https://badge.fury.io/js/neuron-cli.svg)](http://badge.fury.io/js/neuron-cli)
[![npm module downloads per month](http://img.shields.io/npm/dm/neuron-cli.svg)](https://www.npmjs.org/package/neuron-cli)
[![Dependency Status](https://david-dm.org/kaelzhang/neuron-cli.svg)](https://david-dm.org/kaelzhang/neuron-cli) -->

# neuron-cli

Command line tools for [neuron.js](https://www.npmjs.com/package/neuron.js).

Before reading this document, it is better to know [modules/1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1) and [packages/1.0](http://wiki.commonjs.org/wiki/Packages/1.0)

## Install

```sh
$ npm i -g neuron-cli
```

## Terminology

#### Module

A module is the minimun logic unit of javascript and each javascript file of commonjs or es6 module is a module

#### Package

A package could not only contain one or more modules, but also css files, templates, images and other resources.

## Project configurations

All configurations are located at `neuron.config.js` at the root of your project.

## Frequent Commands

### Helpers

```sh
$ neuron # see basic help

$ neuron build -h # see command help for `neuron build`, or you can use
$ neuron help build
```

### Available Commands

- `neuron build` build a package or packages.
- `neuron server` start a neuron develop server. By default, neuron server will observe the changes of the resource files, and run the building automatically.
- `neuron watch` watch a directory, and build when files change.

## License

MIT
