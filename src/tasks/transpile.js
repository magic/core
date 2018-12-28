const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')
const is = require('@magic/types')

const library = require('../modules')
const { getFiles, isTagUsed, isUpperCase } = require('../lib')
const config = require('../config')

const transpile = app => {
  const files = getFiles(config.DIR.PAGE)

  const pages = transpile.pages(files, app)
  const dependencies = transpile.dependencies(app)

  return {
    pages,
    dependencies,
  }
}

transpile.file = file => {
  const name = file.replace(config.DIR.PAGE, '').replace('index.js', '')

  return {
    ...require(file)(library),
    name,
  }
}

transpile.pages = (files, app) => {
  const pages = files
    .map(transpile.file)
    .map(transpile.stringify)
    .map(page => ({
      ...page,
      state: deep.merge(app.state, page.state),
    }))
    .map(page => ({
      ...page,
      actions: deep.merge(app.actions, page.actions),
    }))
    .map(page => ({
      ...page,
      style: deep.merge(app.style, page.style),
    }))

  return pages
}

transpile.stringify = component => {
  component.str = ''
  Object.keys(component).forEach(key => {
    if (isUpperCase(key) && is.fn(component[key])) {
      component.str += component[key].toString()
    }
  })
  return component
}

transpile.vendor = ({ tags, components }) => {
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

transpile.dependencies = str => {
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
            const keys = transpile.dependencies(dep.toString())
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

module.exports = transpile
