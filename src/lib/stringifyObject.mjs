import is from '@magic/types'

export const stringifyObject = (obj, indent = '') => {
  indent = indent + '  '

  if (is.string(obj)) {
    obj = `'${obj}'`
  } else if (is.array(obj)) {
    obj = `[${obj.map(o => stringifyObject(o, indent)).join(',')}]`
  } else if (is.fn(obj)) {
    obj = obj.toString()
  } else if (is.regex(obj)) {
    obj = obj.toString()
  } else if (is.obj(obj)) {
    let str = Object.entries(obj)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([k, o]) => `${indent}'${k}': ${stringifyObject(o, indent)}`)
      .join(',\n')

    obj = `${indent}{\n${str}\n${indent}}\n`
  }

  return obj
}
