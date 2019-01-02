const log = require('@magic/log')

const xc = require('../lib/xc')

const getGitConfig = async () => {
  if (config.GIT && config.GIT.ORIGIN) {
    return config.GIT
  }

  log.info('config.GIT missing ORIGIN')
  const git = config.GIT || {}

  try {
    const data = await xc('git remote -v')
    if (data.stdout) {
      git.ORIGIN = data.stdout
        .split('\n')[1]
        .split('\t')[1]
        .replace('(push)', '')
        .trim()

      git.BRANCH = git.BRANCH || 'gh-pages'
      return git
    }
  } catch (e) {
    throw e
  }
}

module.exports = getGitConfig
