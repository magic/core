import path from 'path'

import is from '@magic/types'

import { fs, isUpperCase, stringifyObject } from '../../lib/index.mjs'

const prepareClient = async magic => {
  const hyperappPath = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
  const hyperappContent = await fs.readFile(hyperappPath, 'utf8')

  const hyperapp = `
const { h, Lazy, app } = (() => {
${hyperappContent.replace(/export /g, ' ')}

return {
  h,
  app,
  Lazy,
}
})()`

  // add the Component module that wraps all other html tags
  const componentString = `const C = ${global.component.toString()}\n`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  let checkProps = ''
  if (config.IS_DEV) {
    checkProps = `const CHECK_PROPS = ${global.CHECK_PROPS.toString()}`
  }

  let depString = ''
  let htmlTagString = ''
  Object.entries(magic.modules)
    .filter(([k]) => k !== 'Magic' && k !== 'component')
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
          .map(([sk, sv]) => `${k}.${sk} = ${sv.toString()}`)
          .join('\n')

        depString += `${str}\n${subStr}`
      }
    })

  let stateString = `const initialState = ${stringifyObject(magic.state)}`

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
    subscriptionString = `const subscriptions = state => [${Object.values(magic.subscriptions).join(
      ',\n',
    )}]`
    console.log(subscriptionString)
  }

  let libString = ''
  if (!is.empty(magic.lib)) {
    libString = 'const LIB = {'
    const libPromises = Object.entries(magic.lib).map(async ([name, lib]) => {
      if (lib.startsWith('@')) {
        lib = path.join(process.cwd(), 'node_modules', lib)
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

  magic.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })

  pageString += '\n}\n'

  const appString = `
app({
  init: () => ({
    ...initialState,
    url: window.location.pathname,
  }),
  ${
    !is.empty(magic.subscriptions)
      ? `subscriptions: state => [${Object.values(magic.subscriptions).join(',\n')}],`
      : ''
  }
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
  // console.log(clientString)
  const clientString = [
    hyperapp,
    componentString,
    htmlTagString,
    stateString,
    actionString,
    depString,
    libString,
    effectString,
    // subscriptionString,
    pageString,
    appString,
  ]
    .join('\n')
    .trim()
  // .replace(/CHECK_PROPS((.*))\n/g, '')

  return clientString
}
export default prepareClient
