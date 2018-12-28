const fs = require('fs')
const path = require('path')
const css = require('@magic/css')
const deep = require('@magic/deep')
const is = require('@magic/types')
const { renderToString } = require('hyperapp-render')
const { getFiles, app, mkdirp } = require('./lib/')
const library = require('./lib/modules')

const config = require('./config')

const isUpperCase = n => n[0].toUpperCase() === n[0]

const merge = {
  state: (parent, component) => deep.merge(parent.state, component.state),
  actions: (parent, component) => deep.merge(parent.actions, component.actions),
  style: (parent, component) => deep.merge(parent.style, component.style),
}

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

  vendor: dependencies => {
    const componentFile = path.join(__dirname, 'lib', 'modules', 'component.js')
    let vendorString = ''
    vendorString += fs.readFileSync(componentFile, 'utf8')
      .replace(/const (.*?) = require\((.*?)\)/gm, (m, $1, $2) => `import ${$1} from ${$2}`)
      .replace('module.exports = component', '')
      .replace('const component', 'export const C')
      .replace(/attributes/gm, 'a')
      .replace(/name/gm, 'n')
      .replace(/children/gm, 'c')

    vendorString += `
const deps = {}
['${Object.keys(dependencies).join(",'")}'].forEach(d => deps[d] = C(d))
export default deps
`
    vendorString = vendorString.replace(/\n/gim, ' ').replace(/\s\s*/gim, ' ')
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

const isTagUsed = str => fn =>
  str.includes(` ${fn}(`) ||
  str.includes(`,${fn}(`) ||
  str.includes(`\n${fn}(`) ||
  str.includes(`[${fn}(`) ||
  str.includes(`(${fn})`) ||
  str.includes(`(${fn}(`)

const getDependencies = pages => {
  const allDeps = [...app.dependencies, pages.map(page => page.dependencies)]

  const dependencies = {}
  deep.flatten(allDeps).forEach(key => {
    dependencies[key] = dependencies[key] ? dependencies[key] + 1 : 1
  })

  const components = []
  const tags = []
  Object.keys(dependencies).forEach(dep => {
    if (isUpperCase(dep)) {
      components.push(dep)
    } else {
      tags.push(dep)
    }
  })

  return {
    dependencies,
    components,
    tags,
  }
}

const used = {
  selectors: (str, selector, sep = '"', nope = '<') => {
    return str
      .split(selector)
      .map(s => s.split(sep)[0])
      .filter(s => !s.startsWith(nope))
      .filter(s => s)
  },
  tags: str => used.selectors(str, '<', /(>|\s)/, '/').filter(s => !s.startsWith('!')),
  classes: str => used.selectors(str, 'class="'),
  ids: str => used.selectors(str, 'id="'),
}

const renderApp = () => {
  const files = getFiles(config.DIR.PAGE)

  const pages = prepare.pages(files)

  app.str = app.View.toString()
  app.dependencies = prepare.dependencies(app.str)

  let style = {}
  pages.forEach(page => {
    page.dependencies = prepare.dependencies(page.str)
    page.dependencies.forEach(dep => {
      const lib = library[dep] || {}
      if (lib.state) {
        page.state = deep.merge(lib.state, page.state)
      }
      if (lib.actions) {
        page.actions = deep.merge(lib.actions, page.actions)
      }
      if (lib.style) {
        page.style = deep.merge(lib.style, page.style)
      }
    })

    page.rendered = renderToString(app.View(page), page.state, page.actions)
    style = deep.merge(style, page.style)
    let pagePath = path.join(config.DIR.TMP, page.name)
    mkdirp(pagePath)
    if (!pagePath.endsWith('index.js') && pagePath.endsWith('/')) {
      pagePath = path.join(pagePath, 'index.html')
    }
    fs.writeFileSync(pagePath, page.rendered)
  })

  const { dependencies, components, tags } = getDependencies(pages)

  const vendor = prepare.vendor(dependencies)
  console.log(vendor)

  const preparedStyle = css(style)
  fs.writeFileSync(path.join(config.DIR.TMP, 'main.css'), preparedStyle.minified)
}

renderApp()
