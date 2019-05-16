import cluster from 'cluster'
import path from 'path'

import log from '@magic/log'
import is from '@magic/types'

import * as tasks from '../tasks/index.mjs'
import runApp from '../modules/app.mjs'

import { master } from './master.mjs'
import { build } from './build.mjs'
import { watch } from './watch.mjs'

export const runCluster = async ({ cmds, argv }, config) => {
  if (cluster.isMaster) {
    await master(cluster, cmds, argv, config)
  } else if (cluster.isWorker) {
    if (cmds.serve && cluster.worker.id === 1) {
      // watcher
      watch(argv, config)
    } else {
      // builder
      build(cmds, config)
    }

    process
      .on('unhandledRejection', error => {
        process.send({ evt: 'error', error: error.toString(), stack: error.stack })
      })
      .on('uncaughtException', error => {
        process.send({ evt: 'error', error: error.toString(), stack: error.stack })
      })
  }
}

export default runCluster
