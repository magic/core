const is = require('@magic/types')
const { isUpperCase } = require('../../../lib/')

const handleDependencies = ([name, component]) => {
  if (is.fn(component)) {
    if (global.tags.body[name]) {
      return `const ${name} = C('${name}')\n`
    }

    return `const ${name} = ${component.toString()}\n`
  }

  const views = Object.entries(component)
    .filter(([name]) => isUpperCase(name))
    .map(([name, view]) => ({
      name,
      view,
    }))

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

module.exports = handleDependencies
