const is = require('@magic/types')

const stringifyObject = (object, indent = '') => {
  indent = indent + '  '

  if (is.string(object)) {
    object = `"${object}"`
  } else if (is.array(object)) {
    object = `[${object.map(o => stringifyObject(o, indent)).join(',')}]`
  } else if (is.fn(object)) {
    object = object.toString()
  } else if (is.object(object)) {
    let str = Object.entries(object)
      .map(([k, o]) => `${indent}"${k}": ${stringifyObject(o, indent)}`)
      .join(',\n')

    object = `${indent}{\n${str}\n${indent}}\n`
  }

  return object
}

module.exports = stringifyObject
