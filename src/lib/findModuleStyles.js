const is = require('@magic/types')
const deep = require('@magic/deep')
const isUpperCase = require('./isUpperCase')

const findModuleStyles = (modules, parent) => {
  let styles = {}
  Object.entries(modules)
    .filter(([_, m]) => !is.empty(m.style))
    .forEach(([name, mod]) => {
      if (is.fn(mod.style)) {
        mod.style = mod.style(config.THEME_VARS)
      }

      let selector = `.${name}`
      let style = mod.style

      if (parent) {
        selector = `.${parent}${name}`
      }

      if (!mod.style[selector]) {
        const modStyle = {}
        const metaStyle = {}
        Object.entries(mod.style).forEach(([k, v]) => {
          if (k.startsWith('@')) {
            if (k.startsWith('@media')) {
              if (!Object.keys(v).some(kk => kk.includes(`.${k}`))) {
                v = {
                  [selector]: v,
                }
              }
            }
            metaStyle[k] = v
          } else {
            modStyle[k] = v
          }
        })
        style = {
          [selector]: modStyle,
          ...metaStyle,
        }
      }

      styles = deep.merge(styles, style)

      Object.entries(mod)
        .filter(([k]) => isUpperCase(k))
        .filter(([_, m]) => !is.empty(m.style))
        .forEach(([subName, subMod]) => {
          const subStyles = findModuleStyles({ [subName]: subMod }, name)
          styles = deep.merge(styles, subStyles)
        })
    })

  return styles
}
module.exports = findModuleStyles
