import swc from '@swc/core'

import is from '@magic/types'

import { stringifyObject, isModuleName, uniqueMerge } from '../../lib/index.mjs'
import { resolveDependencies } from '../../lib/swc/resolveDependencies.mjs'

import { moduleViewToString } from './moduleViewToString.mjs'
import { mergeSubModules } from './mergeSubModules.mjs'

export const recursivelyResolveDependencies = async ({ app, config }) => {
  let totalUsed = {
    modules: [],
    lib: [],
    actions: [],
    effects: [],
    subscriptions: [],
    helpers: [],
    pages: {},
    dependencies: {},
    resolved: [],
  }

  const moduleDependencies = {}
  const modulePages = {}

  {
    const rootCode = app.View.toString()

    const hoistedString = `\nconst hoisted = ${app.hoisted}`

    const ast = await swc.parse(rootCode + hoistedString)
    const usedInRoot = resolveDependencies({ parent: ast, app })
    totalUsed = uniqueMerge(usedInRoot, totalUsed)
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
      const subViews = []

      if (is.objectNative(module)) {
        const modSubViews = Object.entries(module)
          .filter(([name]) => isModuleName(name))
          .map(([_name, subModule]) => {
            if (is.function(subModule)) {
              return subModule.toString()
            } else if (is.function(subModule.View)) {
              return subModule.View.toString()
            }
          })

        subViews.push(...modSubViews)
      }

      const ast = await swc.parse(view)
      let usedInModule = resolveDependencies({ parent: ast, app })

      await Promise.all(
        subViews.map(async view => {
          const ast = await swc.parse(view)
          const usedInSubModule = resolveDependencies({ parent: ast, app })
          usedInModule = uniqueMerge(usedInSubModule, usedInModule)
        }),
      )

      moduleDependencies[name] = usedInModule
      totalUsed = uniqueMerge(usedInModule, totalUsed)
    }),
  )

  await Promise.all(
    app.pages.map(async page => {
      const pageView = page.View.toString()
      const ast = await swc.parse(pageView)
      let usedInPage = resolveDependencies({ parent: ast, app })

      usedInPage.modules.forEach(moduleName =>
        mergeSubModules({
          used: usedInPage,
          name: moduleName,
          dependencies: moduleDependencies[moduleName],
        }),
      )

      totalUsed.pages[page.name] = usedInPage
      totalUsed = uniqueMerge(usedInPage, totalUsed)

      usedInPage.modules.forEach(moduleName => {
        modulePages[moduleName] = modulePages[moduleName] || []
        modulePages[moduleName].push(page.name)
      })
    }),
  )

  totalUsed.modulesByPage = modulePages

  totalUsed.singlePageModules = Object.entries(modulePages).filter(
    ([name, pages]) => pages.length === 1,
  )

  return totalUsed
}
