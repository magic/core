// git subtree push --prefix example/public origin gh-pages
const log = require('@magic/log')

const xc = require('../lib/xc')

const connect = async () => {
  const git = {}

  if (!config.GIT || !config.GIT.ORIGIN) {
    log.info('config.GIT missing ORIGIN')
    config.GIT = config.GIT || {}

    try {
      const data = await xc('git remote -v')
      if (data.stdout) {
        config.GIT.ORIGIN = data.stdout
          .split('\n')[1]
          .split('\t')[1]
          .replace('(push)', '')
          .trim()

        config.GIT.BRANCH = config.GIT.BRANCH || 'gh-pages'
      }
    } catch (e) {
      throw e
    }
  }

  // const outDir = OUT_DIR.replace(`${process.cwd()}/`, '')
  const dir = config.DIR.PUBLIC.replace(`${process.cwd()}/`, '')
  const cmdPrefix = `--prefix=${dir}`
  const cmdOnto = `${config.GIT.ORIGIN} ${config.GIT.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  log('exec', cmd)

  try {
    await xc(cmd)
  } catch (e) {
    throw e
  }
}

module.exports = connect
