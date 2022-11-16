import swc from '@swc/core'

import is from '@magic/types'

import { stringifyObject, isModuleName, uniqueMerge } from '../../lib/index.mjs'
import { resolveDependencies } from '../../lib/swc/resolveDependencies.mjs'

import { moduleViewToString } from './moduleViewToString.mjs'

export const recursivelyResolveDependencies = async ({ app, config }) => {
  let totalUsed = {
    modules: [],
    lib: [],
    actions: [],
    effects: [],
    subscriptions: [],
    pages: {},
    cssid: [],
    cssclass: [],
  }

  const moduleDependencies = {}
  const modulesByPage = {}

  {
    const rootCode = app.View.toString()

    const ast = await swc.parse(rootCode)
    const usedInRoot = resolveDependencies({ parent: ast, app })
    totalUsed = uniqueMerge(usedInRoot, totalUsed)
  }

  if (app.hoisted) {
    const hoistedString = `const hoisted = ${app.hoisted}`

    const ast = await swc.parse(hoistedString)
    const usedInHoisted = resolveDependencies({ parent: ast, app })
    totalUsed = uniqueMerge(usedInHoisted, totalUsed)
  }

  {
    const { Page } = app.modules
    const pageCode = Page.View.toString()
    const pageAst = await swc.parse(pageCode)
    const usedInPage = resolveDependencies({ parent: pageAst, app })
    totalUsed = uniqueMerge(usedInPage, totalUsed)
  }

  {
    const actionString = `const actions = ${stringifyObject(app.actions)}`
    const effectString = `const effects = ${stringifyObject(app.effects)}`
    const subString = `const subscriptions = [${app.subscriptions}]`
    const libString = `const lib = ${stringifyObject(app.lib)}`

    const totalString = [actionString, effectString, subString, libString].join('\n')
    const ast = await swc.parse(totalString)
    const usedInFunctions = resolveDependencies({ parent: ast, app })

    totalUsed = uniqueMerge(usedInFunctions, totalUsed)
  }

  await Promise.all(
    Object.entries(app.modules).map(async ([name, module]) => {
      const view = moduleViewToString(module)

      /*
       * Modules may export multiple Views,
       * all exports with UpperCamelCase namestyle will be considered Views.
       */
      const subViews = []

      if (is.objectNative(module)) {
        const modSubViews = Object.entries(module)
          .filter(([name]) => isModuleName(name) && name !== 'View')
          .map(([name, subModule]) => {
            if (is.function(subModule)) {
              return [name, subModule.toString()]
            } else if (is.function(subModule.View)) {
              return [name, subModule.View.toString()]
            }
          })

        subViews.push(...modSubViews)
      }

      const ast = await swc.parse(view)
      const usedInModule = resolveDependencies({ parent: ast, app })

      await Promise.all(
        subViews.map(async ([subName, view]) => {
          const ast = await swc.parse(view)
          const usedInSubModule = resolveDependencies({ parent: ast, app })
          moduleDependencies[`${name}.${subName}`] = usedInSubModule
        }),
      )

      moduleDependencies[name] = usedInModule
    }),
  )

  const recursivelyResolve = ([name, deps]) => {
    if (!isModuleName(name)) {
      return []
    }

    let dependencies = { ...deps }

    deps.modules.filter(subName => subName !== name).forEach(subName => {
      const [_, subDeps] = recursivelyResolve([subName, moduleDependencies[subName]])

      dependencies = uniqueMerge(subDeps, dependencies)
    })

    return [name, dependencies]
  }

  const fullDepEntries = Object.entries(moduleDependencies).map(recursivelyResolve).filter(([_, a]) => a)
  const fullDepObject = Object.fromEntries(fullDepEntries)

  await Promise.all(
    app.pages.map(async page => {
      const pageView = page.View.toString()
      const ast = await swc.parse(pageView)

      let usedInPage = resolveDependencies({ parent: ast, app })
      let modules = [...usedInPage.modules]

      modules.map(name => {
        const subDeps = fullDepObject[name]
        if (subDeps) {
          // console.log('add subDeps', page.name, name, subDeps)
          usedInPage = uniqueMerge(subDeps, usedInPage)
        }
      })

      totalUsed.pages[page.name] = usedInPage

      usedInPage.modules.forEach(name => {
        modulesByPage[name] = modulesByPage[name] || []
        modulesByPage[name].push(page.name)
      })
    }),
  )

  Object.entries(modulesByPage).filter(([_, pages]) => pages.length === 1).map(([name, pages]) => {
    const pageName = pages[0]
    const deps = totalUsed.pages[pageName].exclusiveDependencies || []
    if (isModuleName(name)) {
      deps.push(name)
    }

    totalUsed.pages[pageName].exclusiveDependencies = deps
  })

  return totalUsed
}
