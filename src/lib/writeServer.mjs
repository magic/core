import path from 'path'

import fs from '@magic/fs'

export const writeLambda = async ([name, fn]) => {
  const content = `const lambda = ${fn.toString()}

  req.body = ''
  req.on('data', chunk => req.body += chunk)
  req.on('end', (...args) => lambda(req, res, ...args))
}`

  await fs.writeFile(name + '.mjs', content)
}

export const writeServer = async app => {
  const lambdas = Object.entries(app.lambdas)
  if (lambdas.length) {
    const apiDir = config.DIR.API || path.join(process.cwd(), 'api')
    await fs.mkdirp(apiDir)

    await Promise.all(lambdas.map(([name, val]) => [path.join(apiDir, name), val]).map(writeLambda))
  }
}
