import path from 'path'

import cases from '@magic/cases'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

import { stringifyObject } from '../../lib/index.mjs'

export const prepareJs = async (magic, { IS_DEV, HOIST /*, WEB_ROOT*/ }) => {
  const hyperappPath = path.join(
    process.cwd(),
    'node_modules',
    '@magic',
    'hyperapp',
    'src',
    'index.mjs',
  )
  const hyperappContent = await fs.readFile(hyperappPath, 'utf8')

  // only load Lazy if requested by user
  let imports = 'h, app'
  if (magic.modules.Lazy) {
    imports += ', Lazy'
  }

  delete magic.modules.Lazy

  // replace hyperapp exports, wrap it in a closure
  // return needed exports only to allow dead code elimination
  const hyperapp = `
const { ${imports} } = (() => {
${hyperappContent.replace(/export /g, ' ')}
return { ${imports} }
})()`

  // add the Component module that wraps all other html tags
  const componentString = `const C = ${global.component.toString()}\n`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  let checkProps = ''
  let propTypeString = ''
  if (IS_DEV) {
    // add proptype checking
    checkProps = `const CHECK_PROPS = ${global.CHECK_PROPS.toString()}`

    propTypeString = 'const propTypes = {\n'
    propTypeString += Object.entries(magic.modules)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([_, mod]) => {
        const subPropTypes = Object.entries(mod)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .filter(([k, { propTypes }]) => is.case.upper(k[0]) && k !== 'View' && propTypes)
          .map(([_, sm]) =>
            Object.entries(sm.propTypes)
              .sort(([a], [b]) => (a > b ? 1 : -1))
              .map(([k, t]) => `${k}: ${JSON.stringify(t, null, 2)}`)
              .join(',\n'),
          )
          .filter(a => a)
          .join(',\n')

        let propString = ''
        if (mod.propTypes) {
          propString = Object.entries(mod.propTypes)
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .map(([key, type]) => `${key}: ${JSON.stringify(type, null, 2)}`)
            .join(',\n')
        }
        if (subPropTypes) {
          propString += `\n${subPropTypes}`
        }
        return propString
      })
      .filter(a => a)
      .join(',\n')

    propTypeString += '\n}'
  }

  let depString = ''
  let htmlTagString = ''
  Object.entries(magic.modules)
    .filter(([k]) => k !== 'Magic' && k !== 'component')
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([k, v]) => {
      if (!is.case.upper(k[0])) {
        htmlTagString += `const ${k} = C('${k}')\n`
      } else {
        let str
        if (is.function(v)) {
          str = `\nconst ${k} = ${v.toString()}\n`
        } else {
          str = `\nconst ${k} = ${v.View.toString()}\n`
        }

        const subStr = Object.entries(v)
          .filter(([sk]) => is.case.upper(sk[0]) && sk !== 'View')
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([sk, sv]) => `\n${k}.${sk} = ${is.fn(sv) ? sv.toString() : sv.View.toString()}`)
          .join('\n')

        depString += `${str}\n${subStr}`
      }
    })

  const stateForString = stringifyObject(magic.state)

  let stateString = `const initialState = ${stateForString}`

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
  if (!is.empty(magic.subscriptions)) {
    subscriptionString = `
  subscriptions: state => [
    [${magic.subscriptions.join('],\n    [')}]
  ],
`.trim()
  }

  let libString = ''
  if (!is.empty(magic.lib)) {
    const libPromises = Object.entries(magic.lib)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(async ([name, fn]) => {
        if (name.includes('-')) {
          name = cases.camel(name)
        }

        if (is.function(fn)) {
          return ` ${name}: ${fn.toString()},`
        } else if (is.array(fn)) {
          return ` ${name}: ${JSON.stringify(fn)},`
        } else if (is.objectNative(fn)) {
          return ` ${name}: ${stringifyObject(fn)},`
        } else {
          log.error(
            'UNKNOWN_LIB_TYPE',
            `app.lib.${name} has to be a function, array or object, got: ${typeof app.lib[name]}`,
          )
        }
      })

    const libArray = await Promise.all(libPromises)

    libString = 'const lib = {\n'
    libString += libArray.filter(a => a).join('\n')
    libString += '\n}'
  }

  // create pages object, each Page is a html View
  let pageString = 'const pages = {\n'
  let pageTitles = {}

  magic.pages
    .sort(({ name: a }, { name: b }) => (a > b ? 1 : -1))
    .forEach(page => {
      pageString += `\n  '${page.name}': ${page.View.toString()},`

      if (page.state && page.state.title) {
        pageTitles[page.name] = page.state.title
      }
    })

  pageString += '\n}\n'

  // const pageTitleString = Object.entries(pageTitles)
  //   .map(([name, title]) => `"${name}": "${title}",`)
  //   .join('\n      ')

  // unused for now
  //   const serviceWorkerString = `
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('${WEB_ROOT}service-worker.js')
  // }
  // `

  let initState = `{
  ...initialState,
  url: window.location.pathname,
  hash: window.location.hash.substr(1),
}`

  let initFunc = ''

  if (!is.empty(magic.init)) {
    if (is.array(magic.init)) {
      if (is.string(magic.init[0]) && is.len(magic.init, 1)) {
        const [name, value] = magic.init
        initFunc = `[[${name}, ${stringifyObject(value)}]]`
      } else {
        const init = magic.init.map(fn => {
          if (is.array(fn) && is.len(fn, 1) && is.string(fn[0])) {
            return `[${fn[0]}, ${stringifyObject(fn[1])}]`
          } else if (is.string(fn)) {
            return fn
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

  const clientString = [
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
  ]
    .join('\n')
    .trim()

  return clientString
}
