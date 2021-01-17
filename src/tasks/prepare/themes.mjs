import path from 'path'

import error from '@magic/error'
import is from '@magic/types'
import deep from '@magic/deep'

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
          path.join(config.DIR.THEMES, theme_name, 'index.mjs'),
          // if called from globally installed magic, load with absolute path
          path.join(config.NODE_MODULES, '@magic-themes', theme_name, 'src', 'index.mjs'),
        ]

        return await Promise.all(
          themeLocations.map(async location => {
            try {
              const { default: theme, vars } = await import(location)

              return {
                theme,
                vars,
              }
            } catch (e) {
              if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
                throw error(e)
              }
            }
          }),
        )
      }),
    )

    let themeVars = {}

    result
      .filter(a => a)
      .forEach(list => {
        list
          .filter(a => a)
          .forEach(({ theme, vars }) => {
            if (!is.empty(vars)) {
              themeVars = deep.merge(themeVars, vars)
            }
            if (!is.empty(theme)) {
              themeStyles.push(theme)
            }
          })
      })

    THEME_VARS = deep.merge(themeVars, THEME_VARS)
  }

  app.pages
    .filter(p => p.style)
    .forEach(page => {
      pageStyles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.mjs')
  const fileName = new URL(import.meta.url).pathname
  if (maybeAppFile !== fileName) {
    try {
      const { style, styleVars } = await import(maybeAppFile)
      if (style) {
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

  return styles.map(style => (is.fn(style) ? style(THEME_VARS) : style))
}
