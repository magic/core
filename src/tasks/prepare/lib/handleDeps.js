const is = require('@magic/types')

const handleDeps = ([name, component]) => {
  if (is.fn(component.View)) {
    component = `const ${name} = { View: ${component.View.toString()} }\n`
  } else if (is.fn(component)) {
    if (global.tags.body[name]) {
      component = `const ${name} = C('${name}')\n`
    } else {
      component = `const ${name} = ${component.toString()}\n`
    }
  } else {
    throw new Error(`unknown dependency type in ${name}: ${typeof component}`)
  }

  return component
}

module.exports = handleDeps
