const is = require('@magic/types')
const { isUpperCase } = require('../../../lib/')

const handleDependencies = ([name, component]) => {
  if (is.fn(component) && global.tags.body[name]) {
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
    })
    if (!is.fn(component)) {
      comp += '}'
    }
  }

  return `${comp}\n`
}

module.exports = handleDependencies
