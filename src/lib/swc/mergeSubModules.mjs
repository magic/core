import { isModuleName, uniqueMerge } from '../../lib/index.mjs'

/**
 * @param {{ used?: Record<string, unknown>, name: string, dependencies?: Record<string, unknown> }} params
 * @returns {Record<string, unknown>}
 */
export const mergeSubModules = ({ used = {}, name, dependencies }) => {
  if (isModuleName(name)) {
    if (dependencies) {
      const merged = uniqueMerge(dependencies, used)
      if (merged) {
        used = merged
      }
      // Recurse into dependencies (the forEach result is intentionally discarded,
      // matching the original code, where uniqueMerge(undefined, used) is a no-op).
      const depModules = /** @type {string[]} */ (dependencies.modules)
      depModules.forEach(module => mergeSubModules({ name: module, used }))
    }
  }

  return used
}
