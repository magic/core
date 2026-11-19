import { writeFile, rm, access, chmod } from 'node:fs/promises'
import path from 'path'

import { is } from '@magic/test'

import ssl from '../../../src/tasks/serve/createSslCert.mjs'

const url = new URL(import.meta.url)
const serveDir = path.join(path.dirname(url.pathname), '../../../src/tasks/serve')
const privFilename = path.join(serveDir, 'priv.pem')
const certFilename = path.join(serveDir, 'cert.pem')

// these tests create and delete files inside src/tasks/serve,
// serialize the mutations with a promise chain so parallel tests do not interfere
let chain = Promise.resolve()
const lock = (fn: () => Promise<unknown>) => {
  const run = chain.then(fn, fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

const exists = async (p: string) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

type SslResult = { key: Buffer; cert: Buffer }

const withFiles = async (files: [string, string][], fn: () => Promise<unknown>) => {
  return lock(async () => {
    // clean slate
    await rm(privFilename, { force: true })
    await rm(certFilename, { force: true })
    try {
      for (const [file, content] of files) {
        await writeFile(file, content)
      }
      return await fn()
    } finally {
      await rm(privFilename, { force: true })
      await rm(certFilename, { force: true })
    }
  })
}

const FAKE_KEY = 'fake-key-content'
const FAKE_CERT = 'fake-cert-content'

export default [
  {
    fn: async () => {
      const result = (await withFiles(
        [
          [privFilename, FAKE_KEY],
          [certFilename, FAKE_CERT],
        ],
        ssl,
      )) as SslResult | undefined
      const key = result?.key
      const cert = result?.cert
      return (
        is.obj(result) &&
        key !== undefined &&
        cert !== undefined &&
        Buffer.from(key.toString()).toString() === FAKE_KEY &&
        cert.toString() === FAKE_CERT
      )
    },
    expect: true,
    info: 'ssl returns key and cert when both files exist',
  },
  {
    fn: async () => {
      const result = (await withFiles([[privFilename, FAKE_KEY]], ssl)) as SslResult | undefined
      return result === undefined
    },
    expect: true,
    info: 'ssl returns undefined when the cert is missing',
  },
  {
    fn: async () => {
      const result = (await withFiles([[certFilename, FAKE_CERT]], ssl)) as SslResult | undefined
      return result === undefined
    },
    expect: true,
    info: 'ssl returns undefined when the key is missing',
  },
  {
    fn: async () => {
      // both files missing: generates a self signed cert with openssl
      const result = (await withFiles([], ssl)) as SslResult | undefined
      const key = result?.key
      const cert = result?.cert
      return !!key && !!cert && key.length > 100 && cert.length > 100
    },
    expect: true,
    info: 'ssl generates key and cert with openssl when both are missing',
    timeout: 60000,
  },
  {
    fn: async () => {
      // a stat that fails with anything but ENOENT rethrows
      const oldMode = 0o755
      return await lock(async () => {
        await rm(privFilename, { force: true })
        await rm(certFilename, { force: true })
        await chmod(serveDir, 0)
        let threw = false
        try {
          await ssl()
        } catch (e) {
          threw = is.error(e)
        } finally {
          await chmod(serveDir, oldMode)
        }
        return threw
      })
    },
    expect: true,
    info: 'ssl rethrows non-ENOENT stat errors',
  },
  {
    fn: async () => {
      // after the tests the files must be gone;
      // the suite tests run in parallel, so poll for the
      // openssl generation test to finish its cleanup
      for (let i = 0; i < 30; i += 1) {
        const gone = !(await exists(privFilename)) && !(await exists(certFilename))
        if (gone) {
          return true
        }
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      return !(await exists(privFilename)) && !(await exists(certFilename))
    },
    expect: true,
    info: 'ssl test files are cleaned up',
    timeout: 30000,
  },
]
