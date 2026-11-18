import path from 'path'
import { fileURLToPath } from 'url'

import cases from '@magic/cases'
import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import { stringifyObject, replaceSlashSlash } from '../../lib/index.mjs'
import { prepareCheckProps } from './checkProps.mjs'

/** @import { AppObject, Config, ModuleView } from '../../types.mjs' */

/**
 * The @magic/hyperapp source has to be inlined into the client bundle.
 *
 * Candidate paths, tried in order:
 * 1. resolved through the module system from this package's context.
 *    works for regular installs (hoisted into the project's node_modules),
 *    file: linked dev installs (found in core's own node_modules)
 *    and global installs.
 * 2. the project's node_modules (process.cwd()).
 *
 * @returns {Promise<string[]>}
 */
const getHyperappPaths = async () => {
  /** @type {string[]} */
  const candidates = []

  try {
    // import.meta.resolve returns a Promise on older node versions,
    // awaiting a plain string is a no-op
    const resolved = await import.meta.resolve('@magic/hyperapp')
    // resolves to .../node_modules/@magic/hyperapp/src/index.mjs
    candidates.push(path.join(path.dirname(fileURLToPath(resolved)), 'hyperapp.mjs'))
  } catch {
    // import.meta.resolve unavailable (old node) or the package is
    // unresolvable. fall back to the project's node_modules.
  }

  candidates.push(
    path.join(process.cwd(), 'node_modules', '@magic', 'hyperapp', 'src', 'hyperapp.mjs'),
  )

  return candidates
}

/**
 * @param {AppObject} magic
 * @param {Config} config
 * @returns {Promise<string>}
 */
