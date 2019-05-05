const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')

const adminModules = require('../../modules/admin/modules')
const { getDependencies, fs } = require('../../lib')
const { mapDepsToObject, mapLibToGlobal } = require('./lib')

const prepareDependencies = async app => {
  let dependencies = getDependencies(app.Body)

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (await fs.exists(maybeAssetFile)) {
    const assets = require(maybeAssetFile)
    dependencies = deep.merge(dependencies, assets)
  }

  if (config.ENV === 'development') {
    dependencies = deep.merge(dependencies, adminModules)
  }

  app.pages.forEach(page => {
    const pageString = is.function(page) ? page.toString() : page.View.toString()
    // make sure dependencies contains all recursive dependencies
    let pageDependencies = getDependencies(pageString)

    dependencies = deep.merge(dependencies, pageDependencies)
  })

  let lib = app.lib || {}
  app.pages
    .filter(page => !is.empty(page.lib))
    .map(page => {
      lib = deep.merge(page.lib, lib)
    })

  dependencies.forEach(dependency => {
    Object.entries(dependency)
      .filter(([_, component]) => !is.empty(component.lib))
      .forEach(([name, component]) => {
        Object.entries(component.lib).forEach(([key, mod]) => {
          lib[key] = mod
        })
      })
  })

  if (!is.empty(lib)) {
    const mapped = mapLibToGlobal(lib)
    dependencies = deep.merge(mapped.dependencies, dependencies)
    Object.entries(mapped.lib).forEach(([name, mod]) => {
      global.LIB[name] = mod
    })
  }

  const deps = mapDepsToObject(dependencies)

  return {
    modules: deps,
    lib,
  }
}

module.exports = prepareDependencies
