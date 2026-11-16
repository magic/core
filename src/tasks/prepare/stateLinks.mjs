import is from '@magic/types'

import { handleLink } from '../../lib/index.mjs'

/** @import { AppObject } from '../../types.mjs' */

/**
 * @param {{ state: Record<string, unknown>, parent?: Record<string, unknown>, WEB_ROOT: string | undefined, app?: AppObject }} params
 * @returns {Record<string, unknown>}
 */
const traverseLinks = ({ state, parent, WEB_ROOT, ...args }) => {
  if (state.to && parent && is.string(state.to)) {
    state.to = handleLink({ href: state.to, parent, WEB_ROOT, ...args })

    if (is.array(state.items)) {
      state.items = state.items.map(item =>
        traverseLinks({
          state: /** @type {Record<string, unknown>} */ (item),
          parent: state,
          WEB_ROOT,
          ...args,
        }),
      )
    }

    return state
  }

  const result = Object.entries(state).map(([key, value]) => {
    if (is.array(value)) {
      value = value.map(val => {
        if (is.string(val)) {
          return val
        }

        const traversed = traverseLinks({
          state: /** @type {Record<string, unknown>} */ (val),
          parent: state,
          WEB_ROOT,
          ...args,
        })
        return traversed
      })
    } else if (is.objectNative(value)) {
      value = traverseLinks({ state: value, WEB_ROOT, ...args })
    }

    return [key, value]
  })

  return Object.fromEntries(result)
}

/**
 * @param {AppObject} app
 * @param {{ WEB_ROOT?: string }} config
 * @returns {Record<string, unknown>}
 */
export const prepareStateLinks = (app, { WEB_ROOT }) => {
  if (!app.state) {
    return {}
  }

  const { logo, seo } = app.state
  if (!is.empty(logo) && is.string(logo)) {
    app.state.logo = handleLink({ href: logo, app, WEB_ROOT })
  }

  if (is.objectNative(seo) && !is.empty(seo.image) && is.string(seo.image)) {
    const seoState = /** @type {Record<string, unknown>} */ (app.state.seo)
    seoState.image = handleLink({ href: seo.image, app, WEB_ROOT })
    app.state.seo = seoState
  }

  return traverseLinks({ state: app.state, app, WEB_ROOT })
}
