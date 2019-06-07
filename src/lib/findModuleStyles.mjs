import is from '@magic/types'
import deep from '@magic/deep'

import { isUpperCase } from './isUpperCase.mjs'

export const findModuleStyles = (modules, vars, parent) => {
  let styles = {}
  Object.entries(modules)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([name, mod]) => {
      if (!is.empty(mod.style)) {
        let style = mod.style
        if (is.fn(mod.style)) {
          style = mod.style(vars)
        }

        let selector = `.${name}`

        if (parent) {
          selector = `.${parent}${name}`
        }

        if (!mod.style[selector]) {
          const modStyle = {}
          const metaStyle = {}
          Object.entries(mod.style)
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .forEach(([k, v]) => {
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

          style = {}
          if (!is.empty(modStyle)) {
            style[selector] = modStyle
          }

          style = {
            ...style,
            ...metaStyle,
          }
        }

        styles = deep.merge(styles, style)
      }

      Object.entries(mod)
        .filter(([k]) => isUpperCase(k))
        .filter(([_, m]) => !is.empty(m.style))
        .forEach(([subName, subMod]) => {
          const subStyles = findModuleStyles({ [subName]: subMod }, vars, name)
          styles = deep.merge(styles, subStyles)
        })
    })

  return styles
}
