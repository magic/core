const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')

const isDirectory = source => fs.statSync(source).isDirectory()

const getDirectories = source =>
  fs.readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)

const getDirectoriesRecursive = source => [
  source,
  ...getDirectories(source)
    .map(getDirectoriesRecursive)
    .reduce((a, b) => a.concat(b), [])
]

module.exports = getDirectoriesRecursive
