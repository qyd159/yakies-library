#!/usr/bin/env
const argv = require('minimist')(process.argv.slice(2))
require('../dist/bundle')(argv)
