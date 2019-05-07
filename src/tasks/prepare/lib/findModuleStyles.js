const is = require('@magic/types')
const deep = require('@magic/deep')
const { isUpperCase } = require('../../../lib')

const findModuleStyles = (modules, parent) => {
  let styles = {}
  Object.entries(modules)
    .filter(([_, m]) => !is.empty(m.style))
    .forEach(([name, mod]) => {
      const selector = `.${name}`
      let style = mod.style

      if (parent) {
        const parentSelector = `.${parent}${name}`

        style = {
          [parentSelector]: style,
        }
      } else {
        if (!mod.style[selector]) {
          style = {
            [selector]: style,
          }
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