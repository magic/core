import { rm, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'path'

import { is } from '@magic/test'

import { clean } from '../../../src/tasks/clean/index.mjs'

const tmpDir = path.join(process.cwd(), '.test-clean-tmp')

/** @param {string} p */
const exists = async p => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

export default {
  afterAll: async () => {
    await rm(tmpDir, { recursive: true, force: true })
  },
  tests: [
    {
      fn: async () => {
        await clean(undefined)
        return true
      },
      expect: true,
      info: 'clean does nothing for undefined dir',
    },
    {
      fn: async () => {
        await clean('')
        return true
      },
      expect: true,
      info: 'clean does nothing for empty dir',
    },
    {
      fn: async () => {
        const dir = path.join(tmpDir, 'sub')
        await rm(tmpDir, { recursive: true, force: true })
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'file.txt'), 'x')
        await clean(dir)
        return !(await exists(dir))
      },
      expect: true,
      info: 'clean removes an existing directory',
    },
    {
      fn: async () => {
        try {
          await clean('/tmp/somewhere-outside')
          return false
        } catch (e) {
          return is.error(e) && e.message.includes('TRIED DELETING OUTSIDE OF CWD')
        }
      },
      expect: true,
      info: 'clean throws when the dir is outside of cwd',
    },
  ],
}
