import { rm, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'path'

import { watch, cleanupWatch } from '../../../src/tasks/watch/index.mjs'

const fileTmpDir = path.join(process.cwd(), '.test-watch-file-tmp')
const dirTmpDir = path.join(process.cwd(), '.test-watch-dir-tmp')

const exists = async (p: string) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

export default {
  afterAll: async () => {
    // watchers (fs.watchFile in particular) keep polling handles alive,
    // so they are closed before the suite ends or the process would hang
    cleanupWatch()
    await rm(fileTmpDir, { recursive: true, force: true })
    await rm(dirTmpDir, { recursive: true, force: true })
  },
  tests: [
    {
      fn: async () => {
        await rm(fileTmpDir, { recursive: true, force: true })
        await mkdir(fileTmpDir, { recursive: true })
        const file = path.join(fileTmpDir, 'file.txt')
        await writeFile(file, 'x')
        await watch([file])
        // watchFile keeps a polling handle; make sure the call resolved
        // and the file is still there
        return exists(file)
      },
      expect: true,
      info: 'watch resolves when watching a file',
    },
    {
      fn: async () => {
        const dir = path.join(dirTmpDir, 'nested', 'deeper')
        await rm(dir, { recursive: true, force: true })
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'inner.txt'), 'x')
        await watch([path.join(dirTmpDir, 'nested')])
        return exists(path.join(dir, 'inner.txt'))
      },
      expect: true,
      info: 'watch resolves when recursively watching directories',
    },
  ],
}
