const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')
const is = require('@magic/types')

const library = require('../modules')
const { getFiles, isTagUsed, isUpperCase } = require('../lib')
const config = require('../config')

const stringifyComponent = component => {
  component.str = ''
  Object.keys(component).forEach(key => {
    if (isUpperCase(key) && is.fn(component[key])) {
      component.str += component[key].toString()
    }
  })
  return component
}

const prepare = ({ app }) => {
  const files = getFiles(config.DIR.PAGES)

  const pages = prepare.pages(files, app)
  app.dependencies = prepare.dependencies(app)

  return {
    pages,
    app,
  }
}

prepare.file = file => {
  const name = file.replace(config.DIR.PAGES, '').replace('index.js', '')

  return {
    ...require(file)(library),
    name,
  }
}

prepare.pages = (files, app) => {
  const pages = files
    .map(prepare.file)
    .map(stringifyComponent)
    .map(page => ({
      ...page,
      state: deep.merge(app.state, page.state),
      actions: deep.merge(app.actions, page.actions),
      style: deep.merge(app.style, page.style),
    }))

  return pages
}

prepare.vendor = ({ tags, components }) => {
  const hyperappFile = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
  const hyperappContent = fs
    .readFileSync(hyperappFile, 'utf8')
    .replace(/export function (.*)\(/gm, (_, $1) => `window.${$1} = function ${$1}(`)

  let vendorString = ''
  vendorString += hyperappContent

  vendorString += `const C = window.C = ${library.component.toString()}\n`
    .replace(/attributes/gm, 'a')
    .replace(/name/gm, 'n')
    .replace(/children/gm, 'c')

  tags.forEach(tag => {
    vendorString += `const ${tag} = window.${tag} = C('${tag}')\n`
  })

  components.forEach(comp => {
    vendorString += `const ${comp} = window.${comp} = ${library[comp].toString()}\n`
  })

  return vendorString
}

prepare.dependencies = str => {
  if (is.fn(str.View)) {
    str = str.View.toString()
  }

  const deps = Object.keys(library)
    .filter(isTagUsed(str))
    .map(key => {
      if (isUpperCase(key)) {
        const dep = library[key]
        if (dep) {
          if (is.fn(dep.toString)) {
            const keys = prepare.dependencies(dep.toString())
            return [key, ...keys]
          }
        }
      } else {
        if (is.function(library.tags.body[key])) {
          return key
        }
      }
    })
    .filter(a => a)

  return deep.flatten(deps)
}

module.exports = prepare
