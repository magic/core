import http from 'http'

import log from '@magic/log'

import handler from './handler.mjs'

// return a thenable async/await struct
export const listen = async server =>
  await {
    then(r, f) {
      server.on('listening', r)
      server.on('error', f)
    },
  }

export const startServer = async (server, options) => {
  try {
    server.listen(options)
    await listen(server)
  } catch (e) {
    if (e.code === 'EADDRINUSE') {
      options.port += 1
    } else {
      throw e
    }

    return startServer(server, options)
  }

  return options
}

export const serve = async app => {
  const handle = await handler(app)

  const server = http.createServer(handle)

  const options = {
    port: config.PORT,
    host: config.HOST,
    // do not make other workers listen to the same port
    // exclusive: true,
  }

  try {
    const { port, host } = await startServer(server, options)
    if (port !== config.PORT) {
      log.warn('Address in use', `incrementing port to ${port}...`)
    }
    log(`listening to http://${host}:${port}${config.WEB_ROOT}`)
  } catch (e) {
    log.error(e)
  }

  return server
}

export default serve
