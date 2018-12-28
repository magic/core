const deep = require('@magic/deep')

const isUpperCase = require('./isUpperCase')

const getDependencies = (pages, app) => {
  const allDeps = [...app.dependencies, pages.map(page => page.dependencies)]

  const dependencies = {}
  deep.flatten(allDeps).forEach(key => {
    dependencies[key] = dependencies[key] ? dependencies[key] + 1 : 1
  })

  const components = []
  const tags = []
  Object.keys(dependencies).forEach(dep => {
    if (isUpperCase(dep)) {
      components.push(dep)
    } else {
      tags.push(dep)
    }
  })

  return {
    dependencies,
    components,
    tags,
  }
}

module.exports = getDependencies
