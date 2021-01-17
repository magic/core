import deep from '@magic/deep'
import is from '@magic/types'

export const findModuleStyles = (modules, vars, parent) => {
  let styles = {}

  Object.entries(modules)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([name, mod]) => {
      if (!is.empty(mod.style)) {
        let style = mod.style
        if (is.function(style)) {
          style = style(vars)
        }

        let selector = `.${name}`

        if (parent) {
          selector = `.${parent}${name}`
        }

        let finalStyle = {}
        if (!style[selector]) {
          const modStyle = {}
          const metaStyle = {}

          if (is.array(style)) {
            let s = {}
            style.forEach(item => {
              if (is.fn(item)) {
                item = item(vars)
              }

              s = deep.merge(s, item)
            })
            style = s
          }

          Object.entries(style)
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

          if (!is.empty(modStyle)) {
            finalStyle[selector] = modStyle
          }

          finalStyle = {
            ...finalStyle,
            ...metaStyle,
          }
        } else {
          if (!style[selector]) {
            style = {
              [selector]: style,
            }
          }

          finalStyle = style
        }

        styles = deep.merge(styles, finalStyle)
      }

      Object.entries(mod)
        .filter(([k]) => is.case.upper(k[0]))
        .filter(([_, m]) => !is.empty(m.style))
        .forEach(([subName, subMod]) => {
          const subStyles = findModuleStyles({ [subName]: subMod }, vars, name)
          styles = deep.merge(styles, subStyles)
        })
    })

  return styles
}
