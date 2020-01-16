import path from 'path'

import error from '@magic/error'
import is from '@magic/types'

import { findModuleStyles } from '../../lib/index.mjs'
import colors from '../../themes/colors.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export const prepareCss = async ({ app, modules }) => {
  const styles = []

  let { THEME = '', THEME_VARS = {} } = config
  if (is.fn(THEME_VARS)) {
    THEME_VARS = THEME_VARS({ colors })
  }

  THEME_VARS.colors = colors
  if (is.string(THEME)) {
    THEME = [THEME]
  }

  // merge user created custom reset.css into styles, if it exists
  try {
    // merge default reset css into styles
    const libResetCssFile = path.join(dirName, '..', '..', 'themes', 'reset.css.mjs')
    let { reset } = await import(libResetCssFile)
    if (is.function(reset)) {
      reset = reset(THEME_VARS)
    }

    styles.push(reset)

    const themePromises = THEME.map(async theme_name => {
      // find reset css in theme dir if it exists
      const maybeResetCssFile = path.join(config.DIR.THEMES, theme_name, 'reset.css.mjs')
      const { default: maybeResetCssStyles } = await import(maybeResetCssFile)
      if (is.function(maybeResetCssStyles)) {
        maybeResetCssStyles = maybeResetCssStyles(THEME_VARS)
      }
      styles.push(maybeResetCssStyles)
    })

    await Promise.all(themePromises)
  } catch (e) {
    if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
      throw error(e)
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(modules, THEME_VARS)
  styles.push(moduleStyles)

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (THEME) {
    const themePromises = THEME.map(async theme_name => {
      // first look if we have this theme preinstalled, if so, merge it into the styles
      const libThemeFile = path.join(dirName, '..', '..', 'themes', theme_name, 'index.mjs')

      try {
        let { default: theme } = await import(libThemeFile)
        if (is.function(theme)) {
          theme = theme(THEME_VARS)
        }
        styles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
      }

      // look if it exists in node_modules
      try {
        const themePath = `@magic-themes/${theme_name}`
        let { default: theme } = await import(themePath)
        if (is.function(theme)) {
          theme = theme(THEME_VARS)
        }
        styles.push(theme)
      } catch (e) {
        if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
          throw error(e)
        }
        // theme does not exist in node_modules, continue happily.
      }

      // load user's custom theme, overwriting both preinstalled and node_modules themes
      try {
        const maybeThemeFile = path.join(config.DIR.THEMES, theme_name, 'index.mjs')
        let { default: theme } = await import(maybeThemeFile)
        if (is.function(theme)) {
          theme = theme(THEME_VARS)
        }
        styles.push(theme)
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
      if (is.function(page.style)) {
        page.style = page.style(THEME_VARS)
      }
      styles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.mjs')
  const fileName = new URL(import.meta.url).pathname
  if (maybeAppFile !== fileName) {
    try {
      const { style } = await import(maybeAppFile)
      if (style) {
        if (is.function(style)) {
          style = style(THEME_VARS)
        }
        styles.push(style)
      }
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw error(e)
      }
    }
  }

  return styles
}
