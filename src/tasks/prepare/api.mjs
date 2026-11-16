import path from 'path'

import fs from '@magic/fs'
import is from '@magic/types'

import { saveImport } from '../../lib/index.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<Record<string, unknown>>}
 */
export const prepareApi = async (app, config) => {
  const { API_DIR: apiDir, DIR } = config
  const apiDirResolved = DIR.API

  const moduleLambdas = Object.entries(app.modules ?? {})
    .filter(([_, dep]) => !!(/** @type {Record<string, unknown>} */ (dep).server))
    .map(([name, dep]) => [name.toLowerCase(), /** @type {Record<string, unknown>} */ (dep).server])

  const pageLambdas = (app.pages ?? [])
    // filter out pages that do not have a server property.
    .filter(page => !!page.server)
    // pages can only have one lambda attached.
    .map(page => [String(page.name).toLowerCase(), page.server])

  /** @type {[string, unknown][]} */
  let apiLambdas = []

  if (apiDir) {
    const apiLambdaFiles = await fs.getFiles(apiDirResolved)

    const lambdasRaw = await Promise.all(
      apiLambdaFiles.map(async file => {
        if (file.endsWith('.mjs')) {
          const imported = await saveImport(file)
          const lambda = imported instanceof Error ? undefined : imported.default
          const name = path.basename(file, '.mjs')
          return [name, lambda]
        }
      }),
    )
    apiLambdas = /** @type {[string, unknown][]} */ (lambdasRaw.filter(lambda => is.array(lambda)))
  }

  const api = Object.fromEntries([
    // first, load lambdas from the api dir
    ...apiLambdas,
    // then, get lambdas from modules
    ...moduleLambdas,
    // overwrite those with the lambdas in pages
    ...pageLambdas,
    // and, finally, get the lambdas in app.mjs.
    ...Object.entries(app.server ?? {}),
  ])

  return api
}
