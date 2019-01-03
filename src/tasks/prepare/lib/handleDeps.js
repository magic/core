const is = require('@magic/types')
const { isUpperCase } = require('../../../lib/')

const handleDeps = ([name, component]) => {
  if (is.fn(component)) {
    if (global.tags.body[name]) {
      component = `const ${name} = C('${name}')\n`
    } else {
      component = `const ${name} = ${component.toString()}\n`
    }
    return component
  }

  const views = Object.entries(component)
    .filter(([k]) => isUpperCase(k))
    .map(([n, view]) => {
      return { name: n, view }
    })

  if (views.length) {
    component = `const ${name} = {`
    views.forEach(view => {
      component += `  ${view.name}: ${view.view},\n`
    })
    component += '}\n'
  } else {
    throw new Error(`unknown dependency type in ${name}: ${typeof component}`)
  }

  return component
}

module.exports = handleDeps
