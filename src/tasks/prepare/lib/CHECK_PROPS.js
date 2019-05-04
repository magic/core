const CHECK_PROPS = (props, propTypes, name = 'Module') => {
  const is = (e, ...types) => {
    const match = types.some(type => {
      if (type === 'array') {
        return Array.isArray(e)
      }
      if (type === 'error') {
        return e instanceof Error
      }
      if (type === 'date') {
        return e instanceof Date
      }

      return typeof e === type
    })

    return match
  }

  propTypes.map(propType => {
    const { key, required, type } = propType
    const value = props[key]

    const types = Array.isArray(type) ? type : [type]

    if (!required) {
      types.push('undefined')
    }

    if (!is(value, ...types)) {
      const typeInfo = types.length > 1 ? 'one of' : 'a'
      const typeString = types.length > 1 ? `["${types.join(', "')}"]` : types[0]
      console.error(`${name} needs props.${key} to be ${typeInfo} [${typeString}]`)
    } else if(required) {
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

  return p
}

module.exports = CHECK_PROPS
