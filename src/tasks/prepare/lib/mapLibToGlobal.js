const is = require('@magic/types')

const mapLibToGlobal = libs => {
  global.LIB = global.LIB || {}

  Object.entries(libs).forEach(lib => {
    if (!is.array(lib)) {
      return mapLibToGlobal(lib)
    }

    const [name, fd] = lib
    if (is.string(name) && is.string(fd)) {
      try {
        global.LIB[name] = require(fd)
      } catch(e) {
        throw new Error(`LIB.[name] with fd = ${fd} can not be found`)
      }
    }
  })
}

module.exports = mapLibToGlobal