import path from 'path'

import deep from '@magic/deep'
import error from '@magic/error'
import is from '@magic/types'

import { getThemeLocations, saveImport } from '../../../lib/index.mjs'

/** @import { ConfigDir, NodeError } from '../../../types.mjs' */

/**
 * @param {Record<string, unknown>} modules
 * @param {{ DIR: ConfigDir, NODE_MODULES: string, THEME?: string | string[] }} config
 * @returns {Promise<Record<string, unknown> | undefined>}
 */
export const findThemes = async (modules, { DIR, NODE_MODULES, THEME }) => {
  if (THEME) {
    if (is.string(THEME)) {
      THEME = [THEME]
    }

    const url = new URL(import.meta.url)
    const dirName = path.dirname(url.pathname)

    const results = await Promise.all(
      THEME.map(async themeName => {
        // order is meaningful.
        const themeLocations = getThemeLocations({ dirName, themeName, DIR, NODE_MODULES })

        const mods = await Promise.all(
          themeLocations.map(async location => {
            const imported = await saveImport(location)

            if (imported instanceof Error) {
              const eCode = /** @type {NodeError} */ (imported).code
              if (!eCode || !eCode.includes('MODULE_NOT_FOUND')) {
                throw error(imported)
              }
              return {}
            }

            const { default: _theme, ...maybeModules } = imported

            /** @type {unknown} */
            let existing
            const results = Object.entries(maybeModules).map(([name, fn]) => {
              if (is.case.upper(name[0])) {
                existing = modules[name]
                if (is.fn(fn)) {
                  if (!existing) {
                    return [name, fn]
                  } else if (is.objectNative(existing) && existing.View) {
                    return [
                      name,
                      {
                        ...existing,
                        View: fn,
                      },
                    ]
                  } else {
                    return [name, fn]
                  }
                } else if (is.object(fn)) {
                  if (!existing) {
                    return [name, fn]
                  } else if (is.fn(existing)) {
                    return [name, { View: existing, ...fn }]
                  } else if (is.objectNative(existing)) {
                    return [
                      name,
                      {
                        ...existing,
                        ...fn,
                      },
                    ]
                  } else {
                    return [name, fn]
                  }
                }
              }
            })

            return Object.fromEntries(results.filter(a => a !== undefined))
          }),
        )

        return mods.filter(a => a !== undefined)
      }),
    )

    /** @type {Record<string, unknown>} */
    let mods = {}

    // by writing the results after awaiting them above,
    // we force correct order of merges.
    // Promise.all does not wait internally for sequential execution,
    // but await Promise.all returns ordered results.
    deep.flatten(results).map(result => {
      if (!is.empty(result) && is.objectNative(result)) {
        mods = deep.merge(mods, result)
      }
    })

    return mods
  }
}
