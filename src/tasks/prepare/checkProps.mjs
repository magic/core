import is from '@magic/types'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * @param {AppObject} magic
 * @param {Config} config
 * @returns {{ checkProps: string, propTypeString: string }}
 */
export const prepareCheckProps = (magic, config) => {
  const { IS_DEV } = config

  let checkProps = ''
  let propTypeString = ''

  if (IS_DEV) {
    // add proptype checking
    checkProps = `const CHECK_PROPS = ${CHECK_PROPS.toString()}`

    propTypeString = 'const propTypes = {\n'
    propTypeString += Object.entries(magic.modules ?? {})
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([name, mod]) => {
        // modules are functions, objects, or module namespaces with attached properties
        const modObj = /** @type {Record<string, unknown>} */ (mod)

        // get propTypes of sub modules embedded in and exported from this module (Module.SubModule)
        const subPropTypes = Object.entries(modObj)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .filter(
            ([k, sub]) =>
              is.case.upper(k[0]) &&
              k !== 'View' &&
              !!(/** @type {Record<string, unknown>} */ (sub).propTypes),
          )
          .map(([sn, smRaw]) => {
            const sm = /** @type {{ propTypes: Record<string, unknown> | unknown[] }} */ (smRaw)
            /*
             * if the propTypes of the submodule are not correctly nested,
             * eg Mod { propTypes: { prop1 } } instead of Mod { propTypes: { Mod: { prop1 } } },
             * we add the repeated Mod: { prop1 } declaration
             */
            const { propTypes } = sm
            if (is.array(propTypes) || !(/** @type {Record<string, unknown>} */ (propTypes)[sn])) {
              sm.propTypes = {
                [sn]: propTypes,
              }
            }

            return (
              Object.entries(/** @type {Record<string, unknown>} */ (sm.propTypes))
                // sort alphabetically
                .sort(([a], [b]) => (a > b ? 1 : -1))
                // stringify the props
                // JSON.stringify makes sure no code is hiding
                .map(([k, t]) => `${k}: ${JSON.stringify(t, null, 2)}`)
                .join(',\n')
            )
          })
          .filter(a => a)
          .join(',\n')

        let propString = ''
        if (modObj.propTypes) {
          /*
           * if the propTypes of the module are not correctly nested,
           * eg Mod { propTypes: { prop1 }} instead of Mod { propTypes: { Mod: { prop1 }}},
           * we add the repeated Mod: { prop1 } declaration
           */
          const propTypes = /** @type {Record<string, unknown>} */ (modObj.propTypes)
          if (!propTypes[name]) {
            modObj.propTypes = {
              [name]: propTypes,
            }
          }

          propString = Object.entries(/** @type {Record<string, unknown>} */ (modObj.propTypes))
            // sort the props by key, alphabetically
            .sort(([a], [b]) => (a > b ? 1 : -1))
            // stringify the props
            // JSON.stringify makes sure no code is hiding
            .map(([key, type]) => `${key}: ${JSON.stringify(type, null, 2)}`)
            .join(',\n')
        }

        if (subPropTypes) {
          propString += `\n${subPropTypes}`
        }
        return propString
      })
      .filter(a => a)
      .join(',\n')

    propTypeString += '\n}'
  }

  return {
    checkProps,
    propTypeString,
  }
}
