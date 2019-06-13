import log from '@magic/log'

import { getGitConfig, xc } from '../../lib/index.mjs'

export const publish = async config => {
  const git = await getGitConfig(config)
  const outDir = config.DIR.PUBLIC.replace(`${process.cwd()}/`, '')

  const cmdPrefix = `--prefix=${outDir}`
  const cmdOnto = `--onto=${git.ORIGIN}/${git.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree split ${cmdArgv}`

  log.time(cmd)
  const { stdout } = await xc(cmd)
  const id = stdout.trim()
  log.timeEnd(cmd)

  const pushCommand = `git push ${git.ORIGIN} ${id.trim()}:${git.BRANCH}`
  log.time(pushCommand)
  await xc(pushCommand)
  log.timeEnd(pushCommand)
}

export default publish
