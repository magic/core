import path from 'path'

import fs from '@magic/fs'

import { stringifyObject } from '../../lib/stringifyObject.mjs'

export const writeLambda = async ([name, content]) => {
  await fs.writeFile(name + '.mjs', content)
}

export const writeServer = async app => {
  const lambdas = Object.entries(app.lambdas)

  if (lambdas.length) {
    const apiDir = config.DIR.API || path.join(process.cwd(), 'api')
    await fs.mkdirp(apiDir)

    const wrappedLambdas = lambdas.map(([name, fn]) => [
      path.join(apiDir, name),
      `export default ${stringifyObject(fn, false)}`,
    ])

    await Promise.all(wrappedLambdas.map(writeLambda))
  }
}
