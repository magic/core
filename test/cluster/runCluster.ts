import cluster from 'cluster'

import { is } from '@magic/test'

import { runCluster } from '../../src/runCluster.mjs'

const clusterProps = {
  isPrimary: cluster.isPrimary,
  isMaster: cluster.isMaster,
  isWorker: cluster.isWorker,
  worker: cluster.worker,
}

const restoreCluster = () => {
  cluster.isPrimary = clusterProps.isPrimary
  cluster.isMaster = clusterProps.isMaster
  cluster.isWorker = clusterProps.isWorker
  cluster.worker = clusterProps.worker
}

export default [
  {
    // the checks run one after another in a single test,
    // as the suite tests run in parallel and share the cluster module
    fn: async () => {
      // the primary process with no command just warns
      if (cluster.isPrimary) {
        await runCluster({ args: { 'no-check-links': true }, commands: {} })
      }

      // a worker that is not the watcher runs the build pipeline;
      // the build finishes by sending a quit message to the primary
      cluster.isPrimary = false
      cluster.isMaster = false
      cluster.isWorker = true
      cluster.worker = { id: 2 }
      /** @type {string[]} */
      const messages = []
      process.send = msg => {
        messages.push(/** @type {{ evt?: string }} */ (msg)?.evt ?? 'unknown')
      }
      try {
        await runCluster({ args: { 'no-check-links': true }, commands: {} })
      } finally {
        restoreCluster()
      }
      // give the fire-and-forget build a moment to start
      await new Promise(resolve => setTimeout(resolve, 200))

      // worker errors are forwarded to the primary via process.send.
      // the runCluster handler is the listener that mentions process.send;
      // the runner's own handlers would exit the test worker,
      // so only that one is called
      const handler = process
        .listeners('unhandledRejection')
        .find(l => String(l).includes('process.send'))
      if (!is.fn(handler)) {
        return false
      }
      /** @type {unknown} */
      let message
      process.send = msg => {
        message = msg
      }
      try {
        ;/** @type {(err: unknown) => void} */ (handler)(new Error('test rejection'))
        return (
          is.obj(message) &&
          /** @type {{ evt: string }} */ (message).evt === 'error' &&
          /** @type {string} */ (/** @type {any} */ (message).error).includes('test rejection')
        )
      } finally {
        delete process.send
        process.exitCode = undefined
      }
    },
    expect: true,
    info: 'runCluster runs primary, the worker build and forwards worker errors',
    timeout: 180000,
  },
]
