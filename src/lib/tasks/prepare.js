const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')
const is = require('@magic/types')
const { app, isTagUsed } = require('../')
const library = require('../modules')
const merge = require('./merge')

const config = require('../../config')

const isUpperCase = n => n[0].toUpperCase() === n[0]

const prepare = {
  file(file) {
    const name = file.replace(config.DIR.PAGE, '').replace('index.js', '')

    return {
      ...require(file)(library),
      name,
    }
  },

  pages(files) {
    const pages = files
      .map(prepare.file)
      .map(prepare.stringify)
      .map(page => ({
        ...page,
        state: merge.state(app, page),
      }))
      .map(page => ({
        ...page,
        actions: merge.actions(app, page),
      }))
      .map(page => ({
        ...page,
        style: merge.style(app, page),
      }))

    return pages
  },

  stringify: component => {
    component.str = ''
    Object.keys(component).forEach(key => {
      if (isUpperCase(key) && is.fn(component[key])) {
        component.str += component[key].toString()
      }
    })
    return component
  },

  vendor: ({ tags, components }) => {
    const hyperappFile = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.js')
    const hyperappContent = fs.readFileSync(hyperappFile, 'utf8')
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
  },

  dependencies: str => {
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
  },
}

module.exports = prepare