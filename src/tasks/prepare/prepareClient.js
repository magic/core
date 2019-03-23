const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')

const { stringifyObject, handleDeps } = require('./lib')

const prepareClient = app => {
  let clientString = ''

  // read original hyperapp from nodemodules
  const hyperappFile = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
  const hyperappContent = fs
    .readFileSync(hyperappFile, 'utf8')
    // declare functions globally instead of exporting them
    .replace(/export function (.*)\(/gm, (_, $1) => `function ${$1}(`)

  clientString += hyperappContent

  const libFile = path.join(config.DIR.ASSETS, 'lib.js')
  if (fs.existsSync(libFile)) {
    const libs = require(libFile)
    console.log({ libs })
  }

  clientString += `const C = ${global.component.toString()}\n`
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  if (process.env.NODE_ENV !== 'production') {
    app.dependencies = deep.merge(global.tags.body, app.dependencies)
  }

  const depString = Object.entries(app.dependencies)
    .map(handleDeps)
    .join('')

  clientString += depString

  let pageString = 'const pages = {\n'

  app.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })

  pageString += '\n}\n'
  clientString += pageString

  const stateString = `const state = ${stringifyObject(app.state)}\n`
  clientString += stateString

  const urlString = `\nstate.url = window.location.pathname\n`

  clientString += urlString

  const actionString = `const actions = ${stringifyObject(app.actions)}\n`
  clientString += actionString

  // get inner View from app
  let b = app.Body.toString().split("{ id: 'magic' },\n")[1]

  // remove last two commas
  b = b.substr(0, b.length - 1).trim()
  b = b.substr(0, b.length - 1).trim()

  const viewString = `
const view = (state, actions) => {
  const url = pages[state.url] ? state.url : '/404/'
  // used below, is kind of a global!
  const page = pages[url]

  const pageState = state.pages[url]
  for (let key in pageState) {
    state[key] = pageState[key]
  }
  const pageActions = actions.pages[url]
  for (let key in pageActions) {
    actions[key] = pageActions[key]
  }

  return ${b}
}
`

  clientString += viewString

  const createMagic = `
const d = document
let mD = d.getElementById('magic')
if (!mD) {
  mD = d.createElement('div')
  mD.id = 'magic'
  d.body.appendChild(mD)
}
app(state, actions, view, mD)\n`
  clientString += createMagic

  if (process.env.NODE_ENV === 'production' && config.WEB_ROOT && config.WEB_ROOT !== '/') {
    clientString = clientString
      // replace urls
      .replace(/ '\//gm, `'${config.WEB_ROOT}`)
      .replace(/ "\//gm, `"${config.WEB_ROOT}`)
  }

  return clientString
}

module.exports = prepareClient
