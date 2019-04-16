const is = require('@magic/types')
const getComponentDependencies = require('./getComponentDependencies')

const getDependencies = (props, keys) => {
  if (!is.string(props) && is.fn(props.toString)) {
    props = props.toString()
  }
  const deps = {}
  getComponentDependencies(props, keys).forEach(o => {
    Object.entries(o).forEach(([k, v]) => {
      deps[k] = v
    })
  })

  return deps
}

module.exports = getDependencies
