const is = require('@magic/types')

const isUpperCase = require('./isUpperCase')
const isTagUsed = require('./isTagUsed')

const getUsedComponents = str => Array.from(global.keys).filter(isTagUsed(str))

const getComponentDependencies = str => {
  const components = getUsedComponents(str).map(name => {
    const component = global[name]
    if (is.fn(component)) {
      // this component is a standard html tag
      if (global.tags.body[name]) {
        return {
          [name]: component,
        }
      }

      // get all sub dependencies
      const deps = {}
      getComponentDependencies(component.toString()).forEach(dep => {
        Object.entries(dep).forEach(([name, comp]) => {
          deps[name] = comp
        })
      })

      return {
        ...deps,
        [name]: component,
      }
    } else if (is.array(component)) {
      throw new Error(`getComponentDependencies got array ${name}`)
    } else if (is.object(component)) {
      let entries = {}
      Object.entries(component)
        .filter(([k]) => isUpperCase(k))
        .map(([k, v]) => {
          if (global[k]) {
            entries[k] = getComponentDependencies(v.toString())
          } else {
            getComponentDependencies(v.toString()).forEach(dep => {
              Object.entries(dep).forEach(([k, v]) => {
                entries[k] = v
              })
            })
          }
        })

      return { [name]: component, ...entries }
    } else {
      throw new Error(`unknown component type: ${typeof component}`)
    }
  })

  return components
}

const getDependencies = props => {
  const deps = {}
  getComponentDependencies(props).forEach(o => {
    Object.entries(o).forEach(([k, v]) => {
      deps[k] = v
    })
  })

  return deps
}

module.exports = getDependencies
