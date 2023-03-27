#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
argv.dev ? require('..')(argv) : require('../dist/bundle')(argv)
