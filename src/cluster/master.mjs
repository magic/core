import log from '@magic/log'
import { runCmd } from './runCmd.mjs'

export const master = async (cluster, cmds, argv, config) => {
  if (config.URL_WARNING) {
    log.warn('Autodetected URL:', `https://${config.URL}`)
    log.info(`
  to hide this warning and make startup ${config.URL_WARNING}ms faster,
  add the following to your config.mjs file (and adjust the values if needed)

  URL: '${config.URL}',
  WEB_ROOT: '${config.WEB_ROOT}',
  `)
  }

  if (cmds.clean) {
    await runCmd('clean', config)
  }

  if (cmds.connect) {
    await runCmd('connect', config)
  }

  if (cmds.publish) {
    await runCmd('publish', config)
  }

  const bail = !cmds.build && !cmds.serve

  if (bail) {
    return
  }
  let watchWorker
  if (cmds.serve) {
    watchWorker = cluster.fork()
  }
  let buildWorker = cluster.fork()

  let lastCall = new Date().getTime()
  cluster.on('message', (worker, msg) => {
    if (watchWorker && worker.id === watchWorker.id) {
      if (msg.evt === 'change' || msg.evt === 'rename') {
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
    }
  })
}
