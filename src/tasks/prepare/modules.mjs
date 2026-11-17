import deep from '@magic/deep'
import log from '@magic/log'
import is from '@magic/types'

/** @import { AppObject, Config, ModuleDecl, Subscription } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @returns {(entry: [string, ModuleDecl]) => void}
 */
export const prepareModule =
  app =>
  ([name, component]) => {
    const lowerName = name.toLowerCase()

    /** @type {Record<string, unknown>} */
    const glob = /** @type {Record<string, unknown>} */ (
      component.global || component.globals || {}
    )

    /** @type {Record<string, unknown>} */
    const tempState = {}

    if (!is.empty(component.state) && is.objectNative(component.state)) {
      const globState = /** @type {Record<string, unknown> | undefined} */ (glob.state)
      Object.entries(component.state).forEach(([key, val]) => {
        if (globState && globState[key] === true) {
          tempState[key] = val
        } else {
          const subState = /** @type {Record<string, unknown>} */ (tempState[lowerName] ?? {})
          tempState[lowerName] = subState
          subState[key] = val
        }
      })
    }

    app.state = {
      ...tempState,
      ...app.state,
    }

    const actionTypes = ['actions', 'effects']

    actionTypes
      // if component has no actions or effects, do nothing
      .filter(type => !is.empty(component[type]))
      .forEach(type => {
        const typeObj = component[type]
        if (!is.objectNative(typeObj)) {
          return
        }

        const globType = /** @type {Record<string, unknown> | undefined} */ (glob[type])
        Object.entries(typeObj).forEach(([key, val]) => {
          const appType = /** @type {Record<string, unknown>} */ (app[type])
          if (globType && globType[key] === true) {
            appType[key] = val
          } else {
            const subType = /** @type {Record<string, unknown>} */ (appType[lowerName] ?? {})
            appType[lowerName] = subType
            if (lowerName === key) {
              appType[lowerName] = val
            } else {
              subType[key] = val
            }
          }
        })
      })

    if (!is.empty(component.helpers)) {
      log.warn(
        'E_HELPERS_DEPRECATED',
        `module: ${name}`,
        'using app.helpers is deprecated, use actions, effects or lib instead.',
      )

      app.helpers = /** @type {Record<string, unknown>} */ (
        deep.merge(app.helpers, component.helpers)
      )
    }

    if (!is.empty(component.subscriptions) && is.array(component.subscriptions)) {
      component.subscriptions.forEach(sub => {
        if (is.array(app.subscriptions)) {
          app.subscriptions.push(/** @type {Subscription} */ (sub))
        }
      })
    }

    if (!is.empty(component.cookies)) {
      app.cookies = /** @type {Record<string, unknown>} */ (
        deep.merge(app.cookies, component.cookies)
      )
    }

    if (!is.empty(component.init)) {
      app.init = deep.merge(app.init, component.init)
    }
  }

/**
 * @param {AppObject} app
 * @returns {void}
 */
export const prepareModules = app => {
  // merge component states into app.state[componentName].
  // this makes all identical components share their state.
  Object.entries(app.modules ?? {})
    .filter(([name]) => is.case.upper(name[0]))
    .forEach(entry => prepareModule(app)(/** @type {[string, ModuleDecl]} */ (entry)))
}
