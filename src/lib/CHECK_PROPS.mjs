export const CHECK_PROPS = (props, propTypeDecl, name = 'Module') => {
  const is = (e, ...types) =>
    types.some(type => (typeof is[type] === 'function' ? is[type](e) : typeof e === type))

  is.number = e => e === +e
  is.integer = e => e === +e && e === (e | 0)
  is.float = e => e === +e

  is.array = e => Array.isArray(e)
  is.regexp = e => e instanceof RegExp
  is.date = e => e instanceof Date
  is.error = e => e instanceof Error
  is.null = e => e === null
  is.promise = e => e instanceof Promise

  let propTypes = propTypeDecl
  if (!propTypeDecl[0].key) {
    let [FALLBACK, ...pT] = propTypeDecl
    propTypes = pT

    if (FALLBACK && typeof props === FALLBACK.type) {
      return
    }
  }

  propTypes.map(propType => {
    const { key, required, type } = propType
    let value = props[key]

    const types = Array.isArray(type) ? type : [type]

    if (!required) {
      types.push('undefined')
    }
    const match = is(value, ...types)

    if (Array.isArray(required)) {
      if (!match) {
        const altExists = required.filter(key => is(props[key], ...types))
        if (altExists.length) {
          value = props[altExists[0]]
        }
      }
    }

    if (!is(value, ...types)) {
      const typeInfo = types.length > 1 ? 'one of' : 'a'
      const typeString = types.length > 1 ? `["${types.join(', "')}"]` : types[0]
      console.error(`${name} needs props.${key} to be ${typeInfo} ${typeString}`)
    } else if (required) {
      if (typeof value === 'object' && !Object.keys(value).length) {
        let typeString = ''
        if (types.includes('array')) {
          typeString += ' array'
        }
        if (types.includes('object')) {
          if (types.includes('array')) {
            typeString += ' or'
          }
          typeString += ' object'
        }
        console.error(`${name} needs props.${key} to be a non empty ${typeString}`)
      }
    }
  })

  return true
}
