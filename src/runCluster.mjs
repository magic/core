import cluster from 'cluster'

import log from '@magic/log'

import { build, primary, watch } from './cluster/index.mjs'
import { runConfig } from './config.mjs'

/**
 * @param {{ args: Record<string, unknown>, commands: Record<string, unknown> }} options
 * @returns {Promise<void>}
 */
export const runCluster = async options => {
  const { args, commands } = options

  // get the config
  const config = await runConfig(args)

  if (!config) {
    return
  }

  // build-injected globals are not part of the globalThis type (see externals.d.ts),
  // so access them through a permissive record view
  /** @type {Record<string, unknown>} */
  const globals = /** @type {Record<string, unknown>} */ (globalThis)

  if (!globals.CHECK_PROPS) {
    const { CHECK_PROPS } = await import('./lib/CHECK_PROPS.mjs')
    globals.CHECK_PROPS = CHECK_PROPS
  }

  const { CONFIG_FILE_PATH, DIR, GIT, ROOT, URL, URL_WARNING, WEB_ROOT } = config

  if (cluster.isPrimary || cluster.isMaster) {
    const { __DEPRECATED__ = [] } = config
    __DEPRECATED__.forEach(key => {
      log.error(`E_${key.toUpperCase()}_USED`, `conf.${key} is deprecated.`)
    })

    await primary({ cluster, commands, args, DIR, GIT, URL, URL_WARNING, WEB_ROOT })
  } else if (cluster.isWorker) {
    if (commands.serve && cluster.worker?.id === 1) {
      // watcher,
      // watches the directory and tells primary to restart the build process when files change
      watch({ args, ROOT, CONFIG_FILE_PATH, STATIC: DIR.STATIC })
    } else {
      // builder
      // builds the files and pages needed
      build({ commands, config })
    }

    process
      .on('unhandledRejection', error => {
        const err = /** @type {Error} */ (error)
        process.send?.({ evt: 'error', error: err.toString(), stack: err.stack })
      })
      .on('uncaughtException', error => {
        const err = /** @type {Error} */ (error)
        process.send?.({ evt: 'error', error: err.toString(), stack: err.stack })
      })
  }
}
