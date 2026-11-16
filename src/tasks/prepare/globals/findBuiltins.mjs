import { builtins, component, tags } from '../../../modules/index.mjs'

/**
 * @param {Record<string, unknown>} [_modules]
 * @returns {Record<string, unknown>}
 */
export const findBuiltins = _modules => {
  // we do not have to look for libs here,
  // our builtins do not export any.
  /** @type {Record<string, unknown>} */
  const modules = {}
  Object.entries(builtins).forEach(([name, mod]) => {
    modules[name] = mod
  })

  Object.entries(tags).forEach(([name, mod]) => {
    modules[name] = mod
  })

  modules.component = component

  return modules
}
