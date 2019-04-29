const is = require('@magic/types')
const deep = require('@magic/deep')
const { getDependencies } = require('../../../lib')

const mapLibToGlobal = libs => {
  global.LIB = global.LIB || {}

  return deep.flatten(
    Object.entries(libs).map(lib => {
      if (!is.array(lib)) {
        return mapLibToGlobal(lib)
      }

      const [name, fd] = lib
      if (is.string(name) && is.string(fd)) {
        try {
          const lib = require(fd)
          global.LIB[name] = lib
          return deep.flatten(getDependencies(lib, global.keys))
        } catch (e) {
          throw new Error(`LIB.[name] with fd = ${fd} can not be found`)
        }
      }
    }),
  )
}

module.exports = mapLibToGlobal
