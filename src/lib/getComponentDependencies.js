const is = require('@magic/types')

const isUpperCase = require('./isUpperCase')
const getUsedComponents = require('./getUsedComponents')

const getComponentDependencies = (str, keys) => {
  const components = getUsedComponents(str, keys).map(name => {
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
      getComponentDependencies(component.toString(), keys).forEach(dep => {
        Object.entries(dep).forEach(([name, comp]) => {
          deps[name] = comp
        })
      })

      return {
        ...deps,
        [name]: component,
      }
    } else if (is.object(component)) {
      let entries = {}
      Object.entries(component)
        .filter(([k]) => isUpperCase(k))
        .map(([k, v]) => {
          if (global[k]) {
            entries[k] = getComponentDependencies(v.toString(), keys)
          } else {
            getComponentDependencies(v.toString(), keys).forEach(dep => {
              Object.entries(dep).forEach(([k, v]) => {
                entries[k] = v
              })
            })
          }
        })

      return { [name]: component, ...entries }
    } else if (is.array(component)) {
      throw new Error(`getComponentDependencies got array ${name}`)
    } else {
      throw new Error(`unknown component type: ${typeof component}`)
    }
  })

  return components
}

module.exports = getComponentDependencies
