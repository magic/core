const cluster = require('cluster')

const log = require('@magic/log')

global.config = require('./config')
const tasks = require('./tasks')
const App = require('./modules/app')

const runCmd = async (cmd, ...args) => {
  console.time(cmd)
  const result = await tasks[cmd](...args)
  console.timeEnd(cmd)
  return result
}

const bailEarly = async (cmds) => {
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
  return bail
}

const runCluster = async cmds => {
  if (cluster.isMaster) {
    const bail = await bailEarly(cmds)
    if (bail) {
      return
    }
    let watchWorker
    if (cmds.serve) {
      watchWorker = cluster.fork()
    }
    let buildWorker = cluster.fork()
    buildWorker.send('run')

    let hasTimeout = false
    let lastCall = new Date().getTime()
    cluster.on('message', (worker, msg) => {
      if (watchWorker && worker.id === watchWorker.id) {
        if (msg.evt === 'change') {
          const now = new Date().getTime()
          const delay = now - lastCall
          console.log({ delay })
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
        console.log('exit', code)
      }
    })
  } else if (cluster.isWorker) {
    if (cmds.serve && cluster.worker.id === 1) {
      tasks.watch(config.ROOT)
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

    process
      .on('unhandledRejection', error => {
        process.send({ evt: 'error', error: error.toString() })
      })
      .on('uncaughtException', error => {
        process.send({ evt: 'error', error: error.toString() })
      })
  }
}

module.exports = runCluster
