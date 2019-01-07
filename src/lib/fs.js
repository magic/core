const fso = require('fs')
const util = require('util')

const rmdir = util.promisify(fso.rmdir)

const fs = {
  exists: util.promisify(fso.exists),
  mkdir: util.promisify(fso.mkdir),
  readdir: util.promisify(fso.readdir),
  readFile: util.promisify(fso.readFile),
  stat: util.promisify(fso.stat),
  writeFile: util.promisify(fso.writeFile),
  createReadStream: fso.createReadStream,
  createWriteStream: fso.createWriteStream,
  rmDir: rmdir,
  rmdir,
  unlink: util.promisify(fso.unlink),
  existsSync: fso.existsSync,
}

module.exports = fs
