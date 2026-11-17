import fs from '@magic/fs'
import { is, tryCatch } from '@magic/test'

import { getPages } from '../../src/lib/getPages.mjs'

const tmpDir = '/tmp/magic-test-getpages'

export default {
  beforeAll: async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    await fs.mkdir(tmpDir)
    await fs.mkdir(`${tmpDir}/pages`)
    await fs.writeFile(`${tmpDir}/pages/index.mjs`, 'export default () => {}')
    await fs.writeFile(`${tmpDir}/pages/about.mjs`, 'export default () => {}')

    return async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: async () => (await getPages({ dir: `${tmpDir}/pages`, root: '/tmp' })).length >= 2,
      expect: true,
      info: 'getPages returns files from an existing directory',
    },
    {
      fn: async () =>
        (await getPages({ dir: `${tmpDir}/pages`, root: '/tmp' })).some(f =>
          f.includes('index.mjs'),
        ),
      expect: true,
      info: 'getPages includes index.mjs',
    },
    {
      fn: tryCatch(getPages, { dir: `${tmpDir}/nope`, root: '/tmp' }),
      expect: is.error,
      info: 'getPages throws for missing dir under root',
    },
    {
      fn: tryCatch(getPages, { dir: '/no/such/place', root: '/tmp' }),
      expect: is.error,
      info: 'getPages rethrows for missing dir outside root',
    },
  ],
}
