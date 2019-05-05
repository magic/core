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
    // console.log({ pageDependencies })

    dependencies = deep.merge(dependencies, pageDependencies)
  })

  let lib = {}
  app.pages
    .filter(page => !is.empty(page.lib))
    .map(page => {
      lib = deep.merge(page.lib, app.lib)
    })

  dependencies
    .forEach(dependency => {
      Object.entries(dependency)
        .filter(([_, component]) => !is.empty(component.lib))
        .forEach(([name, component]) => {
          lib = deep.merge(component.lib, app.lib)
        })
    })

  if (!is.empty(lib)) {
    const mapped  = mapLibToGlobal(lib)
    dependencies = deep.merge(mapped.dependencies, dependencies)
    Object.entries(mapped.lib).forEach(([name, lib]) => {
      global.LIB[name] = lib
    })
  }

  const deps = mapDepsToObject(dependencies)

  // console.log({ deps })

  return {
    modules: deps,
    lib,
  }
}

module.exports = prepareDependencies
