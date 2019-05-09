const is = require('@magic/types')
const deep = require('@magic/deep')
const path = require('path')
const { handleStyleFunctions, findModuleStyles } = require('../../lib')

const Magic = require('../../modules/admin')

module.exports = ({ app, modules }) => {
  let resetStyles = []
  let styles = []

  const theme = config.THEME || ''

  // merge default reset css into styles
  const libResetCssFile = path.join(__dirname, '..', '..', 'themes', 'reset.css.js')
  const libResetCssStyles = require(libResetCssFile)
  resetStyles = [...resetStyles, handleStyleFunctions(libResetCssStyles)]

  // merge user created custom rest.css into styles, if it exists
  try {
    const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.js')
    const maybeResetCssStyles = require(maybeResetCssFile)
    resetStyles = [...resetStyles, handleStyleFunctions(maybeResetCssStyles)]
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }

  // load all styles from all modules
  const moduleStyles = findModuleStyles(modules)
  styles = deep.merge(styles, moduleStyles)

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (config.THEME) {
    // look if it exists in node_modules
    try {
      let theme = require(`@magic-themes/${config.THEME}`)
      styles.push(handleStyleFunctions(theme))
    } catch (e) {
      // theme does not exist in node_modules, continue happily.
    }

    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(__dirname, '..', '..', 'themes', config.THEME, 'index.js')

    try {
      let theme = require(libThemeFile)
      styles.push(handleStyleFunctions(theme))
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    try {
      const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
      let theme = handleStyleFunctions(require(maybeThemeFile))

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
      styles.push(handleStyleFunctions(page.style))
    })

  const maybeAppFile = path.join(config.ROOT, 'app.js')
  if (maybeAppFile !== __filename) {
    try {
      const maybeApp = require(maybeAppFile)
      if (is.object(maybeApp) && !is.empty(maybeApp) && maybeApp.style) {
        styles.push(handleStyleFunctions(maybeApp.style))
      }
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  }

  if (config.ENV === 'development') {
    styles = [handleStyleFunctions(Magic.style), ...styles]
  }

  let resetStyleObject = {}
  resetStyles.map(style => {
    resetStyleObject = deep.merge(resetStyleObject, handleStyleFunctions(style))
  })
  let styleObject = {}
  styles.map(style => {
    styleObject = deep.merge(styleObject, handleStyleFunctions(style))
  })

  const finalStyles = [resetStyleObject, styleObject]
  return finalStyles
}
