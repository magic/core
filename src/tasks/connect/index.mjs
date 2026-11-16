import log from '@magic/log'

import { getGitConfig, xc } from '../../lib/index.mjs'

/**
 * @param {{ DIR: { PUBLIC: string }, GIT?: { ORIGIN?: string, BRANCH?: string, [key: string]: unknown } }} params
 * @returns {Promise<void>}
 */
export const connect = async ({ DIR, GIT }) => {
  const startTime = log.hrtime()

  const git = (await getGitConfig(GIT)) ?? {}

  const dir = DIR.PUBLIC.replace(`${process.cwd()}/`, '')
  const cmdPrefix = `--prefix=${dir}`
  const cmdOnto = `${git.ORIGIN} ${git.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  await xc(cmd)

  log.timeTaken(startTime, cmd)
}

export default connect
