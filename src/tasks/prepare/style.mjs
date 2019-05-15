import is from '@magic/types'
import deep from '@magic/deep'
import path from 'path'
import { findModuleStyles } from '../../lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export const prepareStyle = async ({ app, modules }) => {
  const styles = []

  const theme = config.THEME || ''

  let resetStyles

  // merge user created custom reset.css into styles, if it exists
  try {
    // merge default reset css into styles
    const libResetCssFile = path.join(dirName, '..', '..', 'themes', 'reset.css.mjs')
    const { reset } = await import(libResetCssFile)
    resetStyles = reset
    const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.mjs')
    const maybeResetCssStyles = await import(maybeResetCssFile)
    if (is.fn(maybeResetCssStyles)) {
      maybeResetCssStyles = maybeResetCssStyles(config.THEME_VARS)
    }
    resetStyles = maybeResetCssStyles
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
    // look if it exists in node_modules
    try {
      let theme = await import(`@magic-themes/${config.THEME}`)
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

    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(dirName, '..', '..', 'themes', config.THEME, 'index.mjs')

    try {
      let theme = await import(libThemeFile)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
        throw e
      }
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    try {
      const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.mjs')
      let theme = await import(maybeThemeFile)
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

  const finalStyles = [resetStyles, styles]
  console.log('finalStyles', finalStyles)
  return finalStyles
}
