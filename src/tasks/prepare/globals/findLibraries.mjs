import path from 'path'

import cases from '@magic/cases'
import fs from '@magic/fs'
import is from '@magic/types'

const nodeModuleDir = path.join(process.cwd(), 'node_modules')

export const findLibraries = async (app, modules) => {
  const libraries = {}

  if (app.lib) {
    Object.entries(app.lib).forEach(([name, val]) => {
      if (is.string(val)) {
        libraries[name] = path.resolve(val)
      } else {
        libraries[name] = val
      }
    })
  }

  const libNodeModuleDir = path.join(nodeModuleDir, '@magic-libraries')
  let libOfficialNodeModuleFiles = await fs.getDirectories(libNodeModuleDir, { depth: false })
  libOfficialNodeModuleFiles = libOfficialNodeModuleFiles.filter(n => n !== libNodeModuleDir)

  const nodeModules = await fs.getDirectories(nodeModuleDir, { depth: false })
  const libInofficialNodeModuleFiles = nodeModules.filter(
    n => n.includes('magic-library-') || n.includes('magic-libraries-'),
  )

  const libDirs = [...libOfficialNodeModuleFiles, ...libInofficialNodeModuleFiles]

  const libPromises = libDirs.map(async libDir => {
    let libName = ''
    if (libDir.includes('@magic-libraries')) {
      libName = libDir.split('@magic-libraries' + path.sep)[1]
      // libDir = `@magic-libraries/${libName}`
    } else if (libDir.includes('magic-libraries-')) {
      libName = libDir.split('magic-libraries-')[1]
      // libDir = `magic-libraries-${libName}`
    } else if (libDir.includes('magic-library-')) {
      libName = libDir.split('magic-library-')[1]
      // libDir = `magic-library-${libName}`
    }

    libraries[libName] = libDir
  })

  await Promise.all(libPromises)

  Object.entries(modules).forEach(([key, val]) => {
    key = `${key[0].toLowerCase()}${key.substring(1)}`
    if (val.lib) {
      libraries[key] = val.lib
    }

    Object.entries(val).forEach(([viewKey, view]) => {
      if (view.lib) {
        viewKey = `${viewKey[0].toLowerCase()}${key.substring(1)}`
        libraries[viewKey] = view.lib
      }
    })
  })

  global.lib = global.lib || {}

  const libFnPromises = Object.entries(libraries).map(async ([key, val]) => {
    const camelKey = cases.camel(key)

    let lib

    if (!is.string(val)) {
      if (val[key] && Object.keys(val).length === 1) {
        lib = val[key]
      } else {
        lib = val
      }
    } else {
      if (!val.endsWith('.mjs')) {
        val = path.join(val, 'src', 'index.mjs')
      }

      const imported = await import(val)

      if (imported.default) {
        lib = imported.default
      } else if (imported[key]) {
        lib = imported[key]
      } else {
        lib = imported
      }
    }

    global.lib[camelKey] = lib

    return {
      key,
      lib,
    }
  })

  const libs = await Promise.all(libFnPromises)

  return libs
}
