const getComponentDependencies = require('./getComponentDependencies')

const getDependencies = (props, keys) => {
  const deps = {}
  getComponentDependencies(props, keys).forEach(o => {
    Object.entries(o).forEach(([k, v]) => {
      deps[k] = v
    })
  })

  return deps
}

module.exports = getDependencies
