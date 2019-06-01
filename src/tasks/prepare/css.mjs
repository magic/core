import is from '@magic/types'
import path from 'path'
import { findModuleStyles } from '../../lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export const prepareCss = async ({ app, modules }) => {
  const styles = []

  const { THEME = '' } = config

  // merge user created custom reset.css into styles, if it exists
  try {
    // merge default reset css into styles
    const libResetCssFile = path.join(dirName, '..', '..', 'themes', 'reset.css.mjs')
    const { reset } = await import(libResetCssFile)
    styles.push(reset)

    // find reset css in theme dir if it exists
    const maybeResetCssFile = path.join(config.DIR.THEMES, THEME, 'reset.css.mjs')
    const { default: maybeResetCssStyles } = await import(maybeResetCssFile)
    if (is.fn(maybeResetCssStyles)) {
      maybeResetCssStyles = maybeResetCssStyles(config.THEME_VARS)
    }
    styles.push(maybeResetCssStyles)
  } catch (e) {
    if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
      throw e
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(modules, config.THEME_VARS)
  styles.push(moduleStyles)

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (config.THEME) {
    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(dirName, '..', '..', 'themes', config.THEME, 'index.mjs')

    try {
      let { default: theme } = await import(libThemeFile)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw e
      }
    }

    // look if it exists in node_modules
    try {
      const themePath = `@magic-themes/${config.THEME}`
      let { default: theme } = await import(themePath)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw e
      }
      // theme does not exist in node_modules, continue happily.
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    try {
      const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.mjs')
      let { default: theme } = await import(maybeThemeFile)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw e
      }
    }
  }

  app.pages
    .filter(p => p.style)
    .forEach(page => {
      if (is.fn(page.style)) {
        page.style = page.style(config.THEME_VARS)
      }
      styles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.mjs')
  const fileName = new URL(import.meta.url).pathname
  if (maybeAppFile !== fileName) {
    try {
      const { style } = await import(maybeAppFile)
      if (style) {
        if (is.fn(style)) {
          style = style(config.THEME_VARS)
        }
        styles.push(style)
      }
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw e
      }
    }
  }

  return styles
}
