import path from 'path'

import is from '@magic/types'

import { fs, isUpperCase, stringifyObject } from '../../lib/index.mjs'

const prepareJs = async magic => {
  const hyperappPath = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
  const hyperappContent = await fs.readFile(hyperappPath, 'utf8')

  let imports = 'h, app'
  if (magic.modules.Lazy) {
    imports += ', Lazy'
  }

  delete magic.modules.Lazy

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
  if (config.IS_DEV) {
    checkProps = `const CHECK_PROPS = ${global.CHECK_PROPS.toString()}`

    propTypeString = 'const propTypes = {\n'
    propTypeString += Object.entries(magic.modules)
      .filter(([_, { propTypes }]) => propTypes)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([name, { propTypes }]) =>
        Object.entries(propTypes)
          .map(([key, type]) => `${key}: ${JSON.stringify(type, null, 2)}`)
          .join(',\n'),
      )
      .join(',\n')
    propTypeString += '\n}'
  }

  let depString = ''
  let htmlTagString = ''
  Object.entries(magic.modules)
    .filter(([k]) => k !== 'Magic' && k !== 'component')
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([k, v]) => {
      if (!isUpperCase(k)) {
        htmlTagString += `const ${k} = C('${k}')\n`
      } else {
        let str
        if (is.function(v)) {
          str = `\nconst ${k} = ${v.toString()}\n`
        } else {
          str = `\nconst ${k} = ${v.View.toString()}\n`
        }

        const subStr = Object.entries(v)
          .filter(([sk]) => isUpperCase(sk) && sk !== 'View')
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([sk, sv]) => `${k}.${sk} = ${sv.toString()}`)
          .join('\n')

        depString += `${str}\n${subStr}`
      }
    })

  let stateString = `const initialState = ${stringifyObject(magic.state)}`

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

  let subscriptionString = ''
  if (!is.empty(magic.subscriptions)) {
    subscriptionString = `  subscriptions: state => [\n    `
    subscriptionString += `[${magic.subscriptions.join('],\n    [')}],`
    subscriptionString += '\n  ],'
  }

  let libString = ''
  if (!is.empty(magic.lib)) {
    libString = 'const lib = {'
    const libPromises = Object.entries(magic.lib)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(async ([name, lib]) => {
        if (lib.startsWith('@')) {
          lib = path.join(process.cwd(), 'node_modules', lib)
        }
        if (!lib.endsWith('index.mjs')) {
          lib = path.join(lib, 'src', 'index.mjs')
        }

        const contents = await fs.readFile(lib, 'utf8')
        return `  ${name}: (() => {${contents
          .replace(/export default/g, `return`)
          .replace(/export /g, '')}})(),`
      })

    const libArray = await Promise.all(libPromises)
    libString += libArray.join('\n')
    libString += '\n}'
  }

  // create pages object, each Page is a html View
  let pageString = 'const pages = {\n'

  magic.pages
    .sort(({ name: n1 }, { name: n2 }) => (n1 > n2 ? 1 : -1))
    .forEach(page => {
      pageString += `\n  '${page.name}': ${page.View.toString()},`
    })

  pageString += '\n}\n'

  const appString = `
app({
  init: () => ({
    ...initialState,
    url: window.location.pathname,
  }),
  ${subscriptionString}
  view: (state) => {
    const url = pages[state.url] ? state.url : '/404/'
    // used below, is kind of a global!
    const page = pages[url]

    // map pageState into state
    if (state.pages) {
      const pageState = state.pages[url]
      for (let key in pageState) {
        state[key] = pageState[key]
      }
    }

    return div({ id: 'Magic' }, Page({ page, state }))
  },
  node: document.getElementById("Magic"),
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
  ]
    .join('\n')
    .trim()

  return clientString
}
export default prepareJs
