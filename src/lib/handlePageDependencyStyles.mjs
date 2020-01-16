import deep from '@magic/deep'
import is from '@magic/types'

import handleStyleFunctions from './handleStyleFunctions.mjs'

export const handlePageDependencyStyles = dep => {
  if (is.array(dep)) {
    return dep.map(handlePageDependencyStyles)
  }

  let style = {}
  Object.entries(dep).forEach(([k, c]) => {
    if (c.style) {
      c.style = handleStyleFunctions(c.style)
      // wrap styles in a html/css class if they are not yet.
      // this allows us to omit css classes in ALL modules,
      // as long as we pass the props downwards ...
      const keys = Object.keys(c.style)
      if (!keys.includes(`.${k}`)) {
        c.style = {
          [`.${k}`]: c.style,
        }
      }
      style = c.style
    }

    if (!is.empty(c.dependencies)) {
      const s = handlePageDependencyStyles(c.dependencies)
      style = deep.merge(style, handleStyleFunctions(s))
    }
  })

  return style
}
