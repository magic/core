import http from 'http'

import error from '@magic/error'
import log from '@magic/log'

import { handler } from './handler.mjs'

export const startServer = async (server, options) => {
  try {
    server.listen(options)

    // await a thenable async/await struct
    // this "promise" waits for the server either erroring or starting to listen
    await {
      then(r, f) {
        server.on('listening', r)
        server.on('error', f)
      },
    }
  } catch (e) {
    // if the requested port is in use,
    // increment portnumber by 1, then retry starting the server
    if (e.code === 'EADDRINUSE') {
      options.port += 1
    } else {
      throw error(e)
    }

    return startServer(server, options)
  }

  return options
}

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
    log.error(e)
  }

  return server
}

export default serve
