import log from '@magic/log'

import { xc } from '../lib/xc.mjs'

/**
 * @param {{ ORIGIN?: string, BRANCH?: string, [key: string]: unknown }} [GIT]
 * @returns {Promise<{ ORIGIN?: string, BRANCH?: string } | undefined>}
 */
export const getGitConfig = async GIT => {
  if (GIT && GIT.ORIGIN) {
    if (!GIT.BRANCH) {
      GIT.BRANCH = 'gh-pages'
    }
    return GIT
  }

  log.info('GIT missing ORIGIN')
  /** @type {{ ORIGIN?: string, BRANCH?: string }} */
  const git = GIT || {}

  const data = await xc('git remote -v')
  if (data.stdout) {
    const originLine = data.stdout.split('\n')[1] ?? ''

    git.ORIGIN = originLine.split('\t')[1]?.replace('(push)', '').trim()
    git.BRANCH = git.BRANCH || 'gh-pages'
    return git
  }
}
