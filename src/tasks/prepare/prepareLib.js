const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')
const is = require('@magic/types')

const { getFiles, isTagUsed, isUpperCase, getDependencies } = require('../../lib/')

const { stringifyObject, handleDeps } = require('./lib/')

const prepareLib = () => {
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

  const depString = Object.entries(global.app.dependencies)
    .map(handleDeps)
    .join('')

  libString += depString

  libString += 'const pages = {}\n'

  let has404 = false

  global.app.pages.forEach(page => {
    if (page.name === '/404/') {
      has404 = true
    }

    const componentArgString = [
      '=> {',
      `state = { ...state, ...state.pages['${page.name}'] };`,
      `actions = { ...actions, ...actions.pages['${page.name}'] };`,
      'return ',
    ].join(' ')

    const view = page.Body.toString()
    // replace first arrow
    // .replace('=>', componentArgString)

    const str = `pages['${page.name}'] = ${view}\n`
    libString += str
  })

  if (!has404) {
    libString += 'pages["404"] = div("404 not found")\n'
  }

  const stateString = `const state = ${stringifyObject(global.app.state)}\n`
  libString += stateString

  const actionString = `const actions = ${stringifyObject(global.app.actions)}\n`
  libString += actionString

  const viewString = `
const view = (state, actions) => {
  const page = pages[state.url]
  Object.assign(state, state.pages[state.url])
  Object.assign(actions, actions.pages[state.url])

  return div({ class: 'wrapper' }, [
    state.menu && Menu.View(state, actions),
    page
      ? page(state, actions)
      : pages['404'],
  ])
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

  return libString
}

module.exports = prepareLib
