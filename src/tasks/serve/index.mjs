import http from 'http'

import error from '@magic/error'
import log from '@magic/log'

import { handler } from './handler.mjs'

/** @import { AppObject, Config, NodeError } from '../../types.mjs' */

const MAX_PORT_RETRIES = 10

/**
 * @param {import('http').Server} server
 * @param {{ port: number, host?: string }} options
 * @param {number} [attempts]
 * @returns {Promise<{ port: number, host?: string }>}
 */
export const startServer = async (server, options, attempts = 0) => {
  // Remove any existing listeners to prevent accumulation
  server.removeAllListeners('listening')
  server.removeAllListeners('error')

  try {
    server.listen(options)

    // await a thenable async/await struct
    // this "promise" waits for the server either erroring or starting to listen
    await /** @type {Promise<unknown>} */ ({
      /**
       * @param {() => void} r
       * @param {(err: Error) => void} f
       */
      then(r, f) {
        server.on('listening', r)
        server.on('error', f)
      },
    })
  } catch (e) {
    // if the requested port is in use,
    // increment portnumber by 1, then retry starting the server
    if (/** @type {NodeError} */ (e).code === 'EADDRINUSE') {
      if (attempts >= MAX_PORT_RETRIES) {
        throw error(`Could not find available port after ${MAX_PORT_RETRIES} attempts`)
      }
      options.port += 1
      return startServer(server, options, attempts + 1)
    } else {
      throw error(/** @type {Error} */ (e))
    }
  }

  return options
}

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<import('http').Server>}
 */
export const serve = async (app, config) => {
  const handle = await handler(app, config)

  const { PORT, HOST, WEB_ROOT } = config

  const server = http.createServer(handle)

  const options = {
    port: PORT,
    host: HOST,
  }

  try {
    const { port, host } = await startServer(server, options)
    if (port !== PORT) {
      log.warn('Address in use', `incrementing port to ${port}...`)
    }

    log(log.paint.green('LISTENING TO'), `http://${host}:${port}${WEB_ROOT}`)
  } catch (e) {
    log.error(/** @type {Error} */ (e))
  }

  return server
}

export default serve
