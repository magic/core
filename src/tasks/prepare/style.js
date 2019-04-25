const is = require('@magic/types')
const deep = require('@magic/deep')
const path = require('path')
const { fs } = require('../../lib')

const Magic = require('../../modules/admin')

module.exports = app => {
  let resetStyles = []
  let styles = []

  const variables = config.THEME_VARS || {}

  const theme = config.THEME || ''

  // merge user created custom layout into styles, if it exists
  const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.js')
  if (fs.existsSync(maybeResetCssFile)) {
    const maybeResetCssStyles = require(maybeResetCssFile)
    resetStyles = [maybeResetCssStyles, ...resetStyles]
  } else {
    // merge default reset css into styles if no custom reset file exists
    const libResetCssFile = path.join(__dirname, '..', '..', 'themes', 'reset.css.js')
    const libResetCssStyles = require(libResetCssFile)
    resetStyles = [libResetCssStyles, ...resetStyles]
  }

  // merge user created custom layout into styles, if it exists
  const maybeLayoutCssFile = path.join(config.DIR.THEMES, theme, 'layout.css.js')
  if (fs.existsSync(maybeLayoutCssFile)) {
    const maybeLayoutCssStyles = require(maybeLayoutCssFile)
    resetStyles.push(maybeLayoutCssStyles)
  } else {
    // merge default layout into styles if no custom layout file exists
    const existingLayoutCssFile = path.join(__dirname, '..', '..', 'themes', 'layout.css.js')
    const existingLayoutCssStyles = require(existingLayoutCssFile)
    resetStyles.push(existingLayoutCssStyles)
  }

  app.pages
    .filter(p => p.dependencyStyles)
    .forEach(page => {
      styles.push(page.dependencyStyles)
    })

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (config.THEME) {
    // look if it exists in node_modules
    try {
      let theme = require(`@magic-themes/${config.THEME}`)
      if (is.function(theme)) {
        theme = theme(variables)
      }
      styles.push(theme)
    } catch (e) {
      // theme does not exist in node_modules, continue happily.
    }

    // first look if we have this theme preinstalled, if so, merge it into the styles
    const libThemeFile = path.join(__dirname, '..', '..', 'themes', config.THEME, 'index.js')

    if (fs.existsSync(libThemeFile)) {
      let theme = require(libThemeFile)
      if (is.function(theme)) {
        theme = theme(variables)
      }
      styles.push(theme)
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
    if (fs.existsSync(maybeThemeFile)) {
      let theme = require(maybeThemeFile)
      if (is.function(theme)) {
        theme = theme(variables)
      }
      styles.push(theme)
    }
  }

  app.pages
    .filter(p => p.style)
    .forEach(page => {
      styles.push(page.style)
    })

  const maybeAppFile = path.join(config.ROOT, 'app.js')
  if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
    const maybeApp = require(maybeAppFile)
    if (is.object(maybeApp) && !is.empty(maybeApp) && maybeApp.style) {
      styles.push(maybeApp.style)
    }
  }

  if (config.ENV === 'development') {
    styles = [Magic.style, ...styles]
  }

  let resetStyleObject = {}
  resetStyles.map(style => {
    resetStyleObject = deep.merge(resetStyleObject, style)
  })
  let styleObject = {}
  styles.map(style => {
    styleObject = deep.merge(styleObject, style)
  })

  const finalStyles = [resetStyleObject, styleObject]
  return finalStyles
}
