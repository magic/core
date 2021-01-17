import path from 'path'

import cases from '@magic/cases'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

import { replacePathSepForImport } from '../../../lib/index.mjs'

const localLibIndexPath = path.join('src', 'lib', 'index.mjs')
const localLibMjsPath = path.join('src', 'lib.mjs')
const nodeModuleDir = path.join(process.cwd(), 'node_modules')
const recursiveSearch = false

export const findNodeModules = async () => {
  let modules = {}

  const dirs = await fs.getDirectories(nodeModuleDir, recursiveSearch)

  const dirPromises = dirs
    .filter(dir => dir.includes('magic-module-') || dir.includes('magic-modules-'))
    .map(async nodeModule => {
      const name = cases.pascal(nodeModule.split(/magic-module(s)?-/)[1])
      const importDir = nodeModule.replace(nodeModuleDir + path.sep, '')
      const loadPath = replacePathSepForImport(importDir, path.sep)

      // find module itself
      try {
        const mod = await import(loadPath)
        // copy the imported module into a new object to be able to extend it below
        modules[name] = {
          ...mod,
        }
      } catch (e) {
        log.error('Error', `requiring node_module: ${nodeModule}, error: ${e.message}`)
      }

      // find lib file of module if it exists
      try {
        const libPath = path.join(nodeModule, localLibIndexPath)
        await fs.stat(libPath)
        modules[name].lib = path.join(loadPath, localLibIndexPath)
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw error(e)
        }
      }

      try {
        const libMjsPath = path.join(nodeModule, localLibMjsPath)
        await fs.stat(libMjsPath)
        modules[name].lib = path.join(loadPath, localLibMjsPath)
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw error(e)
        }
      }
    })

  const magicModuleDir = path.join(nodeModuleDir, '@magic-modules')
  const nodeModules = await fs.getDirectories(magicModuleDir, recursiveSearch)

  const modulePromises = nodeModules
    .filter(n => nodeModuleDir !== n)
    .map(async nodeModule => {
      if (magicModuleDir !== nodeModule) {
        const name = cases.pascal(path.basename(nodeModule))

        const loadPath = replacePathSepForImport(nodeModule, path.sep)

        try {
          const importPath = path.join(nodeModule, 'src', 'index.mjs')
          const mod = await import(importPath)
          // copy the imported module into a new object to be able to extend it below
          modules[name] = {
            ...mod,
          }
        } catch (e) {
          log.error(e.code, `requiring node_module: ${nodeModule}, error: ${e.message}`)
          process.exit(1)
        }

        try {
          const libPath = path.join(nodeModule, localLibIndexPath)
          await fs.stat(libPath)
          const importPath = path.join(loadPath, localLibIndexPath)
          const resolvedLibPath = replacePathSepForImport(importPath, path.sep)
          modules[name].lib = resolvedLibPath
        } catch (e) {
          if (e.code !== 'ENOENT') {
            throw error(e)
          }
        }

        try {
          const libMjsPath = path.join(nodeModule, localLibMjsPath)
          await fs.stat(libMjsPath)
          modules[name].lib = path.join(loadPath, localLibMjsPath)
        } catch (e) {
          if (e.code !== 'ENOENT') {
            throw error(e)
          }
        }
      }
    })

  await Promise.all([...dirPromises, ...modulePromises])

  return modules
}
