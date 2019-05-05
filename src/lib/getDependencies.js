const is = require('@magic/types')

const isUpperCase = require('./isUpperCase')
const getUsedComponents = require('./getUsedComponents')

const getDependencies = (props, parent) => {
  if (!is.string(props) && is.fn(props.toString)) {
    props = props.toString()
  }

  const usedComponents = getUsedComponents(props)
    // filter out the parent if it has the same name.
    // prevents endless recursion
    .filter(c => c !== parent)

  const components = usedComponents.map(name => {
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
      getDependencies(component.toString(), name).forEach(dep => {
        Object.entries(dep).forEach(([name, comp]) => {
          deps[name] = comp
        })
      })

      return {
        ...deps,
        [name]: component,
      }
    }

    if (is.array(component)) {
      throw new Error(`getDependencies got array ${name}`)
    }

    let entries = {}
    const views = Object.entries(component).filter(([k]) => isUpperCase(k))

    views.forEach(([k, v]) => {
      if (global[k]) {
        entries[k] = getDependencies(v.toString())
      } else {
        const dependencies = getDependencies(v.toString())
        dependencies.forEach(dep => {
          Object.entries(dep).forEach(([kk, vv]) => {
            entries[kk] = vv
          })
        })
      }
    })

    return { [name]: component, ...entries }
  })

  return components
}

module.exports = getDependencies
