import is from '@magic/types'
import { isUpperCase } from '../isUpperCase.mjs'

const isModuleTag = (name, moduleNames) => moduleNames.includes(name)

const used = {
  actions: {},
  effects: {},
  helpers: {},
  lib: {},
  tags: new Set(),
}

const handleEventFunctions = (path, t) => {
  if (t.isArrayExpression(path.node.value)) {
    const { elements } = path.node.value
    const [action, helper] = elements
    if (action.object && action.object.object) {
      const actionObjectName = action.object.object.name
      const actionPropertyName = action.object.property && action.object.property.name
      const actionName = action.property.name
      used[actionObjectName][actionPropertyName] = used[actionObjectName][actionPropertyName] || {}

      used[actionObjectName][actionPropertyName][actionName] = {}
    }
    if (helper.object && helper.object.object) {
      const helperObjectName = helper.object.object.name
      const helperPropertyName = helper.object.property && helper.object.property.name
      const helperName = helper.property.name
      if (helperObjectName === 'helper') {
        used.helper[helperPropertyName] = used.helper[helperPropertyName] || {}
        used.helper[helperPropertyName][helperName] = {}
      }
    }
  } else {
    console.log(path.node)
  }
}

const findInteractionsByType = (app, t, path, type) => {
  const { node } = path
  const { value } = node.key

  if (app[type].hasOwnProperty(value)) {
    console.log({ value })
  }
}

// collect all used modules, htmlTags, actions, effects, helpers
const findUsedSpells = (t, app, config) => path => {
  // find used modules and html tags in app
  const moduleNames = Object.keys(app.modules)
  if (t.isCallExpression(path.node)) {
    if (t.isIdentifier(path.node.callee)) {
      const name = path.node.callee.name
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
      } else if (key) {
        name = key.name
      }

      if (Object.keys(app.lib).includes(name)) {
        if (is.string(app.lib[name])) {
          used.lib[name] = {}
        }
      }
    } else {
      // console.log('unexpected callee type', path.node)
    }
  }

  const handleLink = (node, config) => {
    const href = node.value.value
    if (href.startsWith('/') && !href.startsWith(config.WEB_ROOT)) {
      node.value.value = `${config.WEB_ROOT}${href}`.replace(/\/\//g, '/')
    }
  }

  if (t.isObjectProperty(path.node)) {
    if (path.node.key) {
      if (path.node.key.name) {
        const { name } = path.node.key
        if (path.node.value.value) {
          if (name === 'src') {
            handleLink(path.node, config)
          }
        }
      } else if (path.node.key.value) {
        const { value: name } = path.node.key
        if (name === 'src') {
          handleLink(path.node, config)
        }
      }
    } else {
      console.log('no key in node', path.node)
    }
  } else if (t.isArrayExpression(path.node)) {
    const [action, helper] = path.node.elements
    if (!action) {
      return
    }

    if (t.isMemberExpression(action)) {
      const { name: type } = action.object
      if (used.hasOwnProperty(type)) {
        if (t.isMemberExpression(action.object)) {
          const { name: objName } = action.object.object
          const { name: propName } = action.object.property
          used[type][objName] = used[type][objName] || {}
          used[type][objName][propName] = {}
        } else if (t.isIdentifier(action.object)) {
          const { name: objName } = action.object
          const { name: propName } = action.property
          used[type][objName] = used[type][objName] || {}
          used[type][objName][propName] = {}
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
          used[type][objName] = used[type][objName] || {}
          used[type][objName][propName] = {}
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

const removeUnused = (t, app) => path => {
  const moduleNames = Object.keys(app.modules)
  const usedTagNames = Array.from(used.tags)

  if (t.isVariableDeclarator(path.node)) {
    const { name } = path.node.id
    if (name && isModuleTag(name, moduleNames)) {
      if (!usedTagNames.includes(name)) {
        if (isModuleTag(name, moduleNames)) {
          if (!isUpperCase(name)) {
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
        // console.log(name, path.node, path.node.init.properties)
      }
      if (name === 'actions') {
        // remove unused actions
        path.node.init.properties.forEach(prop => {
          const { value: name } = prop.key
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
