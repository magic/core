import is from '@magic/types'

import {
  CHECK_PROPS,
  runBabel,
  fs,
  handleDependencies,
  isUpperCase,
  stringifyObject,
} from '../../lib/index.mjs'

const prepareClient = async magic => {
  let checkProps = ''
  // first we have to import propTypes for all modules below
  // if (config.ENV === 'development') {
  //   checkProps = `const CHECK_PROPS = ${CHECK_PROPS.toString()}`
  // }

  // add the Component module that wraps all other html tags
  const componentString = `const C = ${global.component.toString()}`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  const depString = Object.entries(magic.modules)
    .map(([k, v]) => {
      if (k === 'component') {
        return ''
      }
      if (!isUpperCase(k)) {
        return `const ${k} = C('${k}')`
      }
      let componentString = ''
      if (is.function(v)) {
        componentString = v.toString()
      } else if (is.function(v.View)) {
        componentString = v.View.toString()
      }

      if (!componentString) {
        log.error('Invalid Module', k, typeof v, 'is not a function and has no .View key')
        return
      }

      let append = ''
      const Views = Object.entries(v).filter(([k]) => isUpperCase(k) && k !== 'View')

      if (is.object(v) && !is.empty(Views)) {
        append = Views.map(([sk, sv]) => {
          let subModuleString = ''
          if (is.function(sv)) {
            subModuleString = sv.toString()
          } else if (is.function(sv.View)) {
            subModuleString = sv.View.toString()
          }

          if (!subModuleString) {
            log.error(
              'Invalid SubModule',
              'parent:',
              k,
              'submodule:',
              sk,
              typeof sv,
              'is not a function and has no .View key',
            )
            return
          }

          return `const ${sk} = ${subModuleString}`
        }).join('\n')
      }

      return `const ${k} = ${componentString}${append ? `\n${append}` : ''}`
    })
    .join('\n')

  // handle global magic state
  let stateString = `const initialState = ${stringifyObject(magic.state)}`

  // set state.url, can not be done above
  const urlString = `initialState.url = window.location.pathname`
  const rootString = `initialState.root = '${config.WEB_ROOT}'`

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
    subscriptionString = `const subscriptions = ${stringifyObject(magic.subscriptions)}`
  }

  let libString = ''
  if (!is.empty(magic.lib)) {
    let libSubString = ''
    Object.entries(magic.lib)
      .forEach(([name, lib]) => {
        if (is.fn(lib)) {
          libSubString += `\n  ${name}: ${lib.toString()},`
        } else if (is.object(lib)) {
          libSubString += `\n  ${name}: ${stringifyObject(lib)},`
        }
      })

    if (libSubString) {
      libString = `const LIB = {${libSubString}\n}`
    }
  }

  // create pages object, each Page is a html View
  let pageString = 'const pages = {\n'

  magic.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })

  pageString += '\n}\n'

  // routing view
  const routerString = `
const view = (state) => {
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

  return Page({ page, state })
}
`

  const appString = `
app({
  init: () => initialState,
  view,
  node: document.getElementById("Magic")
})
`
  // console.log(clientString)
  const clientString = [
    checkProps,
    componentString,
    depString,
    stateString,
    urlString,
    rootString,
    actionString,
    effectString,
    subscriptionString,
    libString,
    pageString,
    routerString,
    appString,
  ]
    .join('\n')
    .replace(/\n\n/g, '\n')
    .trim()
    .replace(/CHECK_PROPS((.*))\n/g, '')

  return clientString
}
export default prepareClient
