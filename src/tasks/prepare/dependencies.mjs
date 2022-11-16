import { recursivelyResolveDependencies } from '../../lib/swc/recursivelyResolveDependencies.mjs'
import { resolveCssDependencies } from '../../lib/swc/resolveCssDependencies.mjs'

export const prepareDependencies = async (app, config) => {
  // const css = await resolveCssDependencies(app, config)
  return await recursivelyResolveDependencies({ app, config })
}