import fs from '@magic/fs'
import { is, tryCatch } from '@magic/test'

import { getBlog } from '../../src/lib/getBlog.mjs'

const tmpDir = '/tmp/magic-test-getblog'

export default {
  beforeAll: async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    await fs.mkdir(tmpDir)
    await fs.mkdir(`${tmpDir}/blog`)
    await fs.writeFile(`${tmpDir}/blog/post-1.mjs`, 'export default () => {}')

    return async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: () => getBlog({}),
      expect: undefined,
      info: 'getBlog returns undefined without BLOG_DIR',
    },
    {
      fn: async () =>
        (await getBlog({ BLOG_DIR: `${tmpDir}/blog`, ROOT: '/tmp' })).some(f =>
          f.includes('post-1.mjs'),
        ),
      expect: true,
      info: 'getBlog returns blog post files',
    },
    {
      fn: tryCatch(getBlog, { BLOG_DIR: `${tmpDir}/blog/post-1.mjs`, ROOT: '/tmp' }),
      expect: is.error,
      info: 'getBlog throws when BLOG_DIR is a file under root',
    },
    {
      fn: tryCatch(getBlog, { BLOG_DIR: `${tmpDir}/blog/post-1.mjs`, ROOT: '/nonexistent-root' }),
      expect: is.error,
      info: 'getBlog rethrows when BLOG_DIR is a file outside root',
    },
  ],
}
