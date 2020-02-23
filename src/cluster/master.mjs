import log from '@magic/log'

import { runCmd } from './runCmd.mjs'

export const master = async ({ cluster, commands, config }) => {
  if (config.URL_WARNING) {
    log.warn('Autodetected URL:', `https://${config.URL}`)
    log.info(`
  to hide this warning and make startup ${config.URL_WARNING}ms faster,
  add the following to your config.mjs file (and adjust the values if needed)

  URL: '${config.URL}',
  WEB_ROOT: '${config.WEB_ROOT}',
  `)
  }

  if (commands.clean) {
    await runCmd('clean', config)
  }

  if (commands.connect) {
    await runCmd('connect', config)
  }

  if (commands.publish) {
    await runCmd('publish', config)
  }

  const bail = !commands.build && !commands.serve

  if (bail) {
    return
  }

  let watchWorker
  if (commands.serve) {
    watchWorker = cluster.fork()
  }
  let buildWorker = cluster.fork()

  let lastCall = new Date().getTime()
  cluster.on('message', (worker, msg) => {
    if (watchWorker && worker.id === watchWorker.id) {
      const { evt } = msg
      const isChangeEvent = ['change', 'rename', 'delete'].includes(evt)

      if (isChangeEvent) {
        const now = new Date().getTime()
        const delay = now - lastCall
        lastCall = now
        if (delay > 10) {
          // files have changed, restart build worker
          buildWorker.kill(1)
          buildWorker = cluster.fork()
        }
      } else {
        log.warn('Unexpected message from watch worker', msg)
      }
    } else if (worker.id === buildWorker.id) {
      if (msg.evt === 'quit') {
        log('quit event received')
        process.exit()
      } else {
        log.warn('Unexpected message from build worker', msg)
      }
    }

    if (msg.evt === 'error') {
      log.error(msg.error)
    }
  })

  cluster.on('exit', (worker, code, signal) => {
    if (code !== null && code !== 0) {
      log('exit', code)
      process.exit(code)
    }
  })
}
