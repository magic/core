import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'path'

import fs from '@magic/fs'
import { is } from '@magic/test'

import { watch } from '../../src/cluster/index.mjs'

const base = path.join(process.cwd(), '.test-cluster-watch-tmp')

/**
 * The test worker is shared with other suites, so the watcher fakes
 * delegate everything that is not part of this test's temp dir.
 */
let armed = false
/** @type {Set<string>} */
let fakedDirs = new Set()
/** @type {string} */
let fakedFile = ''

/** @type {{ dir: string, cb: (evt: unknown, file?: unknown) => void }[]} */
let sink = []

const origWatch = fs.watch
const origWatchFile = fs.watchFile
const origGetDirectories = fs.getDirectories

const beforeAll = async () => {
  await rm(base, { recursive: true, force: true })
  await mkdir(base, { recursive: true })
  // the extra watch dirs must exist, as tasks.watch stats every dir
  // and rejects on a missing one
  await mkdir(path.join(base, 'static'), { recursive: true })
  await mkdir(path.join(base, 'extra'), { recursive: true })
  await mkdir(path.join(base, 'one'), { recursive: true })
  await mkdir(path.join(base, 'two'), { recursive: true })
  await writeFile(path.join(base, 'magic.mjs'), 'export default {}')
  armed = true
  fs.watch = (/** @type {any} */ dir, cb) => {
    if (armed && fakedDirs.has(dir)) {
      sink.push({ dir, cb })
      return { close: () => {} }
    }
    return origWatch(dir, cb)
  }
  fs.watchFile = (/** @type {any} */ file, cb) => {
    if (armed && file === fakedFile) {
      sink.push({ dir: file, cb })
      return { close: () => {} }
    }
    return origWatchFile(file, cb)
  }
  fs.getDirectories = (/** @type {any} */ dir, /** @type {any} */ opts) => {
    if (armed && fakedDirs.has(dir)) {
      return Promise.resolve([])
    }
    return origGetDirectories(dir, opts)
  }
}

const afterAll = async () => {
  armed = false
  fs.watch = origWatch
  fs.watchFile = origWatchFile
  fs.getDirectories = origGetDirectories
  await rm(base, { recursive: true, force: true })
}

const wait = () => new Promise(resolve => setTimeout(resolve, 100))

const arm = () => {
  fakedDirs = new Set([
    base,
    path.join(base, 'static'),
    path.join(base, 'extra'),
    path.join(base, 'one'),
    path.join(base, 'two'),
  ])
  fakedFile = path.join(base, 'magic.mjs')
  sink = []
}

export default {
  beforeAll,
  afterAll,
  tests: [
    {
      // the checks run one after another in a single test,
      // as the suite tests run in parallel and would race on the fakes
      fn: async () => {
        // no extra watch dirs: root and the config file are watched,
        // static is only added when extra watch dirs are given
        arm()
        watch({
          args: {},
          ROOT: base,
          CONFIG_FILE_PATH: path.join(base, 'magic.mjs'),
          STATIC: path.join(base, 'static'),
        })
        await wait()
        const noExtra = sink.map(w => w.dir)
        const rootOk =
          noExtra.includes(base) &&
          noExtra.includes(path.join(base, 'magic.mjs')) &&
          !noExtra.includes(path.join(base, 'static'))

        // a single extra watch dir as a string, static is included
        sink = []
        watch({
          args: { watch: path.join(base, 'extra') },
          ROOT: base,
          CONFIG_FILE_PATH: path.join(base, 'magic.mjs'),
          STATIC: path.join(base, 'static'),
        })
        await wait()
        const stringExtra = sink.map(w => w.dir)
        const strOk =
          stringExtra.includes(path.join(base, 'extra')) &&
          stringExtra.includes(path.join(base, 'static'))

        // multiple extra watch dirs as an array
        sink = []
        watch({
          args: { watch: [path.join(base, 'one'), path.join(base, 'two')] },
          ROOT: base,
          CONFIG_FILE_PATH: path.join(base, 'magic.mjs'),
          STATIC: [path.join(base, 'static')],
        })
        await wait()
        const arrayExtra = sink.map(w => w.dir)
        const arrOk =
          arrayExtra.includes(path.join(base, 'one')) && arrayExtra.includes(path.join(base, 'two'))

        // file change events are forwarded to the primary
        const w = sink[0]
        /** @type {unknown} */
        let message
        process.send = msg => {
          message = msg
        }
        try {
          w.cb('change', 'file.js')
          return (
            rootOk &&
            strOk &&
            arrOk &&
            is.obj(message) &&
            /** @type {string} */ (/** @type {any} */ (message).evt) === 'change' &&
            /** @type {string} */ (/** @type {any} */ (message).file).includes('file.js')
          )
        } finally {
          delete process.send
        }
      },
      expect: true,
      info: 'watch watches root, extra dirs and the config file, forwarding changes to the primary',
    },
  ],
}
