const is = require('@magic/types')
const { fs } = require('../../lib')

const { stringifyObject, handleDeps } = require('./lib')
const { babel, isUpperCase } = require('../../lib')

const prepareClient = async app => {
  // importing hyperapp
  const hyperappImport = "const { app, h } = require('hyperapp')\n"

  let checkProps = ''
  if (config.ENV === 'development') {
    checkProps = `const CHECK_PROPS = ${global.CHECK_PROPS.toString()}`
  }

  // add the Component module that wraps all other html tags
  const componentString = `const C = ${global.component.toString()}\n`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  const tempDepString = Object.entries(app.modules)
    .map(([k, v]) => handleDeps(k, v))
    .join('')

  let libString = ''

  // define every lib import at the top of magic.js
  if (!is.empty(app.lib)) {
    if (!is.object(app.lib)) {
      throw new Error(`Expected app.lib to be an object, received ${typeof app.lib}, ${app.lib}`)
    }

    libString = 'const lib = {};'

    Object.entries(app.lib).forEach(([name, res]) => {
      res = require.resolve(res)

      const libContent = fs.readFileSync(res, 'utf8')
      let lib = libContent
      if (libContent.includes('module.exports')) {
        lib = libContent.replace('module.exports =', `lib.${name} =`)
      } else if (libContent.includes('exports')) {
        libString += `\n lib.${name} = lib.${name} || {};\n`
        lib = libContent.replace('exports.', `lib.${name}.`)
      } else {
        throw new Error(`library ${name} has no exports`)
      }

      const str = `\n  (() => {\n    ${lib}\n  })();\n`
      libString += str
    })
    libString += '\nwindow.LIB = lib\n'
    // clientString += libString
  }

  // create pages object, each Page is a html View
  let pageString = 'const pages = {\n'

  app.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })

  pageString += '\n}\n'

  // handle global app state
  const stateString = `const state = ${stringifyObject(app.state)}`

  // set state.url, can not be done above
  const urlString = `\nstate.url = window.location.pathname`

  const rootString = `\nstate.root = '${config.WEB_ROOT}'`

  // create global actions object
  const actionString = `const actions = ${stringifyObject(app.actions)}\n`

  // get inner View from app
  let b = app.Body.toString().split("{ id: 'magic' },\n")[1]

  // remove last two characters from inner app view
  b = b.substr(0, b.length - 1).trim()
  b = b.substr(0, b.length - 1).trim()

  // routing view
  const viewString = `
const view = (state, actions) => {
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

  // map pageActions into actions
  if (actions.pages) {
    const pageActions = actions.pages[url]
    for (let key in pageActions) {
      actions[key] = pageActions[key]
    }
  }

  return ${b}
}
`

  // get #magic div from html, create it if it does not exist,
  // then mount the app in it.
  const createMagic = `
const d = document
let mD = d.getElementById('magic')
if (!mD) {
  mD = d.createElement('div')
  mD.id = 'magic'
  d.body.appendChild(mD)
}
app(state, actions, view, mD)\n`

  const tempClientString = [
    hyperappImport,
    checkProps,
    componentString,
    tempDepString,
    libString,
    pageString,
    stateString,
    urlString,
    rootString,
    actionString,
    viewString,
    createMagic,
  ]
    .filter(a => a)
    .join('\n')

  const ast = await babel.parseAsync(tempClientString, babel.opts)

  const moduleNames = Object.keys(app.modules)

  const usedModules = new Set()
  babel.traverse(ast, {
    Identifier(path) {
      const { node, parent } = path
      if (moduleNames.includes(node.name)) {
        const excludedParentTypes = [
          'MemberExpression',
          'VariableDeclarator',
          'BinaryExpression',
          'UpdateExpression',
        ]
        if (!excludedParentTypes.some(t => parent.type === t)) {
          usedModules.add(node.name)
        }
      } else if (isUpperCase(node.name)) {
        const { object } = parent
        if (object && moduleNames.includes(object.name)) {
          const name = `${object.name}.${node.name}`
          usedModules.add(name)
        }
      }
    },
  })

  const cleanDependencies = {}
  Array.from(usedModules)
    // make subModules apply last
    .sort(key => (key.includes('.') ? 1 : -1))
    .forEach(key => {
      if (!key.includes('.')) {
        cleanDependencies[key] = app.modules[key]
      } else {
        // submodules
        const [parName, modName] = key.split('.')

        // if the module is not referenced directly in the source, we default to an object
        const parComp = cleanDependencies[parName] || {}

        parComp[modName] = app.modules[parName][modName]
        cleanDependencies[parName] = parComp
      }
    })

  let dependencyString = ''

  Object.entries(cleanDependencies).forEach(([k, v]) => {
    const depString = handleDeps(k, v)
    dependencyString += depString
  })

  let clientString = [
    hyperappImport,
    checkProps,
    componentString,
    dependencyString,
    libString,
    pageString,
    stateString,
    urlString,
    rootString,
    actionString,
    viewString,
    createMagic,
  ]
    .filter(a => a)
    .join('\n')

  // // prepend client urls with WEB_ROOT url in production,
  // // this allows, for example, username.github.io/packagename
  if (config.ENV === 'production' && config.WEB_ROOT !== '/') {
    clientString = clientString
      // find all links, callback gets match, key, delimiter, link
      .replace(
        /('|")?(src|href|to|action|logo)(\1)?\:\s*('|")(.*?)\4/gm,
        (match, d1, key, d2, d, link) => {
          if (link.startsWith(config.WEB_ROOT)) {
            return `${key}: '${link}'`
          }

          const isPageLink = app.pages.some(page =>
            link.startsWith(page.name.replace(config.WEB_ROOT, '/')),
          )
          const isStaticLink = Object.keys(app.static).some(key => key === link)

          if (isPageLink || isStaticLink) {
            link = config.WEB_ROOT + (link.startsWith('/') ? link.substr(1, link.length) : link)
            const str = `${key}: '${link}'`
            return str
          }

          // no matches, return unchanged string
          return match
        },
      )
  }

  return clientString
}

module.exports = prepareClient
