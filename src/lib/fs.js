const fso = require('fs')
const util = require('util')

const rmdir = util.promisify(fso.rmdir)

const readDir = util.promisify(fso.readdir)
const readFile = util.promisify(fso.readFile)

const fs = {
  createReadStream: fso.createReadStream,
  createWriteStream: fso.createWriteStream,
  exists: util.promisify(fso.exists),
  existsSync: fso.existsSync,
  mkdir: util.promisify(fso.mkdir),
  readdir: readDir,
  readDir,
  readFile,
  readfile: readFile,
  rmdir,
  rmDir: rmdir,
  stat: util.promisify(fso.stat),
  unlink: util.promisify(fso.unlink),
  watch: fso.watch,
  writeFile: util.promisify(fso.writeFile),
  readFileSync: fso.readFileSync,
}

module.exports = fs
