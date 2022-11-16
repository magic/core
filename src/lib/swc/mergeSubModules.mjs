import { isModuleName, uniqueMerge } from '../../lib/index.mjs'

export const mergeSubModules = ({ used = {}, name, dependencies }) => {
  // console.log({name})
  if (isModuleName(name)) {
    const deps = dependencies[name]
    if (deps) {
      deps.modules.forEach(module => mergeSubModules({ name: module, used, dependencies }))

      dependencies[name] = deps

      used = uniqueMerge(deps, used)
    }

    return used
  }
}
