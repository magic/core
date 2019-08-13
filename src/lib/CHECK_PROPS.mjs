export const CHECK_PROPS = (props, propTypeDecl, name) => {
  const currentPage =
    app && app.state ? app.state.url.replace(config.WEB_ROOT, '/') : 'Unknown on client.'

  if (!name) {
    const err = new Error()
    console.error(
      `CHECK_PROPS: expected Module name as third argument ${err.stack} on page ${currentPage}`,
    )
    return
  }

  if (!propTypeDecl) {
    const err = new Error()
    console.error(
      `CHECK_PROPS: expected propTypes as second argument ${err.stack} on page ${currentPage}`,
    )
    return
  }

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

  let propTypes = propTypeDecl[name]

  if (!is.array(propTypes)) {
    console.error(
      `CHECK_PROPS: expected propTypes to be an array. received: ${propTypes} on page ${currentPage} in component ${name}`,
    )
    return
  }

  if (!propTypes[0].key) {
    let [FALLBACK, ...pT] = propTypes
    propTypes = pT

    if (FALLBACK && typeof props === FALLBACK.type) {
      return
    }
  }

  propTypes.map(propType => {
    const { key, required, type } = propType
    let value = props[key]

    const types = Array.isArray(type) ? type : [type]

    if (!required && !types.includes('undefined')) {
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

    const typeInfo = types.length > 1 ? 'one of' : 'a'
    const typeString = types.length > 1 ? `["${types.join(', "')}"]` : types[0]

    if (!is(value, ...types)) {
      console.error(
        `${name} needs props.${key} to be ${typeInfo} ${typeString}. received ${typeof value}`,
      )
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

    if (is(value, 'number')) {
      // handle range prop here
      const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } = propType

      if (max && value > max) {
        console.error(`${name}: number expected to be <= ${max}, was ${value}`)
      } else if (min > 0 && value < min) {
        console.error(`${name}: number expected to be >= ${min}, was ${value}`)
      }
    }

    if (is(value, 'string')) {
      const { max = 500, min = 0 } = propType

      if (max && value.length > max) {
        console.error(`${name}: string length expected to be <= ${max}, length was ${value.length}`)
      } else if (min > 0 && value.length < min) {
        console.error(`${name}: string length expected to be >= ${min}, length was ${value.length}`)
      }
    }

    if (type === 'array' && propType.item && value) {
      const { item } = propType

      if (!is(value, 'array')) {
        console.error(`${name} needs props.${key} to be an array. received ${typeof value}`)
      }

      value.forEach(val => {
        const typeInfo = is(item.type, 'array') && item.type.length > 1 ? 'one of' : 'a'
        const typeString = is(item.type, 'array')
          ? item.type.length > 1
            ? `["${item.type.join(', "')}"]`
            : item.type[0]
          : item.type

        if (!is(val, item.type)) {
          console.error(
            `${name} has item that is expected to be ${typeInfo} ${typeString}, received ${typeof val}`,
          )
        }

        if (item.type === 'object') {
          item.keys.forEach(iKey => {
            const v = val[iKey.key]
            if (!is(v, iKey.type)) {
              const typeInfo = is(iKey.type, 'array') && iKey.type.length > 1 ? 'one of' : 'a'
              const typeString = Array.isArray(iKey.type)
                ? iKey.type.length > 1
                  ? `["${iKey.type.join(', "')}"]`
                  : iKey.type[0]
                : iKey.type

              console.error(
                `${name} expects item.${
                  iKey.key
                } to be ${typeInfo} ${typeString}, received ${typeof v}, on page ${currentPage}`,
              )
            }
          })
        } else if (!is(val, item.type)) {
          console.error(
            `${name} has item that is expected to be ${typeInfo} ${typeString}, received ${typeof val}, on page ${currentPage}`,
          )
        }
        // console.log({val, item: propType.item})
      })
    }
  })

  return true
}
