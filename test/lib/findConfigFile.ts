import fs from '@magic/fs'
import log from '@magic/log'
import { mock } from '@magic/test'

import { findConfigFile } from '../../src/lib/findConfigFile.mjs'

const tmpDir = '/tmp/magic-test-findconfig'
const configNames = ['magic.js', 'magic.cjs', 'magic.mjs']
const oldName = 'config.mjs'

/** the spy needs an indexable object, the log interface is not one */
const silentLog = log as unknown as Record<string, unknown>

const withSilentLog = async (fn: () => Promise<unknown>) => {
  const spy = mock.spy(silentLog, 'error', () => {})
  const warn = mock.spy(silentLog, 'warn', () => {})
  try {
    return await fn()
  } finally {
    spy.mockRestore()
    warn.mockRestore()
  }
}

export default {
  beforeAll: async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    await fs.mkdir(tmpDir)
    await fs.mkdir(`${tmpDir}/one`)
    await fs.writeFile(`${tmpDir}/one/magic.js`, 'export default {}')

    await fs.mkdir(`${tmpDir}/old`)
    await fs.writeFile(`${tmpDir}/old/config.mjs`, 'export default {}')

    await fs.mkdir(`${tmpDir}/multi`)
    await fs.writeFile(`${tmpDir}/multi/magic.js`, 'export default {}')
    await fs.writeFile(`${tmpDir}/multi/magic.cjs`, 'module.exports = {}')

    await fs.mkdir(`${tmpDir}/none`)

    return async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: () => findConfigFile(`${tmpDir}/one`, configNames, oldName),
      expect: (s: string | undefined) => typeof s === 'string' && s.endsWith('magic.js'),
      info: 'findConfigFile finds magic.js',
    },
    {
      fn: () => withSilentLog(() => findConfigFile(`${tmpDir}/old`, configNames, oldName)),
      expect: (s: string | undefined) => typeof s === 'string' && s.endsWith('config.mjs'),
      info: 'findConfigFile falls back to old config.mjs',
    },
    {
      fn: () => withSilentLog(() => findConfigFile(`${tmpDir}/multi`, configNames, oldName)),
      expect: (s: string | undefined) =>
        typeof s === 'string' && (s.endsWith('magic.js') || s.endsWith('magic.cjs')),
      info: 'findConfigFile warns but returns a config when multiple exist',
    },
    {
      fn: () => withSilentLog(() => findConfigFile(`${tmpDir}/none`, configNames, oldName, true)),
      expect: undefined,
      info: 'findConfigFile returns undefined when silent and no config found',
    },
  ],
}
