import type { AppObject, ConfigDir } from '../../../../src/types.mjs'

import { rm, mkdir } from 'node:fs/promises'
import path from 'path'

import fs from '@magic/fs'
import { is } from '@magic/test'

import { findAssetFile } from '../../../../src/tasks/prepare/globals/findAssetFile.mjs'
import { findLibraries } from '../../../../src/tasks/prepare/globals/findLibraries.mjs'
import { findLocalModules } from '../../../../src/tasks/prepare/globals/findLocalModules.mjs'
import { findNodeModules } from '../../../../src/tasks/prepare/globals/findNodeModules.mjs'
import { findThemes } from '../../../../src/tasks/prepare/globals/findThemes.mjs'
import { registerModule } from '../../../../src/tasks/prepare/globals/registerModule.mjs'

const base = path.join(process.cwd(), '.test-globals-tmp')
const nodeModules = path.join(process.cwd(), 'node_modules')

const write = async (p: string, content: string) => {
  await fs.mkdirp(path.dirname(p))
  await fs.writeFile(p, content)
}

/** a ConfigDir fixture with only the relevant keys set */
const dir = (over: Partial<ConfigDir>): ConfigDir => ({
  PAGES: '/p',
  PUBLIC: '/public',
  ASSETS: '/assets',
  MODULES: '/modules',
  STATIC: '/static',
  THEMES: '/themes',
  API: '/api',
  LIB: [],
  ...over,
})

