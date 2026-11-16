import path from 'path'

import fs from '@magic/fs'

import { stringifyObject } from '../../lib/stringifyObject.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * @param {[string, string]} params
 * @returns {Promise<void>}
 */
export const writeLambda = async ([name, content]) => {
  await fs.writeFile(name + '.mjs', content)
}

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<void>}
 */
export const writeServer = async (app, config) => {
  const lambdas = Object.entries(app.lambdas ?? {})

  if (lambdas.length) {
    const apiDir = config.DIR.API || path.join(process.cwd(), 'api')
    await fs.mkdirp(apiDir)

    /** @type {[string, string][]} */
    const wrappedLambdas = lambdas.map(([name, fn]) => [
      path.join(apiDir, name),
      `export default ${stringifyObject(fn, false)}`,
    ])

    await Promise.all(wrappedLambdas.map(writeLambda))
  }
}
