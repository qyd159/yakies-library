#!/usr/bin/env ts-node
const argv = require('minimist')(process.argv.slice(2))
argv.dev ? require('../src/index.ts')(argv) : require('../dist/bundle')(argv)
