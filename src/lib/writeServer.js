const path = require('path')

const mkdirp = require('./mkdirp')
const fs = require('./fs')

const writeLambda = async ([name, fn]) => {
  const content = `const lambda = ${fn.toString()}

module.exports = (req, res) => {
  req.body = ''
  req.on('data', chunk => req.body += chunk)
  req.on('end', (...args) => lambda(req, res, ...args))
}`

  await fs.writeFile(name + '.js', content)
}

module.exports = async app => {
  const lambdas = Object.entries(app.lambdas)
  if (lambdas.length) {
    const apiDir = config.DIR.API || path.join(process.cwd(), 'api')
    await mkdirp(apiDir)

    await Promise.all(lambdas.map(([name, val]) => [path.join(apiDir, name), val]).map(writeLambda))
  }
}
