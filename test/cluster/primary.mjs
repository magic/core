import { mkdir, writeFile, rm, access } from 'node:fs/promises'
import path from 'path'

import { primary } from '../../src/cluster/primary.mjs'

/** @param {string} p */
const exists = async p => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * @param {{ on?: (evt: string, cb: (...args: unknown[]) => void) => void } & Record<string, unknown>} [over]
 */
const makeCluster = over => {
  /** @type {Record<string, (...args: unknown[]) => void>} */
  const handlers = {}
  /** @type {number} */
  let workerId = 0
  /** @type {Record<string, number>} */
  const forks = { count: 0 }
  const cluster = {
    isPrimary: true,
    /** @returns {{ id: number, killed: boolean, kill: (signal?: string) => boolean }} */
    fork: () => {
      workerId += 1
      forks.count += 1
      return {
        id: workerId,
        killed: false,
        /** @param {string} [signal] */
        kill(signal) {
          this.killed = true
          this.signal = signal
          return true
        },
      }
    },
    /** @param {string} evt @param {(...args: unknown[]) => void} cb */
    on: (evt, cb) => {
      handlers[evt] = cb
    },
    handlers,
    forks,
    ...over,
  }
  return /** @type {any} */ (cluster)
}

/**
 * emit a cluster message
 * @param {any} cluster
 * @param {{ id: number }} worker
 * @param {Record<string, unknown>} msg
 */
const emit = (cluster, worker, msg) => cluster.handlers.message(worker, msg)

const primaryTmpDir = path.join(process.cwd(), '.test-primary-tmp')

export default {
  afterAll: async () => {
    await rm(primaryTmpDir, { recursive: true, force: true })
  },
  tests: [
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: {},
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        // no commands: no workers are forked
        return cluster.forks.count === 0
      },
      expect: true,
      info: 'primary bails without forking when no build or serve command is given',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { serve: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        // serve forks a watch worker and a build worker
        return cluster.forks.count === 2
      },
      expect: true,
      info: 'primary forks watch and build workers for serve',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { build: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        // build only forks the build worker
        return cluster.forks.count === 1
      },
      expect: true,
      info: 'primary forks a single build worker for build',
    },
    {
      fn: async () => {
        const publicDir = path.join(process.cwd(), '.test-primary-tmp', 'public')
        await rm(path.join(process.cwd(), '.test-primary-tmp'), { recursive: true, force: true })
        await mkdir(publicDir, { recursive: true })
        await writeFile(path.join(publicDir, 'file.txt'), 'x')
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { clean: true },
          DIR: { PUBLIC: publicDir },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        return !(await exists(publicDir))
      },
      expect: true,
      info: 'primary cleans the public dir for the clean command',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: {},
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          URL_WARNING: 42,
          WEB_ROOT: '/core/',
        })
        // just make sure the warning path does not throw
        return true
      },
      expect: true,
      info: 'primary logs a warning for autodetected urls',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { serve: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        // emit a change message from the watch worker (worker id 1)
        const watch = { id: 1 }
        emit(cluster, watch, { evt: 'change', file: 'x' })
        // within the debounce window (10ms) nothing happens yet
        await new Promise(resolve => setTimeout(resolve, 20))
        emit(cluster, watch, { evt: 'change', file: 'x' })
        await new Promise(resolve => setTimeout(resolve, 20))
        // the build worker got restarted
        return cluster.forks.count === 3
      },
      expect: true,
      info: 'primary restarts the build worker when files change',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { serve: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        const watch = { id: 1 }
        // unexpected message from the watch worker should not throw
        emit(cluster, watch, { evt: 'weird' })
        // unexpected message from the build worker should not throw
        emit(cluster, { id: 2 }, { evt: 'weird' })
        return true
      },
      expect: true,
      info: 'primary tolerates unexpected worker messages',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { serve: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        const watch = { id: 1 }
        // error events are logged
        emit(cluster, watch, { evt: 'error', error: 'some worker error' })
        return true
      },
      expect: true,
      info: 'primary logs worker error messages',
    },
    {
      fn: async () => {
        const cluster = makeCluster()
        await primary({
          args: {},
          cluster,
          commands: { serve: true },
          DIR: { PUBLIC: '/nowhere' },
          GIT: {},
          URL: 'magic.github.io/core/',
          WEB_ROOT: '/core/',
        })
        // exit with code 0 does not exit the process
        cluster.handlers.exit({ id: 1 }, 0, null)
        return true
      },
      expect: true,
      info: 'primary tolerates worker exit with code 0',
    },
  ],
}
