const deep = require('@magic/deep')
const { prepare } = require('../tasks/')
const is = require('@magic/types')

const isUpperCase = require('./isUpperCase')
const isTagUsed = require('./isTagUsed')

const { tags } = require('../modules/')

const getStringDependencies = str => {
  if (is.fn(str)) {
    str = str.toString()
  } else if (is.obj(str)) {
    return getPageDependencies(str)
  }

  const deps = new Set()
  
  Array.from(global.keys)
    .filter(isTagUsed(str))
    .forEach(key => {
      if (isUpperCase(key)) {
        const keys = getStringDependencies(global[key])
          .forEach(k => deps.add(k))
        deps.add(key)
      } 

      if (global.tags.body[key]) {
        deps.add(key)
      }
    })

  return Array.from(deps)
}

const getPageDependencies = (o) => {
  const dependencies = Object.keys(o)
    .filter(isUpperCase)
    .map(k => {
      const view = o[k]
      return getStringDependencies(view)
    })
    .filter(a => a && a.length)
  
  return {
    ...o,
    dependencies: deep.flatten(dependencies),
  }
}

const getDependencies = ({ pages, app }) => {
  pages = pages.map(getPageDependencies)
  app = getPageDependencies(app)
  
  const dependencies = Array.from(new Set(deep.flatten([
    ...pages.map(p => p.dependencies), 
    ...app.dependencies,
  ])))

  return { pages, app, dependencies }
}

module.exports = getDependencies
