import { isModuleName, uniqueMerge } from '../../lib/index.mjs'

export const mergeSubModules = ({ used = {}, name, dependencies }) => {
  if (isModuleName(name)) {
    if (dependencies) {
      used = uniqueMerge(dependencies, used)
      const added = dependencies.modules.forEach(module => mergeSubModules({ name: module, used }))
      used = uniqueMerge(added, used)
    }
  }

  return used
}
