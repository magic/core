import cluster from 'cluster'

import { is } from '@magic/test'

import { runCluster } from '../../src/runCluster.mjs'

// the cluster module's properties are read-only in the types,
// but the test swaps them to simulate the worker processes
const c = cluster as unknown as Record<string, unknown>

const clusterProps = {
  isPrimary: c.isPrimary,
  isMaster: c.isMaster,
  isWorker: c.isWorker,
  worker: c.worker,
}

const restoreCluster = () => {
  c.isPrimary = clusterProps.isPrimary
  c.isMaster = clusterProps.isMaster
  c.isWorker = clusterProps.isWorker
  c.worker = clusterProps.worker
}

export default [
  {
    // the checks run one after another in a single test,
    // as the suite tests run in parallel and share the cluster module
    fn: async () => {
      // the primary process with no command just warns
      if (c.isPrimary) {
        await runCluster({ args: { 'no-check-links': true }, commands: {} })
      }

      // a worker that is not the watcher runs the build pipeline;
      // the build finishes by sending a quit message to the primary
      c.isPrimary = false
      c.isMaster = false
      c.isWorker = true
      c.worker = { id: 2 }
      const messages: string[] = []
      const proc = process as unknown as { send?: (msg: unknown) => void }
      proc.send = msg => {
        messages.push((msg as { evt?: string } | null | undefined)?.evt ?? 'unknown')
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
      let message: unknown
      proc.send = msg => {
        message = msg
      }
      try {
        ;(handler as unknown as (err: unknown) => void)(new Error('test rejection'))
        return (
          is.obj(message) &&
          (message as { evt: string }).evt === 'error' &&
          (message as { error: string }).error.includes('test rejection')
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
