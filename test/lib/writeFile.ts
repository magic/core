import type { Config } from '../../src/types.mjs'

import fs from '@magic/fs'

import { writeFile } from '../../src/lib/writeFile.mjs'

const tmpDir = '/tmp/magic-test-writefile'

export default {
  beforeAll: async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    await fs.mkdir(tmpDir)
    await fs.mkdir(`${tmpDir}/css`)
    return async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: async () => {
        await writeFile(['index.html', '<html>hello</html>'], {
          DIR: { PUBLIC: tmpDir },
        } as unknown as Config)
        return await fs.readFile(`${tmpDir}/index.html`, 'utf-8')
      },
      expect: '<html>hello</html>',
      info: 'writeFile writes content to config.DIR.PUBLIC',
    },
    {
      fn: async () => {
        await writeFile(['css/style.css', 'body {}'], {
          DIR: { PUBLIC: tmpDir },
        } as unknown as Config)
        return await fs.readFile(`${tmpDir}/css/style.css`, 'utf-8')
      },
      expect: 'body {}',
      info: 'writeFile writes into nested paths',
    },
  ],
}
