import { recursivelyResolveDependencies } from '../../lib/swc/recursivelyResolveDependencies.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<Record<string, unknown>>}
 */
export const prepareDependencies = async (app, config) => {
  const dependencies = await recursivelyResolveDependencies({ app, config })
  // console.log(dependencies.modulesByPage)

  return dependencies
}
