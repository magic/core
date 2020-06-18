import is from '@magic/types'
import cases from '@magic/cases'

const isModuleTag = (name, moduleNames) => moduleNames.includes(name)

const handleLink = (path, config) => {
  const { node } = path
  const href = node.value.value

  if (!href.startsWith(config.WEB_ROOT)) {
    const isLocal = href.startsWith('/') && !href.startsWith('//')
    const isHash = href.startsWith('#') || href.startsWith('/#')
    const isExtension = href.startsWith('-')

    if (isLocal || isHash) {
      node.value.value = `${config.WEB_ROOT}${href}`.replace(/\/\//g, '/')
    }
  }
}

// collect all used modules, htmlTags, actions, effects, helpers
const findUsedSpells = (t, app, config) => path => {
  // find used modules and html tags in app
  const moduleNames = Object.keys(app.modules)

  if (t.isCallExpression(path.node)) {
    // is a module
    if (t.isIdentifier(path.node.callee)) {
      const { name } = path.node.callee
      const isModule = isModuleTag(name, moduleNames)
      if (isModule) {
        app.used.tags.add(name)
      }
      // is a lib function
    } else if (t.isMemberExpression(path.node.callee)) {
      const { callee } = path.node
      const { key, object } = callee
      let name = false
      if (t.isMemberExpression(callee)) {
        name = object.name

        if (name === 'lib') {
          name = callee.property.name
        }
      } else if (key) {
        name = key.name
      }

      if (name) {
        const kebabName = cases.kebab(name)
        if (Object.keys(app.lib).includes(kebabName)) {
          if (is.string(app.lib[kebabName])) {
            app.used.lib[name] = {}
          }
        }
      }
    } else {
      // console.log('unexpected callee type', path.node.callee)
    }
  }

  // let's look for src and logo fields
  // to make sure images and scripts are linked to correctly,
  // according to config.WEB_ROOT
  if (t.isObjectProperty(path.node)) {
    if (path.node.key) {
      const validKeys = ['src', 'logo'] //, 'href', 'to']
      if (path.node.key.name) {
        const { name } = path.node.key
        if (path.node.value.value) {
          if (validKeys.includes(name)) {
            handleLink(path, config)
          }
        }
      } else if (path.node.key.value) {
        const { value: name } = path.node.key
        if (validKeys.includes(name)) {
          handleLink(path, config)
        }
      }
    }
  } else if (t.isArrayExpression(path.node)) {
    const [action, helper] = path.node.elements

    // find actions, effects and subscriptions..
    if (action) {
      if (t.isMemberExpression(action)) {
        const { name: type } = action.object
        // console.log({ type, action })
        if (app.used[type]) {
          if (t.isMemberExpression(action.object)) {
            const { name: objName } = action.object.object
            const { name: propName } = action.object.property

            if (type !== objName) {
              app.used[type][objName] = app.used[type][objName] || {}
              app.used[type][objName][propName] = {}
            } else {
              app.used[type] = app.used[type] || {}
              app.used[type][propName] = {}
            }
          } else if (t.isIdentifier(action.object)) {
            const { name: objName } = action.object
            const { name: propName } = action.property

            if (objName !== type) {
              app.used[type][objName] = app.used[type][objName] || {}
              app.used[type][objName][propName] = {}
            } else {
              app.used[type] = app.used[type] || {}
              app.used[type][propName] = {}
            }
          }
        }
      }

      if (t.isMemberExpression(helper)) {
        const { name: type } = helper.object
        if (app.used.hasOwnProperty(type)) {
          if (t.isMemberExpression(helper.object)) {
            const { name: objName } = helper.object.object
            const { name: propName } = helper.object.property
            app.used[type][objName] = app.used[type][objName] || {}
            app.used[type][objName][propName] = {}
          } else if (t.isIdentifier(helper.object)) {
            const { name: objName } = helper.object
            const { name: propName } = helper.property

            if (objName !== type) {
              app.used[type][objName] = app.used[type][objName] || {}
              app.used[type][objName][propName] = {}
            } else {
              app.used[type] = app.used[type] || {}
              app.used[type][propName] = {}
            }
          }
        }
      }
    }
  }
}

const removeUnused = (t, app) => path => {
  const moduleNames = Object.keys(app.modules)
  const usedTagNames = Array.from(app.used.tags)

  if (t.isVariableDeclarator(path.node)) {
    const { name } = path.node.id

    if (name && isModuleTag(name, moduleNames)) {
      if (!usedTagNames.includes(name)) {
        if (isModuleTag(name, moduleNames)) {
          if (!is.case.upper(name[0])) {
            const init = path.node.init
            if (!init) {
              return
            }

            const callee = init.callee
            if (!callee || callee.name !== 'C') {
              return
            }

            console.log('removed html tag', name)
            path.remove()
          } else {
            console.log('removed @magic-module', name)
            path.remove()
          }
        }
      }
    }
  }
}

export default (app, config) => {
  app.used = {
    actions: {},
    effects: {},
    subscriptions: {},
    helpers: {},
    lib: {},
    tags: new Set(),
  }

  return ({ types: t }) => ({
    visitor: {
      Program: {
        enter(path) {
          path.traverse({ enter: findUsedSpells(t, app, config) })
        },
        // exit(path) {
          // path.traverse({ enter: removeUnused(t, app, config) })
        // },
      },
    },
  })
}
