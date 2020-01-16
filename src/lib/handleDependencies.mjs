import is from '@magic/types'

import { stringifyObject } from './stringifyObject.mjs'

export const handleDependencies = (name, component) => {
  if (is.fn(component) && !is.case.upper(name[0])) {
    return `const ${name} = C('${name}')\n`
  }

  const views = Object.entries(component)
    .filter(([name]) => is.case.upper(name[0]))
    .map(([name, view]) => ({
      name,
      view: view.toString(),
    }))

  let comp = `const ${name} = `
  if (is.fn(component)) {
    comp += `${component.toString()}\n`
  } else {
    comp += ' {\n'
  }

  if (views.length) {
    views.forEach(view => {
      if (is.fn(component)) {
        comp += `${name}.${view.name} = ${view.view}\n`
      } else {
        comp += `  ${view.name}: ${view.view},\n`
      }

      if (config.ENV === 'development') {
        if (component[view.name].props) {
          const propString = stringifyObject(component[view.name].props)
          if (is.fn(component)) {
            comp += `${name}.${view.name}.props = ${propString}\n`
          } else {
            comp += `props: ${propString},\n`
          }
        }
      }
    })
    if (!is.fn(component)) {
      comp += '}'
    }
  }

  if (config.ENV === 'development') {
    if (component.props) {
      comp += `${name}.props = ${stringifyObject(component.props)}\n`
    }
  }
  return `${comp}\n`
}
