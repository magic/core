const is = require('@magic/types')
const deep = require('@magic/deep')
const path = require('path')
const { fs } = require('../../lib')

const Magic = require('../../modules/admin')

module.exports = app => {
  let resetStyle = {}
  let style = {}

  const variables = config.THEME_VARS || {}

  const theme = config.THEME || ''

  // merge user created custom layout into styles, if it exists
  const maybeResetCssFile = path.join(config.DIR.THEMES, theme, 'reset.css.js')
  if (fs.existsSync(maybeResetCssFile)) {
    resetStyle = deep.merge(require(maybeResetCssFile), resetStyle)
  } else {
    // merge default reset css into styles if no custom reset file exists
    const libResetCssFile = path.join(__dirname, '..', '..', 'themes', 'reset.css.js')
    resetStyle = deep.merge(require(libResetCssFile), resetStyle)
  }

  // merge user created custom layout into styles, if it exists
  const maybeLayoutCssFile = path.join(config.DIR.THEMES, theme, 'layout.css.js')
  if (fs.existsSync(maybeLayoutCssFile)) {
    resetStyle = deep.merge(resetStyle, require(maybeLayoutCssFile))
  } else {
    // merge default layout into styles if no custom layout file exists
    const existingLayoutCssFile = path.join(__dirname, '..', '..', 'themes', 'layout.css.js')
    resetStyle = deep.merge(resetStyle, require(existingLayoutCssFile))
  }


  app.pages.forEach(page => {
    style = deep.merge(style, page.dendencyStyle)
  })

  // load user's chosen theme, if it is set and exists, and merge it over the styles
  if (config.THEME) {
    // look if it exists in node_modules
    try {
      let theme = require(`@magic-themes/${config.THEME}`)
      if (is.function(theme)) {
        theme = theme(variables)
      }
      style = deep.merge(style, theme)
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
      style = deep.merge(style, theme)
    }

    // load user's custom theme, overwriting both preinstalled and node_modules themes
    const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
    if (fs.existsSync(maybeThemeFile)) {
      let theme = require(maybeThemeFile)
      if (is.function(theme)) {
        theme = theme(variables)
      }
      style = deep.merge(style, theme)
    }
  }

  app.pages.forEach(page => {
    style = deep.merge(style, page.style)
  })

  const maybeAppFile = path.join(config.ROOT, 'app.js')
  if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
    const maybeApp = require(maybeAppFile)
    if (is.object(maybeApp) && !is.empty(maybeApp)) {
      style = deep.merge(style, maybeApp.style)
    }
  }

  if (config.ENV === 'development') {
    style = deep.merge(Magic.style, style)
  }

  return [resetStyle, style]
}
