const is = require('@magic/types')
const deep = require('@magic/deep')

const mapDepsToObject = dependencies => {
  let deps = {}

  dependencies.forEach(dep => {
    Object.entries(dep).forEach(([key, val]) => {
      deps[key] = val
      if (!is.empty(val.dependencies)) {
        const depDeps = mapDepsToObject([val.dependencies])
        deps = deep.merge(deps, depDeps)
      }
    })
  })

  return deps
}

module.exports = mapDepsToObject