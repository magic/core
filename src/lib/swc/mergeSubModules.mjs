import { isModuleName, uniqueMerge } from '../../lib/index.mjs'

export const mergeSubModules = ({ used = {}, name }) => {
  if (isModuleName(name)) {
    const modDeps = moduleDependencies[name]
    if (modDeps) {
      used = uniqueMerge(modDeps, used)
      const added = modDeps.modules.forEach(module => mergeSubModules({ name: module, used }))
      used = uniqueMerge(added, used)
    }
  }

  return used
}
