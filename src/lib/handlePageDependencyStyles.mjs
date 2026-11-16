import deep from '@magic/deep'
import is from '@magic/types'

import { handleStyleFunctions } from './handleStyleFunctions.mjs'

/**
 * @param {Record<string, unknown> | unknown[]} dep
 * @returns {Record<string, unknown> | unknown[]}
 */
export const handlePageDependencyStyles = dep => {
  if (is.array(dep)) {
    return dep.map(entry =>
      handlePageDependencyStyles(/** @type {Record<string, unknown> | unknown[]} */ (entry)),
    )
  }

  let style = /** @type {Record<string, unknown>} */ ({})
  Object.entries(dep).forEach(([k, c]) => {
    const cObj = /** @type {Record<string, unknown>} */ (c)

    if (cObj.style) {
      cObj.style = handleStyleFunctions(cObj.style)
      // wrap styles in a html/css class if they are not yet.
      // this allows us to omit css classes in ALL modules,
      // as long as we pass the props downwards ...
      const styleObj = /** @type {Record<string, unknown>} */ (cObj.style)
      const keys = Object.keys(styleObj)
      if (!keys.includes(`.${k}`)) {
        cObj.style = {
          [`.${k}`]: styleObj,
        }
      }
      style = /** @type {Record<string, unknown>} */ (cObj.style)
    }

    if (!is.empty(cObj.dependencies)) {
      const s = handlePageDependencyStyles(
        /** @type {Record<string, unknown> | unknown[]} */ (cObj.dependencies),
      )
      style = /** @type {Record<string, unknown>} */ (deep.merge(style, handleStyleFunctions(s)))
    }
  })

  return style
}
