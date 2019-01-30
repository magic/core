const log = require('@magic/log')

const xc = require('../lib/xc')

const getGitConfig = async () => {
  if (config.GIT && config.GIT.ORIGIN) {
    if (!config.GIT.BRANCH) {
      config.GIT.BRANCH = 'gh-pages'
    }
    return config.GIT
  }

  log.info('config.GIT missing ORIGIN')
  const git = config.GIT || {}

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
}

module.exports = getGitConfig
