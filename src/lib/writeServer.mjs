import path from 'path'

import mkdirp from './mkdirp.mjs'
import fs from './fs.mjs'

export const writeLambda = async ([name, fn]) => {
  const content = `const lambda = ${fn.toString()}

export default (req, res) => {
  req.body = ''
  req.on('data', chunk => req.body += chunk)
  req.on('end', (...args) => lambda(req, res, ...args))
}`

  await fs.writeFile(name + '.js', content)
}

export const writeServer = async app => {
  const lambdas = Object.entries(app.lambdas)
  if (lambdas.length) {
    const apiDir = config.DIR.API || path.join(process.cwd(), 'api')
    await mkdirp(apiDir)

    await Promise.all(lambdas.map(([name, val]) => [path.join(apiDir, name), val]).map(writeLambda))
  }
}

export default writeServer
