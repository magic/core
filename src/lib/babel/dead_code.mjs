import cases from '@magic/cases'
import is from '@magic/types'

import { handleLink } from '../handleLink.mjs'

/**
 * A permissive structural view of Babel AST nodes:
 * indexable, callable, and array-like access all work.
 * @typedef {{ [key: string]: BabelValue, [key: number]: BabelValue }} BabelValue */

/**
 * The opts for `BabelPath.traverse`.
 * @typedef {{ enter: (path: BabelPath) => void }} TraverseOpts */

/**
 * A minimal structural view of a Babel traversal path.
 * @typedef {{ node: BabelValue, remove: () => void, traverse: (opts: TraverseOpts) => void }} BabelPath */

/**
 * A single Babel visitor node (enter/exit callbacks).
 * @typedef {{ enter?: (path: BabelPath) => void, exit?: (path: BabelPath) => void }} BabelVisitorNode */

/**
 * A map of Babel visitor node names to visitor nodes.
 * @typedef {{ [key: string]: BabelVisitorNode }} BabelVisitors */

/**
 * The subset of Babel `types` used here: node type guards.
 * @typedef {{ [key: string]: (node: unknown) => boolean }} BabelTypes */

/**
 * A bucket of used object members, eg `used.actions['lib'][name]`.
 * @typedef {{ [key: string]: { [key: string]: BabelValue } }} UsedBuckets */

/**
 * @param {unknown} name
 * @param {string[]} moduleNames
 * @returns {boolean}
 */
const isModuleTag = (name, moduleNames) => moduleNames.includes(String(name))

/** @type {{ actions: UsedBuckets, effects: UsedBuckets, helpers: UsedBuckets, lib: UsedBuckets, tags: Set<string> }} */
const used = {
  actions: {},
  effects: {},
  helpers: {},
  lib: {},
  tags: new Set(),
}

// collect all used modules, htmlTags, actions, effects, helpers
/**
 * @param {BabelTypes} t
 * @param {{ modules?: { [key: string]: unknown }, lib?: { [key: string]: unknown } }} app
 * @param {string | undefined} WEB_ROOT
 * @returns {(path: BabelPath) => void}
 */
