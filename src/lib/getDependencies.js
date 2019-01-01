const deep = require('@magic/deep')
const { prepare } = require('../tasks/')
const is = require('@magic/types')

const isUpperCase = require('./isUpperCase')
const isTagUsed = require('./isTagUsed')

const getUsedComponents = str => Array.from(global.keys).filter(isTagUsed(str))

const getComponentDependencies = str =>
  getUsedComponents(str).map(name => {
    const component = global[name]
    if (is.fn(component)) {
      if (global.tags.body[name]) {
        return {
          [name]: component,
        }
      }

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

const flattenDeps = deps => {
  const dependencies = {}
  deps = deep.flatten(deps).map(f => {
    Object.entries(f).forEach(([k, f]) => {
      dependencies[k] = f
    })
  })

  return dependencies
}

const getPageDependencies = page => ({
  ...page,
  dependencies: getComponentDependencies(page.Body.toString()),
})

const getDependencies = ({ pages, app }) => {
  pages = pages.map(getPageDependencies)

  app.dependencies = getComponentDependencies(app.Body.toString())

  const dependencies = flattenDeps([...pages.map(p => p.dependencies), app.dependencies])

  return { pages, app, dependencies }
}

module.exports = getDependencies
