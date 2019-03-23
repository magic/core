const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')

const { stringifyObject, handleDeps } = require('./lib')

const prepareClient = app => {
  let clientString = ''

  // importing hyperapp
  clientString += "const { app, h } = require('hyperapp')\n"

  // define every lib import at the top of magic.js
  if (app.lib.length) {
    app.lib.forEach(([name, res]) => {
      clientString += `const ${name} = require('${res}')\n`
    })
  }

  // add the Component module that wraps all other html tags
  clientString += `const C = ${global.component.toString()}\n`
    // replace names of variables to enforce minification
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  if (process.env.NODE_ENV !== 'production') {
    // add all html tags to development bundle.
    // this will allow easier usage of wysiwyg editors
    app.dependencies = deep.merge(global.tags.body, app.dependencies)
  }

  // create string of required dependent modules
  const depString = Object.entries(app.dependencies)
    .map(handleDeps)
    .join('')

  clientString += depString

  // create pages object, each Page is a html View
  let pageString = 'const pages = {\n'
  app.pages.forEach(page => {
    pageString += `\n  '${page.name}': ${page.View.toString()},`
  })
  pageString += '\n}\n'
  clientString += pageString

  // handle global app state
  const stateString = `const state = ${stringifyObject(app.state)}\n`
  clientString += stateString

  // set state.url, can not be done above
  const urlString = `\nstate.url = window.location.pathname\n`
  clientString += urlString

  // create global actions object
  const actionString = `const actions = ${stringifyObject(app.actions)}\n`
  clientString += actionString

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
  const pageState = state.pages[url]
  for (let key in pageState) {
    state[key] = pageState[key]
  }

  // map pageActions into actions
  const pageActions = actions.pages[url]
  for (let key in pageActions) {
    actions[key] = pageActions[key]
  }

  return ${b}
}
`
  clientString += viewString

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
  clientString += createMagic

  // prepend client urls with WEB_ROOT url in production,
  // this allows, for example, username.github.io/packagename
  if (process.env.NODE_ENV === 'production' && config.WEB_ROOT && config.WEB_ROOT !== '/') {
    clientString = clientString
      .replace(/ '\//gm, `'${config.WEB_ROOT}`)
      .replace(/ "\//gm, `"${config.WEB_ROOT}`)
  }

  return clientString
}

module.exports = prepareClient
