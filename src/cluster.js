const cluster = require('cluster')

global.config = require('./config')
const run = require('./tasks')

const App = require('./modules/app')

let lastArgs
let currentWorker = null
const runCluster = cmds => {
  if (cluster.isMaster) {
    currentWorker = cluster.fork()

    cluster.on('message', (worker, msg) => {
      if (msg.evt === 'change') {
        // files have changed, restart worker
        currentWorker.kill(1)
        currentWorker = cluster.fork()
      } else if (msg.evt === 'error') {
        console.log('error', msg.error)
        setTimeout(() => {
          currentWorker = cluster.fork()
        }, 1000)
      }
    })

    cluster.on('exit', (worker, code, signal) => {
      console.log('exit', code)
    })
    cluster.on('death', worker => {
      console.log('Worker ' + worker.pid + ' died.');
    })
  } else if (cluster.isWorker) {
    run(App, cmds)

    process
      .on('unhandledRejection', (a) => {
        console.log({ a })
        // if (lastArgs !== args) {
        //   console.log('unhandledRejection', args)
        //   lastArgs = args
        // }

        process.send({ evt: 'error', error: a })
      })
      .on('uncaughtException', (...args) => {
        if (lastArgs !== args) {
          console.log('uncaughtException', ...args)
          lastArgs = args
        }

        process.send({ evt: 'error' })
      })
  }
}

module.exports = runCluster
