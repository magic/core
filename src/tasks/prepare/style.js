const is = require('@magic/types')
const deep = require('@magic/deep')
const path = require('path')
const { findModuleStyles } = require('../../lib')

module.exports = ({ app, modules }) => {
  const styles = []

  const theme = config.THEME || ''

  // merge default reset css into styles
  const libResetCssFile = path.join(__dirname, '..', '..', 'themes', 'reset.css.js')
  let resetStyles = require(libResetCssFile)

  // merge user created custom rest.css into styles, if it exists
  try {
    const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.js')
    const maybeResetCssStyles = require(maybeResetCssFile)
    resetStyles = maybeResetCssStyles
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(modules)
  styles.push(moduleStyles)

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (config.THEME) {
    // look if it exists in node_modules
    try {
      let theme = require(`@magic-themes/${config.THEME}`)
      styles.push(theme)
    } catch (e) {
      // theme does not exist in node_modules, continue happily.
    }

    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(__dirname, '..', '..', 'themes', config.THEME, 'index.js')

    try {
      let theme = require(libThemeFile)
      styles.push(theme)
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    try {
      const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
      let theme = require(maybeThemeFile)

      if (is.array(maybeThemeFile)) {
        theme.forEach(t => {
          styles.push(t)
        })
      } else {
        styles.push(theme)
      }
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  }

  app.pages
    .filter(p => p.style)
    .forEach(page => {
      styles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.js')
  if (maybeAppFile !== __filename) {
    try {
      const maybeApp = require(maybeAppFile)
      if (is.object(maybeApp) && !is.empty(maybeApp) && maybeApp.style) {
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
