import log from '@magic/log'

import { xc } from '../lib/xc.mjs'

export const getGitConfig = async (config = {}) => {
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
    git.ORIGIN = data.stdout.split('\n')[1].split('\t')[1].replace('(push)', '').trim()

    git.BRANCH = git.BRANCH || 'gh-pages'
    return git
  }
}
