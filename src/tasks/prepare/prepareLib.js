const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')
const is = require('@magic/types')

const { getFiles, isTagUsed, isUpperCase, getDependencies, applyWebRoot } = require('../../lib/')

const { stringifyObject, handleDeps } = require('./lib/')

const prepareLib = (app) => {
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

  const depString = Object.entries(app.dependencies)
    .map(handleDeps)
    .join('')

  libString += depString

  let pageString = 'const pages = {\n'

  let has404 = false

  app.pages.forEach(page => {
    if (page.name === '/404/') {
      has404 = true
    }

    let view = page.Body.toString()

    pageString += `\n  '${page.name}': ${view},`
  })

  if (!has404) {
    pageString += '\n  "/404/": div("404 not found"),'
  }

  pageString += '\n}\n'
  libString += pageString

  const stateString = `const state = ${stringifyObject(app.state)}\n`
  libString += stateString

  const urlString = `\nstate.url = window.location.pathname\n`
  libString += urlString

  const actionString = `const actions = ${stringifyObject(app.actions)}\n`
  libString += actionString

  const b = app.Body.toString()
    .split("{ id: 'magic' },")[1]
    .split('    )')[0]
    .trim()

  const wrapper = b.substr(0, b.length - 1)

  const viewString = `
function view(state, actions) {
  const page = pages[state.url]
  state = { ...state.pages[state.url], ...state }
  actions = { ...actions.pages[state.url], ...actions }

  return ${wrapper}
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
app(state, actions, view, mD)\n
`
  libString += createMagic

  if (process.env.NODE_ENV === 'production' && config.WEB_ROOT && config.WEB_ROOT !== '/') {
    libString = libString
      // replace urls 
      .replace(/'\//gm, `'${config.WEB_ROOT}`)
      .replace(/"\//gm, `"${config.WEB_ROOT}`)
  }

  return libString
}

module.exports = prepareLib
