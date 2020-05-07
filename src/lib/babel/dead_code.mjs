import is from '@magic/types'
import cases from '@magic/cases'

const isModuleTag = (name, moduleNames) => moduleNames.includes(name)

const used = {
  actions: {},
  effects: {},
  helpers: {},
  lib: {},
  tags: new Set(),
}

const handleLink = (path, config) => {
  const { node } = path
  const href = node.value.value

  if (!href.startsWith(config.WEB_ROOT)) {
    const isLocal = href.startsWith('/') && !href.startsWith('//')
    const isHash = href.startsWith('#') || href.startsWith('/#')
    const isExtension = href.startsWith('-')

    // if (isExtension) {
    //   console.log('is extension', href, path)
    // }

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
    if (t.isIdentifier(path.node.callee)) {
      const { name } = path.node.callee
      const isModule = isModuleTag(name, moduleNames)
      if (isModule) {
        used.tags.add(name)
      }
    } else if (t.isMemberExpression(path.node.callee)) {
      const { callee } = path.node
      const { key, object } = callee
      let name
      if (t.isMemberExpression(callee)) {
        name = object.name

        if (object.name === 'lib') {
          name = callee.property.name
        }
      } else if (key) {
        name = key.name
      }

      if (name) {
        const kebabName = cases.kebab(name)
        if (Object.keys(app.lib).includes(kebabName)) {
          if (is.string(app.lib[kebabName])) {
            used.lib[name] = {}
          }
        }
      }
    } else {
      // console.log('unexpected callee type', path.node.callee)
    }
  }

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

    if (action) {
      if (t.isMemberExpression(action)) {
        const { name: type } = action.object
        if (used[type]) {
          if (t.isMemberExpression(action.object)) {
            const { name: objName } = action.object.object
            const { name: propName } = action.object.property
            console.log({ objName, propName })
            if (type !== objName) {
              used[type][objName] = used[type][objName] || {}
              used[type][objName][propName] = {}
            } else {
              used[type] = used[type] || {}
              used[type][propName] = {}
            }
          } else if (t.isIdentifier(action.object)) {
            const { name: objName } = action.object
            const { name: propName } = action.property

            if (objName !== type) {
              used[type][objName] = used[type][objName] || {}
              used[type][objName][propName] = {}
            } else {
              used[type] = used[type] || {}
              used[type][propName] = {}
            }
          }
        }
      }

      if (t.isMemberExpression(helper)) {
        const { name: type } = helper.object
        if (used.hasOwnProperty(type)) {
          if (t.isMemberExpression(helper.object)) {
            const { name: objName } = helper.object.object
            const { name: propName } = helper.object.property
            used[type][objName] = used[type][objName] || {}
            used[type][objName][propName] = {}
          } else if (t.isIdentifier(helper.object)) {
            const { name: objName } = helper.object
            const { name: propName } = helper.property

            if (objName !== type) {
              used[type][objName] = used[type][objName] || {}
              used[type][objName][propName] = {}
            } else {
              used[type] = used[type] || {}
              used[type][propName] = {}
            }
          }
        }
      }
      // } else if (t.isAssignmentExpression(path.node)) {
      //   const { left, right } = path.node
      //   let objName
      //   let propName

      //   if (t.isMemberExpression(left)) {
      //     // props.onclick = action
      //     // console.log('member expression', left)
      //     objName = left.object.name
      //     propName = left.property.name
      //   } else if (t.isIdentifier(left)) {
      //     // props = { onclick: action }
      //     objName = left.name
      //   }

      //   console.log({ objName, propName })
    }
  }
}

const removeUnused = (t, app) => path => {
  const moduleNames = Object.keys(app.modules)
  const usedTagNames = Array.from(used.tags)

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

            // console.log('removed html tag', name)
            path.remove()
          } else {
            // console.log('removed @magic-module', name)
            path.remove()
          }
        }
      }
    } else {
      if (name === 'lib') {
        // remove unused lib imports
        // if (path.node.init && path.node.init.properties) {
        //   const { properties } = path.node.init
        //   properties.forEach(prop => {
        //     console.log(prop.key.name, Object.keys(used.lib).includes(prop.key.name))
        //   })
        //   console.log(used.lib);
        // }
      }

      if (name === 'actions') {
        // remove unused actions
        path.node.init.properties.forEach(prop => {
          const { value: name } = prop.key

          // console.log({ actions: used.actions })

          if (t.isFunctionExpression(prop.value)) {
            if (!used.actions || !used.actions.hasOwnProperty(name)) {
              // console.log('remove fn', name)
              // prop.remove()
            } else {
              // console.log('not remove fn', name)
            }
          } else if (t.isObjectExpression(prop.value)) {
            const { value: propName } = prop.value.properties[0].key
            if (
              !used.actions ||
              !used.actions[name] ||
              !used.actions[name].hasOwnProperty(propName)
            ) {
              //  console.log('remove actions', name, propName)
              //  prop.remove()
            } else {
              //  console.log('not remove action', name, propName)
            }
          } else {
            // console.log('unexpected action type', prop)
          }
        })
      }
    }
  }
}

export default (app, config) => ({ types: t }) => ({
  visitor: {
    Program: {
      enter(path) {
        path.traverse({ enter: findUsedSpells(t, app, config) })
      },
      exit(path) {
        path.traverse({ enter: removeUnused(t, app, config) })
      },
    },
  },
})
