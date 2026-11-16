import swc from '@swc/core'

import is from '@magic/types'

import { stringifyObject, isModuleName, uniqueMerge } from '../../lib/index.mjs'
import { resolveDependencies } from '../../lib/swc/resolveDependencies.mjs'

import { moduleViewToString } from './moduleViewToString.mjs'
import { mergeSubModules } from './mergeSubModules.mjs'

/** @import { AppObject, Config, ModuleView, SwcNode } from '../../types.mjs' */

/**
 * @param {{ app: AppObject, config: Config }} params
 * @returns {Promise<Record<string, unknown>>}
 */
export const recursivelyResolveDependencies = async ({ app, config: _config }) => {
  /** @type {Record<string, unknown>} */
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

  /** @type {Record<string, Record<string, unknown>>} */
  const moduleDependencies = {}
  /** @type {Record<string, string[]>} */
  const modulePages = {}

  /**
   * @param {Record<string, unknown>} a
   * @param {Record<string, unknown>} b
   * @returns {Record<string, unknown>}
   */
  const mergeUsed = (a, b) => {
    const merged = uniqueMerge(a, b)
    return merged ?? a
  }

  {
    const rootCode = app.View.toString()

    const hoistedString = `\nconst hoisted = ${app.hoisted}`

    const ast = await swc.parse(rootCode + hoistedString)
    const usedInRoot = resolveDependencies({ parent: /** @type {SwcNode} */ (ast), app })
    totalUsed = mergeUsed(/** @type {Record<string, unknown>} */ (usedInRoot), totalUsed)
  }

  {
    const Page = /** @type {{ View?: { toString(): string } } | undefined} */ (app.modules?.Page)
    if (Page && Page.View) {
      const pageCode = Page.View.toString()
      const pageAst = await swc.parse(pageCode)
      const usedInPage = resolveDependencies({
        parent: /** @type {SwcNode} */ (pageAst),
        app,
      })
      totalUsed = mergeUsed(/** @type {Record<string, unknown>} */ (usedInPage), totalUsed)
    }
  }

  {
    const actionString = `const actions = ${stringifyObject(app.actions)}`
    const effectString = `const effects = ${stringifyObject(app.effects)}`
    const subString = `const subscriptions = [${app.subscriptions}]`
    const libString = `const lib = ${stringifyObject(app.lib)}`

    const totalString = [actionString, effectString, subString, libString].join('\n')
    const ast = await swc.parse(totalString)
    const usedInFunctions = resolveDependencies({
      parent: /** @type {SwcNode} */ (ast),
      app,
    })
    totalUsed = mergeUsed(/** @type {Record<string, unknown>} */ (usedInFunctions), totalUsed)
  }

  await Promise.all(
    Object.entries(app.modules ?? {}).map(async ([name, module]) => {
      const viewString = /** @type {string} */ (moduleViewToString(module))
      /** @type {string[]} */
      const subViews = []

      if (is.objectNative(module)) {
        const modSubViews = Object.entries(module)
          .filter(([subName]) => isModuleName(subName))
          .map(([_name, subModule]) => {
            if (is.function(subModule)) {
              return subModule.toString()
            } else if (is.function(/** @type {{ View?: unknown }} */ (subModule)?.View)) {
              return /** @type {{ View: { toString(): string } }} */ (subModule).View.toString()
            }
          })

        subViews.push(...modSubViews.filter(v => is.string(v)))
      }

      const ast = await swc.parse(viewString)
      /** @type {Record<string, unknown>} */
      let usedInModule = /** @type {Record<string, unknown>} */ (
        resolveDependencies({ parent: /** @type {SwcNode} */ (ast), app })
      )
      await Promise.all(
        subViews.map(async subView => {
          const subAst = await swc.parse(subView)
          const usedInSubModule = resolveDependencies({
            parent: /** @type {SwcNode} */ (subAst),
            app,
          })
          usedInModule = mergeUsed(
            /** @type {Record<string, unknown>} */ (usedInSubModule),
            usedInModule,
          )
        }),
      )

      moduleDependencies[name] = usedInModule
      totalUsed = mergeUsed(usedInModule, totalUsed)
    }),
  )

  await Promise.all(
    (app.pages ?? []).map(async page => {
      const pageView = /** @type {ModuleView} */ (page.View).toString()
      const ast = await swc.parse(pageView)
      const usedInPage = /** @type {Record<string, unknown>} */ (
        resolveDependencies({ parent: /** @type {SwcNode} */ (ast), app })
      )

      const usedModules = /** @type {string[]} */ (usedInPage.modules)
      usedModules.forEach(moduleName =>
        mergeSubModules({
          used: usedInPage,
          name: moduleName,
          dependencies: moduleDependencies[moduleName],
        }),
      )

      const pagesMap = /** @type {Record<string, unknown>} */ (totalUsed.pages ?? {})
      pagesMap[String(page.name)] = usedInPage
      totalUsed.pages = pagesMap
      totalUsed = mergeUsed(usedInPage, totalUsed)

      usedModules.forEach(moduleName => {
        modulePages[moduleName] = modulePages[moduleName] || []
        if (is.string(page.name)) {
          modulePages[moduleName].push(page.name)
        }
      })
    }),
  )

  totalUsed.modulesByPage = modulePages

  totalUsed.singlePageModules = Object.entries(modulePages).filter(
    ([_name, pages]) => pages.length === 1,
  )

  return totalUsed
}
