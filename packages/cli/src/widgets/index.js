const { getAllFiles } = require('../lib/util')
const path = require('path')
const modules = {}
getAllFiles(__dirname, null, '.js', {}).forEach(({ path: modulePath }) => {
  modules[path.parse(modulePath).name.toLowerCase()] = modulePath
})
module.exports = modules;
