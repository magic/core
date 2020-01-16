import log from '@magic/log'

import { getGitConfig, xc } from '../../lib/index.mjs'

export const connect = async config => {
  const startTime = log.hrtime()

  const git = await getGitConfig(config)

  const dir = config.DIR.PUBLIC.replace(`${process.cwd()}/`, '')
  const cmdPrefix = `--prefix=${dir}`
  const cmdOnto = `${git.ORIGIN} ${git.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  await xc(cmd)

  log.timeTaken(startTime, cmd)
}

export default connect
