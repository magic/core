import path from 'path'

import cases from '@magic/cases'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { replacePathSepForImport, saveImport } from '../../../lib/index.mjs'

/** @import { NodeError } from '../../../types.mjs' */

/** @typedef {{ [key: string]: unknown, lib?: string } } FoundModule */

const localLibIndexPath = path.join('src', 'lib', 'index')
const localLibMjsPath = path.join('src', 'lib')
const nodeModuleDir = path.join(process.cwd(), 'node_modules')

/**
 * @param {Record<string, unknown>} [_modules]
 * @returns {Promise<{ [key: string]: FoundModule }>}
 */
export const findNodeModules = async _modules => {
  /** @type {{ [key: string]: FoundModule }} */
  const modules = {}

  const dirs = await fs.getDirectories(nodeModuleDir, { depth: false })

  const dirPromises = dirs
    .filter(dir => dir.includes('magic-module-') || dir.includes('magic-modules-'))
    .map(async nodeModule => {
      const name = cases.pascal(nodeModule.split(/magic-module(s)?-/)[1])
      const importDir = nodeModule.replace(nodeModuleDir + path.sep, '')
      const loadPath = replacePathSepForImport(importDir, path.sep)

      // find module itself
      try {
        const mod = await saveImport(loadPath)
        // saveImport returns the error object on failure - check for it
        const modIsError = mod instanceof Error
        const modCode = modIsError ? /** @type {NodeError} */ (mod).code : mod.code
        const modUrl = modIsError ? /** @type {NodeError} */ (mod).url : mod.url
        if (modCode && modUrl) {
          log.warn('E_MODULE_NOT_FOUND', `skipping node_module: ${nodeModule}`)
          return
        }
        // copy the imported module into a new object to be able to extend it below
        const modRecord = modIsError
          ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (mod))
          : mod
        modules[name] = {
          ...modRecord,
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        log.error('Error', `requiring node_module: ${nodeModule}, error: ${msg}`)
      }

      // find lib file of module if it exists
      const extensions = ['.mjs', '.js']
      await Promise.all(
        extensions.map(async ext => {
          try {
            const libPath = path.join(nodeModule, localLibIndexPath + ext)
            await fs.stat(libPath)
            modules[name].lib = path.join(loadPath, localLibIndexPath + ext)
          } catch (e) {
            const eCode = e instanceof Error ? /** @type {NodeError} */ (e).code : undefined
            if (eCode !== 'ENOENT') {
              throw e instanceof Error ? error(e) : new Error(String(e))
            }
          }
        }),
      )

      try {
        const libMjsPath = path.join(nodeModule, localLibMjsPath)
        await fs.stat(libMjsPath)
        modules[name].lib = path.join(loadPath, localLibMjsPath)
      } catch (e) {
        const eCode = e instanceof Error ? /** @type {NodeError} */ (e).code : undefined
        if (eCode !== 'ENOENT') {
          throw e instanceof Error ? error(e) : new Error(String(e))
        }
      }
    })

  const magicModuleDir = path.join(nodeModuleDir, '@magic-modules')
  const nodeModules = await fs.getDirectories(magicModuleDir, { depth: false })

  const modulePromises = nodeModules
    .filter(n => nodeModuleDir !== n)
    .map(async nodeModule => {
      if (magicModuleDir !== nodeModule) {
        const name = cases.pascal(path.basename(nodeModule))

        const loadPath = replacePathSepForImport(nodeModule, path.sep)

        try {
          const importPath = path.join(nodeModule, 'src', 'index.mjs')
          const mod = await saveImport(importPath)
          // saveImport returns the error object on failure - check for it
          const modIsError = mod instanceof Error
          const modCode = modIsError ? /** @type {NodeError} */ (mod).code : mod.code
          const modUrl = modIsError ? /** @type {NodeError} */ (mod).url : mod.url
          if (modCode && modUrl) {
            log.warn('E_MODULE_NOT_FOUND', `skipping node_module: ${nodeModule}`)
            return
          }
          // copy the imported module into a new object to be able to extend it below
          const modRecord = modIsError
            ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (mod))
            : mod
          modules[name] = {
            ...modRecord,
          }
        } catch (e) {
          const eNode = e instanceof Error ? /** @type {NodeError} */ (e) : undefined
          const msg = e instanceof Error ? e.message : String(e)
          log.error(
            eNode && eNode.code ? eNode.code : 'Error',
            `requiring node_module: ${nodeModule}, error: ${msg}`,
          )
          process.exit(1)
        }

        try {
          const libPath = path.join(nodeModule, localLibIndexPath)
          await fs.stat(libPath)
          const importPath = path.join(loadPath, localLibIndexPath)
          const resolvedLibPath = replacePathSepForImport(importPath, path.sep)
          modules[name].lib = resolvedLibPath
        } catch (e) {
          const eCode = e instanceof Error ? /** @type {NodeError} */ (e).code : undefined
          if (eCode !== 'ENOENT') {
            throw e instanceof Error ? error(e) : new Error(String(e))
          }
        }

        try {
          const libMjsPath = path.join(nodeModule, localLibMjsPath)
          await fs.stat(libMjsPath)
          modules[name].lib = path.join(loadPath, localLibMjsPath)
        } catch (e) {
          const eCode = e instanceof Error ? /** @type {NodeError} */ (e).code : undefined
          if (eCode !== 'ENOENT') {
            throw e instanceof Error ? error(e) : new Error(String(e))
          }
        }
      }
    })

  await Promise.all([...dirPromises, ...modulePromises])

  return modules
}
