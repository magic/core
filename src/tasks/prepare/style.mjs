import is from '@magic/types'
import deep from '@magic/deep'
import path from 'path'
import { findModuleStyles } from '../../lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

export default async ({ app, modules }) => {
  const styles = []

  const theme = config.THEME || ''

  // merge default reset css into styles
  const libResetCssFile = path.join(dirName, '..', '..', 'themes', 'reset.css.js')
  let resetStyles = await import(libResetCssFile)

  // merge user created custom rest.css into styles, if it exists
  try {
    const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.js')
    const maybeResetCssStyles = await import(maybeResetCssFile)
    if (is.fn(maybeResetCssStyles)) {
      maybeResetCssStyles = maybeResetCssStyles(config.THEME_VARS)
    }
    resetStyles = maybeResetCssStyles
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
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
      // theme does not exist in node_modules, continue happily.
    }

    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(dirName, '..', '..', 'themes', config.THEME, 'index.js')

    try {
      let theme = await import(libThemeFile)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    try {
      const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
      let theme = await import(maybeThemeFile)
      if (is.fn(theme)) {
        theme = theme(config.THEME_VARS)
      }
      styles.push(theme)
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
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

  const maybeAppFile = path.join(config.ROOT, 'app.js')
  if (maybeAppFile !== __filename) {
    try {
      const maybeApp = await import(maybeAppFile)
      if (is.object(maybeApp) && !is.empty(maybeApp) && maybeApp.style) {
        if (is.fn(maybeApp.style)) {
          maybeApp.style = maybeApp.style(config.THEME_VARS)
        }
        styles.push(maybeApp.style)
      }
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  }

  const finalStyles = [resetStyles, styles]
  return finalStyles
}
