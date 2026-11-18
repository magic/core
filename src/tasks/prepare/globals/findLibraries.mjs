import path from 'path'
import { fileURLToPath } from 'url'

import cases from '@magic/cases'
import fs from '@magic/fs'
import is from '@magic/types'

import { saveImport } from '../../../lib/index.mjs'

/** @import { AppObject, ConfigDir } from '../../../types.mjs' */

const nodeModuleDir = path.join(process.cwd(), 'node_modules')

// core's own node_modules. in file: linked dev installs,
// core's dependencies (eg @magic-libraries/*) live here,
// not in the project's node_modules.
const coreNodeModuleDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  'node_modules',
)

/**
 * @param {AppObject} app
 * @param {Record<string, unknown>} modules
 * @param {{ DIR: ConfigDir, ROOT?: string }} params
 * @returns {Promise<{ key: string, lib: unknown }[]>}
 */
export const findLibraries = async (app, modules, { DIR }) => {
  /** @type {{ [key: string]: string | Record<string, unknown> }} */
  const libraries = {}

  if (app.lib) {
    Object.entries(/** @type {Record<string, unknown>} */ (app.lib)).forEach(([name, val]) => {
      if (is.string(val)) {
        libraries[name] = path.resolve(val)
      } else {
        libraries[name] = /** @type {Record<string, unknown>} */ (val)
      }
    })
  }

  // @magic-libraries/* dirs. the project's node_modules wins over
  // core's own node_modules, if the same lib exists in both.
  /** @type {Map<string, string>} */
  const officialLibDirs = new Map()
  for (const dir of [nodeModuleDir, coreNodeModuleDir]) {
    const libNodeModuleDir = path.join(dir, '@magic-libraries')
    try {
      const files = await fs.getDirectories(libNodeModuleDir, { depth: false })
      for (const file of files) {
        if (file === libNodeModuleDir) {
          continue
        }
        const name = path.basename(file)
        if (!officialLibDirs.has(name)) {
          officialLibDirs.set(name, file)
        }
      }
    } catch {
      // no @magic-libraries in this node_modules, keep looking
    }
  }

  // unofficial magic-library-* / magic-libraries-* packages in the
  // node_modules root, same project-wins dedup
  /** @type {Map<string, string>} */
  const inofficialLibDirs = new Map()
  for (const dir of [nodeModuleDir, coreNodeModuleDir]) {
    try {
      const nodeModules = await fs.getDirectories(dir, { depth: false })
      for (const file of nodeModules) {
        if (file.includes('magic-library-') || file.includes('magic-libraries-')) {
          const name = path.basename(file)
          if (!inofficialLibDirs.has(name)) {
            inofficialLibDirs.set(name, file)
          }
        }
      }
    } catch {
      // keep looking
    }
  }

  await Promise.all(
    DIR.LIB.map(async dir => {
      const files = await fs.getFiles(dir, { depth: 1 })

      return files.map(file => {
        const libName = file
          .replace(`${dir}${path.sep}`, '')
          .replace('.mjs', '')
          .replace('.js', '')
          .replace(/\\/gim, '/')
        libraries[libName] = file
      })
    }),
  )

  const libDirs = [...officialLibDirs.values(), ...inofficialLibDirs.values()]
  libDirs.forEach(libDir => {
    let libName = ''

    if (libDir.includes('@magic-libraries')) {
      libName = libDir.split('@magic-libraries' + path.sep)[1]
    } else if (libDir.includes('magic-libraries-')) {
      libName = libDir.split('magic-libraries-')[1]
    } else if (libDir.includes('magic-library-')) {
      libName = libDir.split('magic-library-')[1]
    }

    libraries[libName] = libDir
  })

  /**
   * @param {[string, unknown]} entry
   */
  const handleModuleLibs = ([key, val]) => {
    key = `${key[0].toLowerCase()}${key.substring(1)}`
    const valObj = /** @type {{ lib?: string }} */ (val)
    if (valObj.lib) {
      libraries[key] = valObj.lib
    }

    Object.entries(/** @type {Record<string, unknown>} */ (val)).forEach(([viewKey, view]) => {
      const viewObj = /** @type {{ lib?: string }} */ (view)
      if (viewObj.lib) {
        const viewLibKey = `${viewKey[0].toLowerCase()}${key.substring(1)}`
        libraries[viewLibKey] = viewObj.lib
      }
    })
  }

  Object.entries(modules).forEach(handleModuleLibs)

  const globals = /** @type {Record<string, unknown>} */ (globalThis)
  globals.lib =
    /** @type {Record<string, unknown>} */ (globals.lib) ||
    /** @type {Record<string, unknown>} */ (/** @type {unknown} */ ({}))

  const libFnPromises = Object.entries(libraries).map(async ([key, val]) => {
    const camelKey = cases.camel(key)

    /** @type {unknown} */
    let lib

    if (!is.string(val)) {
      const valRecord = /** @type {Record<string, unknown>} */ (val)
      if (valRecord[key] && Object.keys(valRecord).length === 1) {
        lib = valRecord[key]
      } else {
        lib = val
      }
    } else {
      if (!val.endsWith('.mjs') && !val.endsWith('.js')) {
        const rootPath = path.join(val, 'index.mjs')
        const rootExists = await fs.exists(rootPath)
        if (rootExists) {
          val = rootPath
        } else {
          const srcPath = path.join(val, 'src', 'index.mjs')
          const srcExists = await fs.exists(srcPath)
          if (srcExists) {
            val = srcPath
          }
        }
      }

      const imported = await saveImport(val)
      const namespace =
        imported instanceof Error
          ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ ({}))
          : imported

      if (namespace.default) {
        lib = namespace.default
      } else if (namespace[key]) {
        lib = namespace[key]
      } else {
        lib = imported
      }
    }

    ;/** @type {Record<string, unknown>} */ (globals.lib)[camelKey] = lib

    return {
      key,
      lib,
    }
  })

  const libs = await Promise.all(libFnPromises)

  return libs
}
