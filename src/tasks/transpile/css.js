const css = require('@magic/css')

module.exports = async ([reset, style]) => {
  reset = await css(reset)
  style = await css(style)

  return {
    css: `/* reset */\n${reset.css}\n/* app */\n${style.css}`,
    minified: `${reset.minified}\n${style.minified}`,
  }
}
