import is from '@magic/types'
import isUpperCase from './isUpperCase.mjs'
import stringifyObject from './stringifyObject.mjs'

export const handleDependencies = (name, component) => {
  if (is.fn(component) && !isUpperCase(name)) {
    return `const ${name} = C('${name}')\n`
  }

  const views = Object.entries(component)
    .filter(([name]) => isUpperCase(name))
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
          comp += `${name}.${view.name}.props = ${stringifyObject(component[view.name].props)}\n`
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

export default handleDependencies
