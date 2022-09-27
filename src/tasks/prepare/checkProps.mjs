import is from '@magic/types'

export const prepareCheckProps = (magic, config) => {
  const { IS_DEV } = config

  let checkProps = ''
  let propTypeString = ''

  if (IS_DEV) {
    // add proptype checking
    checkProps = `const CHECK_PROPS = ${global.CHECK_PROPS.toString()}`

    propTypeString = 'const propTypes = {\n'
    propTypeString += Object.entries(magic.modules)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([name, mod]) => {
        // get propTypes of sub modules embedded in and exported from this module (Module.SubModule)
        const subPropTypes = Object.entries(mod)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .filter(([k, { propTypes }]) => is.case.upper(k[0]) && k !== 'View' && propTypes)
          .map(([sn, sm]) => {
            /*
             * if the propTypes of the submodule are not correctly nested,
             * eg Mod { propTypes: { prop1 } } instead of Mod { propTypes: { Mod: { prop1 } } },
             * we add the repeated Mod: { prop1 } declaration
             */
            const { propTypes } = sm
            if (is.array(propTypes) || !propTypes[sn]) {
              sm.propTypes = {
                [sn]: propTypes,
              }
            }

            return (
              Object.entries(sm.propTypes)
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
        if (mod.propTypes) {
          /*
           * if the propTypes of the module are not correctly nested,
           * eg Mod { propTypes: { prop1 }} instead of Mod { propTypes: { Mod: { prop1 }}},
           * we add the repeated Mod: { prop1 } declaration
           */
          const { propTypes } = mod
          if (!propTypes[name]) {
            mod.propTypes = {
              [name]: propTypes,
            }
          }

          propString = Object.entries(mod.propTypes)
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
