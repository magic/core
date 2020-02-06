import path from 'path'

import error from '@magic/error'
import is from '@magic/types'

import { findModuleStyles } from '../../lib/index.mjs'
import colors from '../../themes/colors.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export const prepareCss = async ({ app, modules }) => {
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

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (THEME) {
    const themePromises = THEME.map(async theme_name => {
      // first look if we have this theme preinstalled, if so, merge it into the styles
      const libThemeFile = path.join(dirName, '..', '..', 'themes', theme_name, 'index.mjs')

      try {
        let { default: theme, vars } = await import(libThemeFile)
        if (!is.empty(vars)) {
          THEME_VARS = { ...THEME_VARS, ...vars }
        }
        themeStyles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
      }

      // look if it exists in node_modules/${theme_name}
      try {
        let { default: theme, vars } = await import(theme_name)

        if (!is.empty(vars)) {
          THEME_VARS = { ...THEME_VARS, ...vars }
        }
        themeStyles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
        // theme does not exist in node_modules, continue happily.
      }

      // look if it exists in node_modules/@magic-themes/${theme_name}
      try {
        const themePath = `@magic-themes/${theme_name}`
        let { default: theme, vars } = await import(themePath)
        if (!is.empty(vars)) {
          THEME_VARS = { ...THEME_VARS, ...vars }
        }
        themeStyles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
        // theme does not exist in node_modules, continue happily.
      }

      // load user's custom theme, overwriting both preinstalled and node_modules themes
      try {
        const maybeThemeFile = path.join(config.DIR.THEMES, theme_name, 'index.mjs')
        let { default: theme, vars } = await import(maybeThemeFile)
        if (!is.empty(vars)) {
          THEME_VARS = { ...THEME_VARS, ...vars }
        }
        themeStyles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
      }
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

  const styles = [
    ...resetStyles,
    moduleStyles,
    ...themeStyles,
    ...pageStyles,
    ...appStyles,
  ]

  return styles.map(style => is.fn(style) ? style(THEME_VARS) : style)
}
