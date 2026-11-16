import deep from '@magic/deep'
import is from '@magic/types'

/**
 * @param {Record<string, unknown>} modules
 * @param {unknown} vars
 * @param {string | undefined} [parent]
 * @returns {Record<string, unknown>}
 */
export const findModuleStyles = (modules, vars, parent) => {
  /** @type {Record<string, unknown>} */
  let styles = {}

  Object.entries(modules)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([name, mod]) => {
      const modObj = /** @type {Record<string, unknown>} */ (mod)

      if (!is.empty(modObj.style)) {
        /** @type {unknown} */
        let style = modObj.style
        if (is.function(style)) {
          style = /** @type {Record<string, unknown>} */ (
            /** @type {(v: unknown) => unknown} */ (style)(vars)
          )
        }

        let selector = `.${name}`

        if (parent) {
          selector = `.${parent}${name}`
        }

        /** @type {Record<string, unknown>} */
        let finalStyle = {}
        if (!(/** @type {Record<string, unknown>} */ (style)[selector])) {
          /** @type {Record<string, unknown>} */
          const modStyle = {}
          /** @type {Record<string, unknown>} */
          const metaStyle = {}

          if (is.array(style)) {
            /** @type {Record<string, unknown>} */
            let s = {}
            for (const rawItem of /** @type {unknown[]} */ (style)) {
              const item = is.fn(rawItem)
                ? /** @type {(v: unknown) => unknown} */ (rawItem)(vars)
                : rawItem
              s = /** @type {Record<string, unknown>} */ (deep.merge(s, item))
            }
            style = s
          }

          Object.entries(/** @type {Record<string, unknown>} */ (style))
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .forEach(([k, v]) => {
              if (k.startsWith('@')) {
                if (k.startsWith('@media')) {
                  if (
                    !Object.keys(/** @type {Record<string, unknown>} */ (v)).some(kk =>
                      kk.includes(`.${k}`),
                    )
                  ) {
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
          if (!(/** @type {Record<string, unknown>} */ (style)[selector])) {
            style = {
              [selector]: style,
            }
          }

          finalStyle = /** @type {Record<string, unknown>} */ (style)
        }

        styles = /** @type {Record<string, unknown>} */ (deep.merge(styles, finalStyle))
      }

      Object.entries(modObj)
        .filter(([k]) => is.case.upper(k[0]))
        .filter(([_, m]) => !is.empty(/** @type {Record<string, unknown>} */ (m).style))
        .forEach(([subName, subMod]) => {
          const subStyles = findModuleStyles({ [subName]: subMod }, vars, name)
          styles = /** @type {Record<string, unknown>} */ (deep.merge(styles, subStyles))
        })
    })

  return styles
}
