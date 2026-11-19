import { getGitConfig } from '../../src/lib/getGitConfig.mjs'

export default [
  {
    fn: () => getGitConfig({ ORIGIN: 'git@github.com:user/repo.git' }),
    expect: { ORIGIN: 'git@github.com:user/repo.git', BRANCH: 'gh-pages' },
    info: 'getGitConfig defaults BRANCH to gh-pages',
  },
  {
    fn: () => getGitConfig({ ORIGIN: 'origin', BRANCH: 'main' }),
    expect: { ORIGIN: 'origin', BRANCH: 'main' },
    info: 'getGitConfig keeps existing BRANCH',
  },
  {
    fn: getGitConfig(undefined),
    expect: o =>
      o !== undefined &&
      typeof o.ORIGIN === 'string' &&
      o.ORIGIN.length > 0 &&
      o.BRANCH === 'gh-pages',
    info: 'getGitConfig reads git remote -v from the current repo',
  },
]
