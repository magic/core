const { getDependencies, fs } = require('../../../lib')

const requireLib = ([name, fd]) => {
  try {
    return [name, require(fd), getDependencies(fs.readFileSync(fd), global.keys)]
  } catch (e) {
    throw new Error(`LIB.[name] with fd = ${fd} can not be found`)
  }
}

const mapLibToGlobal = libs => {
  global.LIB = global.LIB || {}

  let dependencies = {}
  Object.entries(libs).forEach(lib => {
    const [name, val, deps] = requireLib(lib)
    deps.forEach(dep => {
      Object.entries(dep).forEach(([name, val]) => {
        dependencies[name] = val
      })
    })

    global.LIB[name] = val
  })

  return dependencies
}

module.exports = mapLibToGlobal
