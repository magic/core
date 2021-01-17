import { builtins, component, tags } from '../../../modules/index.mjs'

export const findBuiltins = () => {
  // we do not have to look for libs here,
  // our builtins do not export any.
  let modules = {}
  Object.entries(builtins).forEach(([name, mod]) => {
    modules[name] = mod
  })
  Object.entries(tags).forEach(([name, mod]) => {
    modules[name] = mod
  })

  modules.component = component
  return modules
}
