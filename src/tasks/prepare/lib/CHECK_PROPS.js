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
      console.error(`${name} needs props.${key} to be one of [${types.join(', ')}]`)
    }
  })

  return p
}

module.exports = CHECK_PROPS
