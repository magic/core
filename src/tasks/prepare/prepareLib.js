const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')

const { stringifyObject, handleDeps } = require('./lib/')

const prepareLib = app => {
  let libString = ''

  const hyperappFile = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
  const hyperappContent = fs
    .readFileSync(hyperappFile, 'utf8')
    .replace(/export function (.*)\(/gm, (_, $1) => `function ${$1}(`)

  libString += hyperappContent

  libString += `const C = ${global.component.toString()}\n`
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  if (process.env.NODE_ENV !== 'production') {
    app.dependencies = deep.merge(global.tags.body, app.dependencies)
  }

  const depString = Object.entries(app.dependencies)
    .map(handleDeps)
    .join('')

  libString += depString

  let pageString = 'const pages = {\n'

  app.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })

  pageString += '\n}\n'
  libString += pageString

  const stateString = `const state = ${stringifyObject(app.state)}\n`
  libString += stateString

  const urlString = `\nstate.url = window.location.pathname\n`

  libString += urlString

  const actionString = `const actions = ${stringifyObject(app.actions)}\n`
  libString += actionString

  let b = app.Body.toString().split("{ id: 'magic' },\n")[1]

  b = b.substr(0, b.length - 1).trim()
  b = b.substr(0, b.length - 1).trim()

  const viewString = `
function view(state, actions) {
  const page = pages[state.url]

  const pageState = state.pages[state.url]
  for (let key in pageState) {
    state[key] = pageState[key]
  }
  const pageActions = actions.pages[state.url]
  for (let key in pageActions) {
    actions[key] = pageActions[key]
  }

  return ${b}
}
`

  libString += viewString

  const createMagic = `
const d = document
let mD = d.getElementById('magic')
if (!mD) {
  mD = d.createElement('div')
  mD.id = 'magic'
  d.body.appendChild(mD)
}
app(state, actions, view, mD)\n`
  libString += createMagic

  if (process.env.NODE_ENV === 'production' && config.WEB_ROOT && config.WEB_ROOT !== '/') {
    libString = libString
      // replace urls
      .replace(/ '\//gm, `'${config.WEB_ROOT}`)
      .replace(/ "\//gm, `"${config.WEB_ROOT}`)
  }

  return libString
}

module.exports = prepareLib
