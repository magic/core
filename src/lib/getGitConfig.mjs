import log from '@magic/log'

import { xc } from '../lib/xc.mjs'

export const getGitConfig = async GIT => {
  if (GIT && GIT.ORIGIN) {
    if (!GIT.BRANCH) {
      GIT.BRANCH = 'gh-pages'
    }
    return GIT
  }

  log.info('GIT missing ORIGIN')
  const git = GIT || {}

  const data = await xc('git remote -v')
  if (data.stdout) {
    git.ORIGIN = data.stdout.split('\n')[1].split('\t')[1].replace('(push)', '').trim()

    git.BRANCH = git.BRANCH || 'gh-pages'
    return git
  }
}
