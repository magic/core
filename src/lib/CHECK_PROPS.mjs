/** @import { Props, PropTypeDecls, PropTypeDecl, LogLike } from '../types.mjs' */
import { isObjectNative } from '@magic/types'

/**
 * @param {Props} props
 * @param {PropTypeDecls} [propTypeDecl]
 * @param {string} [name]
 * @param {LogLike | false} [log]
 * @returns {boolean}
 */
export const CHECK_PROPS = (props, propTypeDecl, name, log) => {
  const currentPage = app && app.state?.url ? app.state.url : 'Unknown on client.'

  if (log === false) {
    log = () => {}
  } else if (!log) {
    log = e =>
      console.log(
        e instanceof Error ? e.code : undefined,
        e instanceof Error ? e.message : undefined,
      )
  }

  /**
   * @param {string} msg
   * @param {string} [code]
   * @returns {Error & { code: string }}
   */
  const error = (msg, code = 'E_CHECK_PROPS') => Object.assign(new Error(msg), { code })

  /** @type {{ [key: string]: ((e: unknown) => boolean) | undefined }} */
  const checks = {}

  checks.number = e => typeof e === 'number' && e === +e
  checks.integer = e => typeof e === 'number' && e === +e && e === (e | 0)
  checks.float = e => typeof e === 'number' && e === +e

  checks.array = e => Array.isArray(e)
  checks.regexp = e => e instanceof RegExp
  checks.date = e => e instanceof Date
  checks.error = e => e instanceof Error
  checks.null = e => e === null
  checks.promise = e => e instanceof Promise

  /**
   * @param {unknown} e
   * @param {...string} types
   * @returns {boolean}
   */
  const is = (e, ...types) =>
    types.some(type => (typeof checks[type] === 'function' ? checks[type](e) : typeof e === type))

  if (!propTypeDecl) {
    const err = error('expected propTypes as second argument', `E_CHECK_PROPS_${currentPage}`)
    log(err)

    return false
  }

  if (!name) {
    const err = error('expected Module name as third argument', 'E_CHECK_PROPS')
    log(`${err.stack} on page ${currentPage}`)

    return false
  }

  let propTypes = propTypeDecl[name]

  if (!Array.isArray(propTypes)) {
    const err = error(
      `expected propTypes to be an array. received: ${propTypes} on page ${currentPage} in component ${name}`,
      'E_CHECK_PROPS',
    )

    // the fallback log has no error method; the unguarded call
    // intentionally throws, as the tests expect an error here.
    const logError = /** @type {{ error: (error: Error & { code?: string }) => boolean }} */ (log)
      .error
    logError(err)

    return false
  }

  if (!propTypes[0].key) {
    const [FALLBACK, ...pT] = propTypes
    propTypes = pT

    if (FALLBACK && typeof props === FALLBACK.type) {
      return true
    }
  }

  /** @type {(Error & { code?: string })[]} */
  const errors = []

  propTypes.forEach(propType => {
    const { key, required, type, oneOf, someOf } = propType
    let value = key ? props[key] : undefined

    /** @type {string[]} */
    const types = Array.isArray(type) ? [...type] : [type ?? 'undefined']

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

      if (!Array.isArray(value)) {
        const err = error(
          `${name} has someOf, someOf needs value to be an array.
        received ${value}, which is a ${typeof value}`,
          'E_CHECK_PROPS_SOMEOF_ARG_NOT_ARRAY',
        )
        errors.push(err)
      } else {
        const includes = !value.some(inc => !someOf.includes(inc))
        if (!includes && value !== propType.default) {
          const err = error(
            `${name} needs value to be one of [${someOf.join(', ')}]. received ${value}`,
            'E_CHECK_PROPS_SOME_OF_ARG_MISMATCH',
          )

          errors.push(err)
        }
      }
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
      const err = error(
        `${name} needs props.${key} to be ${typeInfo} ${typeString}. received ${typeof value}`,
        'E_CHECK_PROPS_TYPE_MISMATCH',
      )
      errors.push(err)
    } else if (required) {
      if (typeof value === 'object' && value !== null && !Object.keys(value).length) {
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
      const num = typeof value === 'number' ? value : Number(value)
      const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } = propType

      if (max && num > max) {
        const err = error(
          `${name} number expected to be <= ${max}, was ${value}`,
          'E_CHECK_PROPS_NUMBER_TOO_BIG',
        )
        errors.push(err)
      } else if (min > 0 && num < min) {
        const err = error(
          `${name} number expected to be >= ${min}, was ${value}`,
          'E_CHECK_PROPS_NUMBER_TOO_SMALL',
        )
        errors.push(err)
      }
    }

    if (is(value, 'string')) {
      const str = typeof value === 'string' ? value : String(value)
      const { max = 500, min = 0 } = propType

      if (max && str.length > max) {
        const err = error(
          `${name} string length expected to be <= ${max}, length was ${str.length}`,
          'E_CHECK_PROPS_STRING_TO_LONG',
        )
        errors.push(err)
      } else if (min > 0 && str.length < min) {
        const err = error(
          `${name} string length expected to be >= ${min}, length was ${str.length}`,
          'E_CHECK_PROPS_STRING_TO_SHORT',
        )
        errors.push(err)
      }
    }

    if (type === 'array' && propType.item && value) {
      const { item } = propType

      if (!Array.isArray(value)) {
        const err = error(
          `${name} needs props.${key} to be an array. received ${typeof value}`,
          'E_CHECK_PROPS_ARRAY_MISMATCH',
        )
        errors.push(err)
      } else {
        value.forEach(val => {
          /** @type {string[]} */
          const itemType = Array.isArray(item.type) ? item.type : [item.type]
          const typeInfo = itemType.length > 1 ? 'one of' : 'a'
          const typeString = itemType.length > 1 ? `["${itemType.join(', "')}"]` : itemType[0]

          if (itemType.includes('object') && isObjectNative(val)) {
            if (item.keys) {
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
            }
          } else {
            if (!is(val, ...itemType)) {
              const err = error(
                `${name} has item that is expected to be ${typeInfo} ${typeString}, received ${typeof val}, on page ${currentPage}`,
                'E_CHECK_PROPS_ARRAY_ITEM_MISMATCH',
              )
              errors.push(err)
            }
          }
        })
      }
    }
  })

  const logError = log.error
  if (logError) {
    errors.forEach(logError)
  }

  return !errors.length
}
