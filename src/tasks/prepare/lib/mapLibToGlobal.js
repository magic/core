const deep = require('@magic/deep')
const { getDependencies, fs } = require('../../../lib')

const requireLib = ([name, fd]) => {
  try {
    return [name, require(fd), getDependencies(fs.readFileSync(fd))]
  } catch (e) {
    throw new Error(`LIB.[name] with fd = ${fd} can not be found`)
  }
}

const mapLibToGlobal = libs => {
  const lib = {}

  let dependencies = {}
  Object.entries(libs).forEach(l => {
    const [name, val, deps] = requireLib(l)
    dependencies = deep.merge(deps, dependencies)

    lib[name] = val
  })

  return {
    dependencies,
    lib,
  }
}

module.exports = mapLibToGlobal