const findUsedSpells = (t, app, WEB_ROOT) => path => {
  // find used modules and html tags in app
  const moduleNames = Object.keys(app.modules ?? {})
  const buckets = /** @type {Record<string, UsedBuckets>} */ (/** @type {unknown} */ (used))

  if (t.isCallExpression(path.node)) {
    if (t.isIdentifier(path.node.callee)) {
      const { name } = path.node.callee
      const isModule = isModuleTag(name, moduleNames)
      if (isModule) {
        used.tags.add(String(name))
      }
    } else if (t.isMemberExpression(path.node.callee)) {
      const { callee } = path.node
      const key = /** @type {BabelValue} */ (callee.key)
      const object = /** @type {BabelValue} */ (callee.object)
      /** @type {BabelValue | undefined} */
      let name
      if (t.isMemberExpression(callee)) {
        name = object.name

        if (String(object.name) === 'lib') {
          name = callee.property.name
        }
      } else if (key) {
        name = key.name
      }

      if (name) {
        const kebabName = cases.kebab(String(name))
        if (Object.keys(app.lib ?? {}).includes(kebabName)) {
          if (is.string(app.lib?.[kebabName])) {
            used.lib[kebabName] = {}
          }
        }
      }
    } else {
      // console.log('unexpected callee type', path.node.callee)
    }
  }

  if (t.isObjectProperty(path.node)) {
    if (path.node.key) {
      const validKeys = ['src', 'logo', 'href', 'to']
      if (t.isIdentifier(path.node.key)) {
        const nodeValue = /** @type {Record<string, unknown>} */ (path.node.value)
        if (nodeValue.value) {
          if (validKeys.includes(String(path.node.key.name))) {
            nodeValue.value = handleLink({ href: String(nodeValue.value), app, WEB_ROOT })
          }
        }
      } else if (t.isStringLiteral(path.node.key)) {
        const nodeValue = /** @type {Record<string, unknown>} */ (path.node.value)
        const { value: name } = path.node.key
        if (validKeys.includes(String(name))) {
          nodeValue.value = handleLink({ href: String(nodeValue.value), app, WEB_ROOT })
        }
      }
    }
  } else if (t.isArrayExpression(path.node)) {
    const elements = /** @type {BabelValue[]} */ (/** @type {unknown} */ (path.node.elements))
    const [action, helper] = elements

    if (action) {
      if (t.isMemberExpression(action)) {
        const { name: type } = action.object
        if (buckets[String(type)]) {
          if (t.isMemberExpression(action.object)) {
            const actionObject = /** @type {BabelValue} */ (action.object)
            const { name: objName } = actionObject
            const { name: propName } = actionObject.object
            // console.log({ objName, propName })
            if (objName !== type) {
              buckets[String(type)][String(objName)] = buckets[String(type)][String(objName)] || {}
              buckets[String(type)][String(objName)][String(propName)] = {}
            } else {
              buckets[String(type)] = buckets[String(type)] || {}
              buckets[String(type)][String(propName)] = {}
            }
          } else if (t.isIdentifier(action.object)) {
            const { name: objName } = action.object
            const { name: propName } = action.property

            if (objName !== type) {
              buckets[String(type)][String(objName)] = buckets[String(type)][String(objName)] || {}
              buckets[String(type)][String(objName)][String(propName)] = {}
            } else {
              buckets[String(type)] = buckets[String(type)] || {}
              buckets[String(type)][String(propName)] = {}
            }
          }
        }
      }

      if (t.isMemberExpression(helper)) {
        const { name: type } = helper.object
        if (Object.prototype.hasOwnProperty.call(used, String(type))) {
          if (t.isMemberExpression(helper.object)) {
            const helperObject = /** @type {BabelValue} */ (helper.object)
            const { name: objName } = helperObject
            const { name: propName } = helperObject.object
            buckets[String(type)][String(objName)] = buckets[String(type)][String(objName)] || {}
            buckets[String(type)][String(objName)][String(propName)] = {}
          } else if (t.isIdentifier(helper.object)) {
            const { name: objName } = helper.object
            const { name: propName } = helper.property

            if (objName !== type) {
              buckets[String(type)][String(objName)] = buckets[String(type)][String(objName)] || {}
              buckets[String(type)][String(objName)][String(propName)] = {}
            } else {
              buckets[String(type)] = buckets[String(type)] || {}
              buckets[String(type)][String(propName)] = {}
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
      //     console.log({ left })
      //   }

      //   console.log({ objName, propName })
    }
  }
}

/**
 * @param {BabelTypes} t
 * @param {{ modules?: { [key: string]: unknown } }} app
 * @returns {(path: BabelPath) => void}
 */
const removeUnused = (t, app) => path => {
  const moduleNames = Object.keys(app.modules ?? {})
  const usedTagNames = Array.from(used.tags)

  if (t.isVariableDeclarator(path.node)) {
    const { name } = path.node.id
    if (name && isModuleTag(name, moduleNames)) {
      if (!usedTagNames.includes(String(name))) {
        if (isModuleTag(name, moduleNames)) {
          if (!is.case.upper(String(name)[0])) {
            const init = path.node.init
            if (!init) {
              return
            }

            const callee = init.callee
            if (!callee || String(callee.name) !== 'C') {
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
      if (String(name) === 'lib') {
        // remove unused lib imports
        // if (path.node.init && path.node.init.properties) {
        //   const { properties } = path.node.init
        //   properties.forEach(prop => {
        //     console.log(prop.key.name, Object.keys(used.lib).includes(prop.key.name))
        //   })
        //   console.log(used.lib);
        // }
      }

      if (String(name) === 'actions') {
        // remove unused actions
        const properties = /** @type {BabelValue[]} */ (
          /** @type {unknown} */ (path.node.init.properties)
        )

        properties.forEach(prop => {
          const { value: name } = prop.key

          // console.log({ actions: used.actions })

          if (t.isFunctionExpression(prop.value)) {
            if (
              !used.actions ||
              !Object.prototype.hasOwnProperty.call(used.actions, String(name))
            ) {
              // console.log('remove fn', name)
              // prop.remove()
            } else {
              // console.log('not remove fn', name)
            }
          } else if (t.isObjectExpression(prop.value)) {
            const valueProperties = /** @type {BabelValue[]} */ (
              /** @type {unknown} */ (prop.value.properties)
            )
            const { value: propName } = valueProperties[0].key
            if (
              !used.actions ||
              !used.actions[String(name)] ||
              !Object.prototype.hasOwnProperty.call(used.actions[String(name)], String(propName))
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

/**
 * @param {{ modules?: { [key: string]: unknown }, lib?: { [key: string]: unknown } }} app
 * @param {{ WEB_ROOT?: string }} config
 * @returns {(opts: { types: BabelTypes }) => { visitor: BabelVisitors }}
 */
export default (app, { WEB_ROOT }) =>
  ({ types: t }) => ({
    visitor: {
      Program: {
        /** @param {BabelPath} path */
        enter(path) {
          path.traverse({ enter: findUsedSpells(t, app, WEB_ROOT) })
        },
        /** @param {BabelPath} path */
        exit(path) {
          path.traverse({ enter: removeUnused(t, app) })
        },
      },
    },
  })
