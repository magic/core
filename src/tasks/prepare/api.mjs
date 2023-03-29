import path from 'path'

import fs from '@magic/fs'

import { saveImport } from '../../lib/index.mjs'

export const prepareApi = async (app, config) => {
  const { API_DIR: apiDir, DIR } = config
  const apiDirResolved = DIR.API

  const moduleLambdas = Object.entries(app.modules)
    .filter(([_, dep]) => dep.server)
    .map(([name, dep]) => [name.toLowerCase(), dep.server])

  const pageLambdas = app.pages
    // filter out pages that do not have a server property.
    .filter(page => page.server)
    // pages can only have one lambda attached.
    .map(page => [page.name.toLowerCase(), page.server])

  let apiLambdas = []

  if (apiDir) {
    const apiLambdaFiles = await fs.getFiles(apiDirResolved)

    apiLambdas = await Promise.all(
      apiLambdaFiles.map(async file => {
        if (file.endsWith('.mjs')) {
          const { default: lambda } = await saveImport(file)
          const name = path.basename(file, '.mjs')
          return [name, lambda]
        }
      }),
    )
  }

  const api = Object.fromEntries([
    // first, load lambdas from the api dir
    ...apiLambdas,
    // then, get lambdas from modules
    ...moduleLambdas,
    // overwrite those with the lambdas in pages
    ...pageLambdas,
    // and, finally, get the lambdas in app.mjs.
    ...Object.entries(app.server),
  ])

  return api
}
