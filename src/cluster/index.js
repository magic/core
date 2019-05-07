const cluster = require('cluster')
const path = require('path')

const log = require('@magic/log')
const is = require('@magic/types')

global.config = require('../config')
global.CHECK_PROPS = require('../tasks/prepare/lib/CHECK_PROPS')
const tasks = require('../tasks')
const App = require('../modules/app')

const runCmd = require('./runCmd')

const runCluster = async ({ cmds, argv }) => {
  process
    .on('unhandledRejection', error => {
      process.send({ evt: 'error', error: error.toString() })
    })
    .on('uncaughtException', error => {
      process.send({ evt: 'error', error: error.toString() })
    })

  if (cluster.isMaster) {
    if (cmds.clean) {
      await runCmd('clean')
    }

    if (cmds.connect) {
      await runCmd('connect')
    }

    if (cmds.publish) {
      await runCmd('publish')
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
    buildWorker.send('run')

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
  } else if (cluster.isWorker) {
    if (cmds.serve && cluster.worker.id === 1) {
      const watchDirs = argv['--watch']
      let dirs = [config.ROOT]
      if (is.array(watchDirs) && !is.empty(watchDirs)) {
        dirs = [...dirs, ...watchDirs]
      }
      const cwd = process.cwd()
      dirs = dirs.map(dir => (dir.startsWith(cwd) ? dir : path.join(cwd, dir)))
      tasks.watch(dirs)
    } else {
      const app = await runCmd('prepare', App)

      const { pages, bundle, css } = await runCmd('transpile', app)
      app.pages = pages
      app.client.bundle = bundle
      app.css = css

      if (cmds.build) {
        await runCmd('write', app)
      }

      if (cmds.serve) {
        tasks.serve(app)
      } else {
        process.send({ evt: 'quit' })
      }
    }
  }
}

module.exports = runCluster