export default {
  beforeAll: async () => {
    await rm(base, { recursive: true, force: true })
    await mkdir(base, { recursive: true })

    // asset file with function, object, module namespace and non-module exports
    await write(path.join(base, 'assets', 'dep.mjs'), `export const View = () => 1\n`)
    await write(
      path.join(base, 'assets', 'index.mjs'),
      `export * as nsExport from './dep.mjs'
export const fnExport = () => 1
export const objExport = { a: 1 }
export const other = 'string'
`,
    )

    // local modules
    await write(path.join(base, 'modules', 'Good.mjs'), `export default () => 1\n`)
    await write(
      path.join(base, 'modules', 'Named.mjs'),
      `export const View = () => 1\nexport const state = { x: 1 }\n`,
    )
    await write(path.join(base, 'modules', 'lowercase.mjs'), `export default () => 1\n`)

    // theme with modules to merge
    await write(
      path.join(base, 'themes', 'mytheme', 'index.mjs'),
      `export const Merged = () => 2
export const AsFn = { View: () => 3 }
export const AsObj = { View: () => 4, style: { a: 1 } }
`,
    )

    // libraries
    await write(path.join(base, 'lib', 'localfile.mjs'), `export default () => 1\n`)
    await write(path.join(base, 'libdir', 'index.mjs'), `export default () => 2\n`)
    await write(path.join(base, 'libkeyed.mjs'), `export const libkeyed = () => 3\n`)

    // node module fixtures (cleaned up in the cleanup below)
    await write(
      path.join(nodeModules, 'magic-module-coverage-test', 'package.json'),
      JSON.stringify(
        {
          name: 'magic-module-coverage-test',
          version: '0.0.1',
          type: 'module',
          main: 'src/index.mjs',
        },
        null,
        2,
      ),
    )
    await write(
      path.join(nodeModules, 'magic-module-coverage-test', 'src', 'index.mjs'),
      `export const View = () => 1\n`,
    )
    await write(
      path.join(nodeModules, 'magic-module-coverage-test', 'src', 'lib', 'index.mjs'),
      `export const libFn = () => 1\n`,
    )
    await write(
      path.join(nodeModules, 'magic-module-nolib', 'package.json'),
      JSON.stringify(
        { name: 'magic-module-nolib', version: '0.0.1', type: 'module', main: 'src/index.mjs' },
        null,
        2,
      ),
    )
    await write(
      path.join(nodeModules, 'magic-module-nolib', 'src', 'index.mjs'),
      `export const View = () => 2\n`,
    )

    return async () => {
      await rm(base, { recursive: true, force: true })
      await rm(path.join(nodeModules, 'magic-module-coverage-test'), {
        recursive: true,
        force: true,
      })
      await rm(path.join(nodeModules, 'magic-module-nolib'), { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: async () => {
        const modules = await findAssetFile(path.join(base, 'assets'))
        const objExport = modules.objExport as { a?: unknown } | undefined
        const nsExport = modules.nsExport as { View?: unknown } | undefined
        return (
          is.fn(modules.fnExport) &&
          objExport?.a === 1 &&
          is.fn(nsExport?.View) &&
          modules.other === undefined
        )
      },
      expect: true,
      info: 'findAssetFile imports function, object and module namespace exports from the asset file',
    },
    {
      fn: async () => {
        await mkdir(path.join(base, 'empty-assets'), { recursive: true })
        const modules = await findAssetFile(path.join(base, 'empty-assets'))
        return Object.keys(modules).length === 0
      },
      expect: true,
      info: 'findAssetFile returns an empty object without an asset file',
    },
    {
      fn: async () => {
        const modules = await findLocalModules(path.join(base, 'modules'))
        return (
          is.fn(modules.Good) &&
          (modules.Named as { View?: unknown } | undefined)?.View !== undefined &&
          modules.lowercase === undefined
        )
      },
      expect: true,
      info: 'findLocalModules imports local modules and skips lowercase files',
    },
    {
      fn: async () => {
        const modules = await findNodeModules()
        const withLib = modules.CoverageTest
        const withoutLib = modules.Nolib
        return (
          withLib !== undefined &&
          is.fn(withLib.View) &&
          typeof withLib.lib === 'string' &&
          withoutLib !== undefined &&
          withoutLib.lib === undefined
        )
      },
      expect: true,
      info: 'findNodeModules finds magic-module packages with and without a lib file',
    },
    {
      fn: async () => {
        const modules = {
          Merged: { View: () => 1, style: { a: 1 } },
          AsFn: () => 1,
          AsObj: { View: () => 2 },
          Unrelated: () => 0,
        }
        const result = await findThemes(modules, {
          DIR: dir({ THEMES: path.join(base, 'themes') }),
          NODE_MODULES: nodeModules,
          THEME: 'mytheme',
        })
        // theme module with an existing object module with a View:
        // the view is replaced, other props are kept
        const merged = result?.Merged as { View?: unknown; style?: { a?: unknown } } | undefined
        const asFn = result?.AsFn as { View?: unknown } | undefined
        const asObj = result?.AsObj as { style?: { a?: unknown } } | undefined
        return (
          is.fn(merged?.View) &&
          merged?.View !== modules.Merged.View &&
          merged?.style?.a === 1 &&
          // existing function module gets the theme object
          asFn?.View !== undefined &&
          // existing object module is merged with the theme object
          asObj?.style?.a === 1 &&
          result?.Unrelated === undefined
        )
      },
      expect: true,
      info: 'findThemes merges theme modules into existing modules',
    },
    {
      fn: async () => {
        // no THEME returns undefined
        const result = await findThemes(
          {},
          {
            DIR: dir({ THEMES: path.join(base, 'themes') }),
            NODE_MODULES: nodeModules,
          },
        )
        // an empty theme array returns an empty object
        const empty = await findThemes(
          {},
          {
            DIR: dir({ THEMES: path.join(base, 'themes') }),
            NODE_MODULES: nodeModules,
            THEME: [],
          },
        )
        return result === undefined && empty !== undefined && Object.keys(empty).length === 0
      },
      expect: true,
      info: 'findThemes returns undefined without a theme and an empty object for an empty array',
    },
    {
      fn: async () => {
        const app = {
          lib: {
            // a function value
            localfn: () => 1,
            // a directory that has an index.mjs
            localindex: path.join(base, 'libdir'),
            // a file without default export but a named export
            libkeyed: path.join(base, 'libkeyed.mjs'),
            // an object that only contains the key itself
            keyedobj: { keyedobj: () => 4 },
          },
        }
        const libs = await findLibraries(
          app as unknown as AppObject,
          {},
          { DIR: dir({ LIB: [path.join(base, 'lib')] }) },
        )
        const byKey = Object.fromEntries(libs.map(({ key, lib }) => [key, lib]))
        return (
          is.fn(byKey.localfn) &&
          is.fn(byKey.localindex) &&
          is.fn(byKey.libkeyed) &&
          is.fn(byKey.keyedobj) &&
          is.fn(byKey.localfile)
        )
      },
      expect: true,
      info: 'findLibraries resolves function, dir, named export and object libraries',
    },
    {
      fn: () => {
        const name = 'REGMOD_' + Math.random().toString(36).slice(2)
        // a module namespace that contains a property with its own name
        const mod = { [name]: () => 2 }
        registerModule([name, mod])
        const gt = globalThis as unknown as Record<string, unknown>
        const ok = is.fn(gt[name]) && gt[name]() === 2
        delete gt[name]
        return ok
      },
      expect: true,
      info: 'registerModule registers a module property with the module name',
    },
    {
      fn: () => {
        const name = 'REGMOD2_' + Math.random().toString(36).slice(2)
        // sub modules with a View object get registered onto the module
        const mod = { View: () => 1, Sub: { View: () => 2 } }
        registerModule([name, mod])
        const gt = globalThis as unknown as Record<string, unknown>
        const ok = is.fn(gt[name]) && is.fn((gt[name] as { Sub?: { View?: unknown } }).Sub?.View)
        delete gt[name]
        return ok
      },
      expect: true,
      info: 'registerModule registers submodule views onto the module',
    },
  ],
}