export const prepareJs = async (magic, config) => {
  const { HOIST, PREPEND_JS, APPEND_JS /*, WEB_ROOT*/ } = config

  const hyperappPaths = await getHyperappPaths()

  /** @type {string | undefined} */
  let hyperappContent
  for (const hyperappPath of hyperappPaths) {
    try {
      hyperappContent = await fs.readFile(hyperappPath, 'utf8')
      break
    } catch {
      // try the next candidate path
    }
  }

  if (hyperappContent === undefined) {
    throw error(
      `could not find the @magic/hyperapp source file. tried:\n${hyperappPaths.join('\n')}`,
      'E_HYPERAPP_NOT_FOUND',
    )
  }

  const imports = 'h, app'

  // replace hyperapp exports, wrap it in a closure
  // return needed exports only to allow dead code elimination
  const hyperapp = `
const { ${imports} } = (() => {
${hyperappContent.replace(/export /g, ' ')}
return { ${imports} }
})()`

  // add the Component module that wraps all other html tags
  const componentString = `const C = ${component.toString()}\n`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  const { checkProps, propTypeString } = prepareCheckProps(magic, config)

  let depString = ''
  // Reserved JavaScript keywords that can't be used as variable names
  const reservedKeywords = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'null',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'with',
    'yield',
  ])

  /**
   * @param {string} name
   * @returns {string}
   */
  const toVarName = name => {
    const camelName = cases.camel(name)
    return reservedKeywords.has(camelName) ? `${camelName}El` : camelName
  }

  let htmlTagString = ''
  Object.entries({ ...(magic.modules ?? {}), ...(magic.tags ?? {}) })
    .filter(([k]) => k !== 'Magic' && k !== 'component')
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([k, v]) => {
      if (!is.case.upper(k[0])) {
        const varName = toVarName(k)
        htmlTagString += `const ${varName} = C('${k}')\n`
      } else {
        let str
        if (is.function(v)) {
          str = `\nconst ${k} = ${v.toString()}\n`
        } else if (is.function(/** @type {{ View?: unknown }} */ (v)?.View)) {
          str = `\nconst ${k} = ${/** @type {{ View: { toString(): string } }} */ (v).View.toString()}\n`
        } else {
          log.error(`${k} Module does not export a View`, 'E_MODULE_NO_VIEW')
        }

        const subStr = Object.entries(/** @type {Record<string, unknown>} */ (v))
          .filter(([sk]) => is.case.upper(sk[0]) && sk !== 'View')
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([sk, sv]) => {
            const svString = is.fn(sv)
              ? /** @type {() => string} */ (sv).toString()
              : /** @type {{ View: { toString(): string } }} */ (sv).View.toString()
            return `\n${k}.${sk} = ${svString}`
          })
          .join('\n')

        depString += `${str}\n${subStr}`
      }
    })

  const stateForString = stringifyObject(magic.state)

  const stateString = `const initialState = ${stateForString}`

  let helperString = ''
  if (!is.empty(magic.helpers)) {
    helperString = `const helpers = ${stringifyObject(magic.helpers)}`
  }

  let actionString = ''
  if (!is.empty(magic.actions)) {
    // create global actions object
    actionString = `const actions = ${stringifyObject(magic.actions)}\n`
  }

  // create global effects object
  let effectString = ''
  if (!is.empty(magic.effects)) {
    effectString = `const effects = ${stringifyObject(magic.effects)}\n`
  }

  // create global subscription object
  let subscriptionString = ''
  if (!is.empty(magic.subscriptions) && is.array(magic.subscriptions)) {
    subscriptionString = `
  subscriptions: state => [
    [${magic.subscriptions.join('],\n    [')}]
  ],
`.trim()
  }

  let libString = ''
  if (!is.empty(magic.lib) && is.objectNative(magic.lib)) {
    const lib = magic.lib
    const libPromises = Object.entries(lib)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(async ([name, fn]) => {
        if (name.includes('-')) {
          name = cases.camel(name)
        }

        if (is.function(fn)) {
          const fnObj = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (fn))
          const ownProps = Object.keys(fnObj).filter(k => is.fn(fnObj[k]))

          if (ownProps.length) {
            // inline the function together with its attached properties,
            // bound to its own name, so the inlined copy stays self-contained
            // (eg the @magic-libraries/is base function references itself).
            const varName = reservedKeywords.has(name) ? 'fn' : name
            const assignments = ownProps
              .map(
                k =>
                  `${varName}[${JSON.stringify(k)}] = ${
                    /** @type {() => string} */ (fnObj[k]).toString()
                  };`,
              )
              .join('\n')
            return ` ${name}: (function () {
      const ${varName} = ${fn.toString()};
      ${assignments}
      return ${varName};
    })(),`
          }

          return ` ${name}: ${fn.toString()},`
        } else if (is.array(fn)) {
          return ` ${name}: ${JSON.stringify(fn)},`
        } else if (is.object(fn) && is.objectNative({ ...fn })) {
          return ` ${name}: ${stringifyObject(fn)},`
        } else {
          log.error(
            'UNKNOWN_LIB_TYPE',
            `app.lib.${name} has to be a function, array or object, got: ${typeof lib[name]}`,
          )
        }
      })

    const libArray = await Promise.all(libPromises)

    libString = 'const lib = {\n'
    libString += libArray.filter(a => a).join('\n')
    libString += '\n}'
  }

  // create pages object, each Page is a html View

  const pageString = `
const pages = {
  ${(magic.pages ?? [])
    .sort(({ name: a }, { name: b }) => ((a ?? '') > (b ?? '') ? 1 : -1))
    .map(page => {
      const viewString = /** @type {ModuleView} */ (page.View).toString()
      return `\n  '${page.name}': ${viewString},`
    })
    .join('\n')}
}
`

  // const pageTitleString = Object.entries(pageTitles)
  //   .map(([name, title]) => `"${name}": "${title}",`)
  //   .join('\n      ')

  // unused for now
  //   const serviceWorkerString = `
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('${WEB_ROOT}service-worker.js')
  // }
  // `

  const initState = `{
  ...initialState,
  url: window.location.pathname,
  hash: window.location.hash.substr(1),
}`

  let initFunc = ''

  if (!is.empty(magic.init)) {
    if (is.array(magic.init)) {
      if (is.string(magic.init[0]) && is.len(magic.init)) {
        const [name, value] = magic.init
        initFunc = `[[${name}, ${stringifyObject(value)}]]`
      } else {
        const init = magic.init.map(fn => {
          if (is.array(fn) && is.len(fn) && is.string(fn[0])) {
            return `[${fn[0]}, ${stringifyObject(fn[1])}]`
          } else if (is.string(fn)) {
            return fn
          } else if (is.fn(fn)) {
            return fn.toString()
          }
        })

        initFunc = `[${init.join(',')}]`
      }
    } else {
      throw error('E_BROKEN_INIT', 'magic.init must be an array.')
    }
  }

  let initString = initState

  if (initFunc) {
    initString = `[${initString}, ${initFunc}]`
  }

  let hoisted = ''
  if (!is.empty(HOIST)) {
    if (is.array(HOIST)) {
      hoisted = HOIST.map(component => `${component}(state)`).join(',')
      if (HOIST.length > 1) {
        hoisted = `[${hoisted}]`
      } else if (HOIST.length === 0) {
        hoisted = ''
      }
    } else if (is.string(HOIST)) {
      hoisted = HOIST
      if (!hoisted.includes('state')) {
        hoisted = `${hoisted}(state)`
      }
    }
  }

  app.hoisted = hoisted

  // generate string to write to client js
  const appString = `
app({
  init: ${initString},
  ${subscriptionString}
  view: state => {
    const url = pages[state.url] ? state.url : '/404/'
    const page = pages[url]

    // map pageState into state
    const s = state.pages && state.pages[url]
    if (s) {
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }

    state.url = url

    return Page({ page, state }${hoisted ? `, ${hoisted}` : ''})
  },
  node: document.getElementById('Magic'),
})
`

  const prependJSContents = PREPEND_JS.map(file => {
    const fullFilePath = replaceSlashSlash(`/${file}`)
    const fileContent = /** @type {{ toString?: () => string } | undefined} */ (
      app.static?.[fullFilePath]
    )
    const contentToString = fileContent?.toString

    if (is.empty(fileContent) || !is.function(contentToString)) {
      throw error(`fileContent undefined for config.PREPEND_JS: ${file}`, 'E_PREPEND_JS_EMPTY')
    }

    return contentToString.call(fileContent)
  })

  const appendJSContents = APPEND_JS.map(file => {
    const fullFilePath = replaceSlashSlash(`/${file}`)
    const fileContent = /** @type {{ toString?: () => string } | undefined} */ (
      app.static?.[fullFilePath]
    )
    const contentToString = fileContent?.toString

    if (is.empty(fileContent) || !is.function(contentToString)) {
      throw error(`fileContent undefined for config.APPEND_JS: ${file}`, 'E_PREPEND_JS_EMPTY')
    }

    return fileContent
  })

  const clientString = [
    prependJSContents.join('\n'),

    // isolate magic js from the rest of the javascript
    'const __MAGIC__ = () => {',
    hyperapp,
    checkProps,
    propTypeString,
    componentString,
    htmlTagString,
    stateString,
    helperString,
    depString,
    libString,
    actionString,
    effectString,
    pageString,
    appString,
    // serviceWorkerString,

    // isolate magic js from the rest of the javascript
    '}',
    '__MAGIC__()',
    '\n',

    appendJSContents.join('\n'),
  ]
    .join('\n')
    .trim()

  return clientString
}
