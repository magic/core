import path from 'path'
import { fileURLToPath } from 'url'

import deep from '@magic/deep'
import error from '@magic/error'
import log from '@magic/log'
import is from '@magic/types'

import { findModuleStyles, saveImport } from '../../lib/index.mjs'
import colors from '../../themes/colors.mjs'

/** @import { AppObject, Config, ThemeVars, NodeError } from '../../types.mjs' */

const dirName = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<unknown[]>}
 */
export const prepareThemes = async (app, config) => {
  const { DIR, NODE_MODULES, ROOT } = config
  let { THEME = '', THEME_VARS = {} } = config

  const resetStyles = []
  /** @type {unknown[]} */
  const themeStyles = []
  /** @type {unknown[]} */
  const pageStyles = []
  /** @type {unknown[]} */
  const appStyles = []

  THEME_VARS.colors = {
    ...THEME_VARS.colors,
    ...colors,
  }

  if (is.string(THEME)) {
    THEME = [THEME]
  }

  // merge user created custom reset.css into styles, if it exists
  try {
    // merge default reset css into styles
    const importedReset = await saveImport('../themes/reset.css.mjs')
    const reset = importedReset instanceof Error ? undefined : importedReset.reset

    resetStyles.push(reset)

    const themePromises = THEME.map(async theme_name => {
      // find reset css in theme dir if it exists
      const maybeResetCssFile = path.join(DIR.THEMES, theme_name, 'reset.css.mjs')
      const importedThemeReset = await saveImport(maybeResetCssFile)
      const maybeResetCssStyles =
        importedThemeReset instanceof Error ? undefined : importedThemeReset.default
      if (maybeResetCssStyles) {
        resetStyles.push(maybeResetCssStyles)
      }
    })

    await Promise.all(themePromises)
  } catch (e) {
    // saveImport returns Errors instead of throwing, so this is
    // only reachable if the theme modules themselves throw.
    if (is.error(e)) {
      const eCode = /** @type {NodeError} */ (e).code
      if (!eCode || !eCode.includes('MODULE_NOT_FOUND')) {
        throw error(e)
      }
    }
  }

  // load user's chosen theme, if it is set and exists, and merge it into the styles
  if (THEME) {
    const result = await Promise.all(
      THEME.map(async theme_name => {
        // order is meaningful.
        const themeLocations = [
          // first look if we have this theme preinstalled in @magic, if so, merge it into the styles
          path.join(dirName, '..', '..', 'themes', theme_name, 'index.mjs'),
          // see if the theme is a full name of a js module in node_modules,
          // eg: @org/theme-name or theme-name
          theme_name,
          // see if this is a @magic-themes theme
          `@magic-themes/${theme_name}`,
          // see if it is installed locally.
          path.join(DIR.THEMES, theme_name, 'index.mjs'),
          // if called from globally installed magic, load with absolute path
          path.join(NODE_MODULES, '@magic-themes', theme_name, 'src', 'index.mjs'),
        ]

        return await Promise.all(
          themeLocations.map(async location => {
            try {
              const imported = await saveImport(location)
              const theme = imported instanceof Error ? undefined : imported.default
              const vars = imported instanceof Error ? undefined : imported.vars
              return {
                theme,
                vars,
              }
            } catch (e) {
              const nodeErr = /** @type {NodeError} */ (e)
              const inc =
                nodeErr.message?.endsWith('themes.mjs') || nodeErr.message?.endsWith('themes.js')
              if (!inc || !nodeErr.code || !nodeErr.code.includes('MODULE_NOT_FOUND')) {
                throw error(e instanceof Error ? e : new Error(String(e)))
              }
            }
          }),
        )
      }),
    )

    /** @type {Record<string, unknown>} */
    let themeVars = {}

    result
      .filter(a => a !== undefined)
      .forEach(list => {
        list
          .filter(a => a !== undefined && a !== null)
          .forEach(({ theme, vars }) => {
            if (!is.empty(vars) && is.objectNative(vars)) {
              themeVars = deep.merge(themeVars, vars)
            }
            if (!is.empty(theme)) {
              themeStyles.push(theme)
            }
          })
      })

    THEME_VARS = deep.merge(themeVars, THEME_VARS)
  }

  if (app.pages) {
    app.pages
      .filter(p => p.style)
      .forEach(page => {
        pageStyles.push(page.style)
      })
  }

  const maybeAppFileMjs = path.join(ROOT, 'app.mjs')
  const maybeAppFileJs = path.join(ROOT, 'app.js')
  const fileName = new URL(import.meta.url).pathname

  /**
   * @param {string} filePath
   * @returns {Promise<Record<string, unknown> | Error | null>}
   */
  const loadAppFile = async filePath => {
    if (filePath === fileName) {
      return null
    }

    const result = await saveImport(filePath)
    if (is.instance(result, Error)) {
      log.error(result)
      return null
    }

    return result
  }

  const appResult = (await loadAppFile(maybeAppFileJs)) || (await loadAppFile(maybeAppFileMjs))
  if (appResult && !(appResult instanceof Error)) {
    const { style, styleVars } = appResult
    if (style) {
      appStyles.push(style)
    }
    if (styleVars && is.objectNative(styleVars)) {
      THEME_VARS = deep.merge(THEME_VARS, styleVars)
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(app.modules ?? {}, THEME_VARS)

  const styles = [...resetStyles, moduleStyles, ...themeStyles, ...pageStyles, ...appStyles]

  return styles.map(style => (is.fn(style) ? style(THEME_VARS) : style))
}
