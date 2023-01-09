import error from '@magic/error'
import l from '@magic/log'

export const CHECK_PROPS = (props, propTypeDecl, name, log = l) => {
  const currentPage = app && app.state ? app.state.url : 'Unknown on client.'

  if (!log) {
    log = { error: () => {} }
  }

  const errors = []

  if (!propTypeDecl) {
    const err = error('expected propTypes as second argument', `E_CHECK_PROPS_${currentPage}`)
    log.error(err)

    return false
  }

  if (!name) {
    const err = error('expected Module name as third argument', 'E_CHECK_PROPS')
    log.error(`${err.stack} on page ${currentPage}`)

    return false
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
    const err = error(
      `expected propTypes to be an array. received: ${propTypes} on page ${currentPage} in component ${name}`,
      'E_CHECK_PROPS',
    )

    log.error(err)

    return false
  }

  if (!propTypes[0].key) {
    let [FALLBACK, ...pT] = propTypes
    propTypes = pT

    if (FALLBACK && typeof props === FALLBACK.type) {
      return true
    }
  }

  propTypes.forEach(propType => {
    const { key, required, type, oneOf, someOf } = propType
    let value = props[key]

    const types = is.array(type) ? type : [type]

    if (!required && !types.includes('undefined')) {
      types.push('undefined')
    }

    if (oneOf) {
      if (!value && !required) {
        value = propType.default
      }

      const includes = oneOf.includes(value)
      if (!includes && value !== propType.default) {
        const err = error(
          `${name} needs value to be one of [${oneOf
            .filter(a => a)
            .join(', ')}]. received ${value}`,
          'E_CHECK_PROPS_ONEOF_MISMATCH',
        )
        errors.push(err)
      }
    }

    if (someOf) {
      if (!value && !required) {
        value = propType.default
      }

      if (!is.array(value)) {
        const err = error(
          `${name} has someOf, someOf needs value to be an array.
        received ${value}, which is a ${typeof value}`,
          'E_CHECK_PROPS_SOMEOF_ARG_NOT_ARRAY',
        )
        errors.push(err)
      }

      const includes = !value.some(inc => !someOf.includes(inc))
      if (!includes && value !== propType.default) {
        const err = error(
          `${name} needs value to be one of [${someOf.join(', ')}]. received ${value}`,
          'E_CHECK_PROPS_SOME_OF_ARG_MISMATCH',
        )

        errors.push(err)
      }
    }

    const match = is(value, ...types)

    if (is.array(required)) {
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
      const err = error(
        `${name} needs props.${key} to be ${typeInfo} ${typeString}. received ${typeof value}`,
        'E_CHECK_PROPS_TYPE_MISMATCH',
      )
      errors.push(err)
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
        const err = error(
          `${name} needs props.${key} to be a non empty ${typeString}`,
          'E_CHECK_PROPS_PROP_EMPTY',
        )
        errors.push(err)
      }
    }

    if (is(value, 'number')) {
      // handle range prop here
      const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } = propType

      if (max && value > max) {
        const err = error(
          `${name} number expected to be <= ${max}, was ${value}`,
          'E_CHECK_PROPS_NUMBER_TOO_BIG',
        )
        errors.push(err)
      } else if (min > 0 && value < min) {
        const err = error(
          `${name} number expected to be >= ${min}, was ${value}`,
          'E_CHECK_PROPS_NUMBER_TOO_SMALL',
        )
        errors.push(err)
      }
    }

    if (is(value, 'string')) {
      const { max = 500, min = 0 } = propType

      if (max && value.length > max) {
        const err = error(
          `${name} string length expected to be <= ${max}, length was ${value.length}`,
          'E_CHECK_PROPS_STRING_TO_LONG',
        )
        errors.push(err)
      } else if (min > 0 && value.length < min) {
        const err = error(
          `${name} string length expected to be >= ${min}, length was ${value.length}`,
          'E_CHECK_PROPS_STRING_TO_SHORT',
        )
        errors.push(err)
      }
    }

    if (type === 'array' && propType.item && value) {
      const { item } = propType

      if (!is(value, 'array')) {
        const err = error(
          `${name} needs props.${key} to be an array. received ${typeof value}`,
          'E_CHECK_PROPS_ARRAY_MISMATCH',
        )
        errors.push(err)
      }

      value.forEach(val => {
        const typeInfo = is(item.type, 'array') && item.type.length > 1 ? 'one of' : 'a'
        const typeString = is(item.type, 'array')
          ? item.type.length > 1
            ? `["${item.type.join(', "')}"]`
            : item.type[0]
          : item.type

        if (item.type.includes('object') && is(val, 'object')) {
          item.keys.forEach(iKey => {
            const v = val[iKey.key]
            if (!is(v, iKey.type)) {
              const typeInfo = is(iKey.type, 'array') && iKey.type.length > 1 ? 'one of' : 'a'

              let typeString = ''
              if (Array.isArray(iKey.type)) {
                if (iKey.type.length > 1) {
                  typeString = `["${iKey.type.join(', "')}"]`
                } else {
                  typeString = iKey.type[0]
                }
              } else {
                typeString = iKey.type
              }

              const err = error(
                `${name} expects item.${
                  iKey.key
                } to be ${typeInfo} ${typeString}, received ${typeof v}, on page ${currentPage}`,
                'E_CHECK_PROPS_OBJECT_KEY_MISMATCH',
              )

              errors.push(err)
            }
          })
        } else {
          const type = is(item.type, 'array') ? item.type : [item.type]
          if (!is(val, ...type)) {
            const err = error(
              `${name} has item that is expected to be ${typeInfo} ${typeString}, received ${typeof val}, on page ${currentPage}`,
              'E_CHECK_PROPS_ARRAY_ITEM_MISMATCH',
            )
            errors.push(err)
          }
        }
      })
    }
  })

  errors.forEach(log.error)

  return !errors.length
}
