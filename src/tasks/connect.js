// git subtree push --prefix example/public origin gh-pages
const log = require('@magic/log')
const { getGitConfig, xc } = require('../lib/')

const connect = async () => {
  const git = await getGitConfig()
  console.log({ git })

  // const outDir = OUT_DIR.replace(`${process.cwd()}/`, '')
  const dir = config.DIR.PUBLIC.replace(`${process.cwd()}/`, '')
  const cmdPrefix = `--prefix=${dir}`
  const cmdOnto = `${git.ORIGIN} ${git.BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  try {
    console.time(cmd)
    await xc(cmd)
    console.timeEnd(cmd)
  } catch (e) {
    throw e
  }
}

module.exports = connect
