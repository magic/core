const log = require('@magic/log')

// git subtree push --prefix example/public origin gh-pages
const { getGitConfig, xc } = require('../../lib/')

const connect = async () => {
  const git = await getGitConfig()

  // const outDir = OUT_DIR.replace(`${process.cwd()}/`, '')
  const dir = config.DIR.PUBLIC.replace(`${process.cwd()}/`, '')
  const cmdPrefix = `--prefix=${dir}`
  const cmdOnto = `${git.ORIGIN} ${git.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  log.time(cmd)
  await xc(cmd)
  log.timeEnd(cmd)
}

module.exports = connect
