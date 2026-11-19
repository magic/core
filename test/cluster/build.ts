import type { Config } from '../../src/types.mjs'

import { build } from '../../src/cluster/build.mjs'

/**
 * the real config of this package - used for the full pipeline run
 */
const getRealConfig = async (): Promise<Config> => {
  const { runConfig } = await import('../../src/config.mjs')
  const config = await runConfig({ noCheckLinks: true })
  if (!config) {
    throw new Error('no config found')
  }
  return config
}

export default [
  {
    fn: async () => {
      // no build and no serve: prepare + transpile run, then the worker quits
      const config = await getRealConfig()
      const result = await build({ commands: { build: false, serve: false }, config })
      // build never throws, it logs errors
      return result === undefined
    },
    expect: true,
    info: 'build runs the prepare and transpile pipeline without writing',
    timeout: 120000,
  },
  {
    fn: async () => {
      // a broken config makes the pipeline fail, build catches and logs it
      const result = await build({
        commands: { build: true, serve: false },
        config: {
          ROOT: '/nonexistent-magic-test',
          DIR: {
            PAGES: '/nonexistent-magic-test/pages',
            PUBLIC: '/nonexistent-magic-test/public',
            ASSETS: '/nonexistent-magic-test/assets',
            STATIC: '/nonexistent-magic-test/assets/static',
            MODULES: '/nonexistent-magic-test/modules',
            THEMES: '/nonexistent-magic-test/assets/themes',
            API: '/nonexistent-magic-test/api',
            LIB: ['/nonexistent-magic-test/lib'],
          },
          CLIENT_LIB_NAME: 'magic',
          WEB_ROOT: '/x/',
          THEME: [],
          NODE_MODULES: '/nonexistent-magic-test/node_modules',
          BLOG_DIR: undefined,
          TMP_DIR: '/nonexistent-magic-test/.tmp',
        } as unknown as Config,
      })
      return result === undefined
    },
    expect: true,
    info: 'build catches pipeline errors instead of throwing',
    timeout: 120000,
  },
]
