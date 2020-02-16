import path from 'path'

import error from '@magic/error'
import is from '@magic/types'

import { findModuleStyles } from '../../lib/index.mjs'
import colors from '../../themes/colors.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export const prepareThemes = async ({ app, modules }) => {
  const resetStyles = []
  const themeStyles = []
  const pageStyles = []
  const appStyles = []

  let { THEME = '', THEME_VARS = {} } = config

  THEME_VARS.colors = colors

  if (is.string(THEME)) {
    THEME = [THEME]
  }

  // merge user created custom reset.css into styles, if it exists
  try {
    // merge default reset css into styles
    const libResetCssFile = path.join(dirName, '..', '..', 'themes', 'reset.css.mjs')
    let { reset } = await import(libResetCssFile)

    resetStyles.push(reset)

    const themePromises = THEME.map(async theme_name => {
      // find reset css in theme dir if it exists
      const maybeResetCssFile = path.join(config.DIR.THEMES, theme_name, 'reset.css.mjs')
      const { default: maybeResetCssStyles } = await import(maybeResetCssFile)
      resetStyles.push(maybeResetCssStyles)
    })

    await Promise.all(themePromises)
  } catch (e) {
    if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
      throw error(e)
    }
  }

  // load user's chosen theme, if it is set and exists, and merge it into the styles
  if (THEME) {
    const themePromises = THEME.map(async theme_name => {
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
        path.join(config.DIR.THEMES, theme_name, 'index.mjs'),
      ]

      await Promise.all(
        themeLocations.map(async location => {
          try {
            let { default: theme, vars, ...maybeModules } = await import(location)

            const libs = {}
            Object.entries(maybeModules).map(([name, fn]) => {
              if (is.fn(fn)) {
                if (!modules[name]) {
                  modules[name] = fn
                } else if (modules[name].View) {
                  modules[name] = {
                    ...modules[name],
                    View: fn,
                  }
                } else {
                  modules[name] = fn
                }
              } else {
                if (!modules[name]) {
                  modules[name] = fn
                } else if (is.fn(modules[name])) {
                  modules[name] = fn
                } else {
                  modules[name] = {
                    ...modules[name],
                    ...fn,
                  }
                }
              }
            })

            if (!is.empty(vars)) {
              THEME_VARS = { ...THEME_VARS, ...vars }
            }

            themeStyles.push(theme)
          } catch (e) {
            if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
              throw error(e)
            }
          }
        }),
      )
    })

    await Promise.all(themePromises)
  }

  app.pages
    .filter(p => p.style)
    .forEach(page => {
      if (!is.empty(page.styleVars)) {
        THEME_VARS = { ...THEME_VARS, ...page.styleVars }
      }
      pageStyles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.mjs')
  const fileName = new URL(import.meta.url).pathname
  if (maybeAppFile !== fileName) {
    try {
      const { style, styleVars } = await import(maybeAppFile)
      if (style) {
        if (!is.empty(styleVars)) {
          THEME_VARS = { ...THEME_VARS, ...styleVars }
        }
        appStyles.push(style)
      }
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw error(e)
      }
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(modules, THEME_VARS)

  const styles = [...resetStyles, moduleStyles, ...themeStyles, ...pageStyles, ...appStyles]

  return {
    css: styles.map(style => (is.fn(style) ? style(THEME_VARS) : style)),
    mods: modules,
  }
}
