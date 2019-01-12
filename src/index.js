const cluster = require('cluster')

global.config = require('./config')
const run = require('./tasks')

const App = require('./modules/app')

let currentWorker = null
const runCluster = (cmds) => {
  if (cluster.isMaster) {
    currentWorker = cluster.fork()

    cluster.on('message', (worker, msg) => {
      if (msg.evt === 'change') {
        // files have changed, restart worker
        currentWorker.kill(1)
        currentWorker = cluster.fork()
      }
    })

    cluster.on('exit', (worker, code, signal) => {
      console.log('exit', code)
    })
  } else if (cluster.isWorker) {
    run(App, cmds)

    process
      .on('unhandledRejection', (...args) => {
        console.log('unhandledRejection', ...args)
      })
      .on('uncaughtException', (...args) => {
        console.log('uncaughtException', ...args)
      })
  }
}

module.exports = runCluster
