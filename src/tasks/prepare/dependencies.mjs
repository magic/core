import { recursivelyResolveDependencies } from '../../lib/swc/recursivelyResolveDependencies.mjs'

export const prepareDependencies = async (app, config) => {
  const dependencies = await recursivelyResolveDependencies({ app, config })
  // console.log(dependencies.modulesByPage)

  return dependencies
}
