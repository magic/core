import log from '@magic/log'
import is from '@magic/types'

import { handleLink } from '../handleLink.mjs'
// import { replaceSlashSlash } from '../replaceSlashSlash.mjs'

/** @import { AppObject, Config, SwcNode } from '../../types.mjs' */

const validKeys = ['src', 'srcset', 'logo', 'href', 'to']

const noopTypes = new Set([
  'BooleanLiteral',
  'NullLiteral',
  'NumericLiteral',
  'RegExpLiteral',
  'ThisExpression',
  'EmptyStatement',
  'Identifier',
])

/** @type {{ modules: Set<string>, moduleNames?: Set<string> }} */
export const used = {
  modules: new Set(),
}

/**
 * Visit an SWC AST node (or list of nodes) in place:
 * rewrites links in `source`/`img` calls and KeyValueProperties,
 * tracks used modules, and removes CHECK_PROPS calls.
 *
 * @param {{ app: AppObject, config: Config, parent: SwcNode | (SwcNode | undefined)[] | undefined, par?: SwcNode | (SwcNode | undefined)[] }} params
 * @returns {SwcNode | undefined}
 */
export const visit = ({ app, config, parent }) => {
  if (!parent) {
    return /** @type {SwcNode | undefined} */ (parent)
  }

  if (Array.isArray(parent)) {
    const list = parent.map(n => visit({ par: parent, parent: n, app, config }))
    return /** @type {SwcNode} */ (/** @type {unknown} */ (list))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = (parent.declarations ?? []).map(decl =>
      visit({ par: parent, parent: decl, app, config }),
    )
  } else if (parent.type === 'ExpressionStatement') {
    const result = visit({ par: parent, parent: parent.expression, app, config })
    // If result is undefined (e.g., CHECK_PROPS was removed),
    // turn the statement into an EmptyStatement in place,
    // keeping its original span
    if (result === undefined) {
      delete parent.expression
      parent.type = 'EmptyStatement'
      return parent
    }
    parent.expression = result
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit({ par: parent, parent: parent.right, app, config })
    parent.left = visit({ par: parent, parent: parent.left, app, config })
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = /** @type {SwcNode[]} */ (
        visit({ par: parent, parent: parent.params, app, config })
      )
      parent.body = visit({ par: parent, parent: parent.body, app, config })
    } else {
      const body = parent.body ?? {}
      if (body.callee) {
        body.callee = visit({ par: parent, parent: body.callee, app, config })
        parent.params = /** @type {SwcNode[]} */ (
          visit({ par: parent, parent: parent.params, app, config })
        )
      } else if (body.stmts) {
        body.stmts = (body.stmts ?? []).map(stmt =>
          visit({ par: parent, parent: stmt, app, config }),
        )
      } else {
        log.warn('unhandled ArrowFunctionExpression', /** @type {string} */ (parent))
      }
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit({ par: parent, parent: parent.test, app, config })
    parent.consequent = visit({ par: parent, parent: parent.consequent, app, config })
    if (parent.alternate) {
      parent.alternate = visit({ par: parent, parent: parent.alternate, app, config })
    }
  } else if (parent.type === 'CallExpression') {
    const name = /** @type {string | undefined} */ (parent.callee?.value)
    const isModule = Boolean(used.moduleNames?.has(String(name)))
    const lib = Object.keys(app.lib ?? {}).find(v => v === name)
    const isLib = lib && is.function(lib)

    if (isModule) {
      used.modules.add(String(name))
    }

    if (isLib) {
      // console.log('is lib', name)
    }

    /* remove CHECK_PROPS function calls */
    if (parent.callee?.value === 'CHECK_PROPS') {
      // Return undefined to signal that this expression should be removed
      // The parent ExpressionStatement handler will replace it with an EmptyStatement
      return undefined
    } else {
      if (parent.callee?.value === 'source' || parent.callee?.value === 'img') {
        const ignoredProps = ['Identifier', 'TemplateLiteral', 'BinaryExpression']

        ;(parent.arguments ?? []).forEach(arg => {
          if (!arg) {
            return
          }
          arg.expression?.properties?.forEach(prop => {
            if (!prop) {
              return
            }
            if (prop.type === 'KeyValueProperty') {
              if (validKeys.includes(String(prop.key?.value))) {
                const pv = /** @type {SwcNode} */ (prop.value)
                let url = ''
                if (pv.type === 'StringLiteral') {
                  url = String(pv.value)
                } else if (pv.type === 'TemplateLiteral') {
                  /*
                   * We return on TemplateLiterals
                   * there are variable in play here,
                   * we do not want to risk mutating them
                   */
                  return
                } else if (ignoredProps.includes(pv.type ?? '')) {
                  /*
                   * we return on Identifier, TemplateLiteral and BinaryExpression
                   * they mean this is a variable or function being passed,
                   * that we do not want to mutate
                   */
                  return
                } else {
                  log.warn(
                    'W_UNKNOWN_URL_TYPE',
                    'could not find valid ast url type for',
                    /** @type {string} */ (prop),
                  )
                  url = String(config.WEB_ROOT)
                }

                const isInternal = !url.includes('://')
                const isRooted = url.startsWith(String(config.WEB_ROOT))

                if (isInternal && !isRooted) {
                  if (!url) {
                    url = String(config.WEB_ROOT)
                  } else {
                    url = handleLink({
                      app,
                      href: url.substr(0, url.length - 1),
                      WEB_ROOT: config.WEB_ROOT,
                    })
                  }

                  if (pv.type === 'StringLiteral') {
                    pv.value = url
                    pv.raw = `'${url}'`
                  } else if (pv.quasis) {
                    const firstQuasi = pv.quasis[0] ?? {}
                    firstQuasi.cooked = url
                    firstQuasi.raw = `'${url}'`
                  }
                }
              }
            }
          })
        })
      }

      parent.arguments = (parent.arguments ?? []).map(arg => {
        if (!arg) {
          return arg
        }
        arg.expression = visit({ par: parent, parent: arg.expression, app, config })

        const newExpr = arg.expression

        if (newExpr && newExpr.type === 'StringLiteral') {
          if (used.moduleNames?.has(String(parent.callee?.value))) {
            const _expr = {
              type: 'ExpressionStatement',
              span: {
                start: 0,
                end: 22,
                ctxt: 0,
              },
              expression: {
                type: 'CallExpression',
                span: {
                  start: 0,
                  end: 22,
                  ctxt: 0,
                },
                callee: {
                  type: 'Identifier',
                  span: {
                    start: 0,
                    end: 4,
                    ctxt: 0,
                  },
                  value: 'text',
                  optional: false,
                },
                arguments: [
                  {
                    spread: null,
                    expression: {
                      type: 'StringLiteral',
                      span: {
                        start: 5,
                        end: 21,
                        ctxt: 0,
                      },
                      value: newExpr.value,
                      raw: newExpr.raw,
                    },
                  },
                ],
                typeArguments: null,
              },
            }

            // arg = expr
          }
        }

        return arg
      })
    }
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit({ par: parent, parent: parent.id, app, config })
    parent.init = visit({ par: parent, parent: parent.init, app, config })
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = (parent.properties ?? []).map(prop =>
      visit({ par: parent, parent: prop, app, config }),
    )
  } else if (parent.type === 'KeyValueProperty') {
    const val = /** @type {SwcNode} */ (parent.value)

    if (val?.type === 'StringLiteral') {
      if (validKeys.includes(String(parent.key?.value))) {
        val.value = handleLink({
          app,
          href: String(val.value),
          WEB_ROOT: config.WEB_ROOT,
        })
      }
    }

    // Track module references used as values in objects (e.g., pages object: { '/a/': A })
    if (val?.type === 'Identifier') {
      const valueName = String(val.value)
      if (used.moduleNames?.has(valueName)) {
        used.modules.add(valueName)
      }
    }

    parent.key = visit({ par: parent, parent: parent.key, app, config })
    parent.value = visit({
      par: parent,
      parent: /** @type {SwcNode} */ (parent.value),
      app,
      config,
    })
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit({ par: parent, parent: parent.property, app, config })
    parent.object = visit({ par: parent, parent: parent.object, app, config })
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = (parent.elements ?? []).map(ele => {
      if (!ele) {
        return ele
      }
      ele.expression = visit({ par: parent, parent: ele.expression, app, config })
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = (parent.elements ?? []).map(ele =>
      visit({ par: parent, parent: ele, app, config }),
    )
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = (parent.quasis ?? []).map(quasi => {
      if (!quasi) {
        return quasi
      }
      quasi.raw = visit({ par: parent, parent: /** @type {SwcNode} */ (quasi.raw), app, config })
      quasi.cooked = visit({
        par: parent,
        parent: /** @type {SwcNode} */ (quasi.cooked),
        app,
        config,
      })
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = /** @type {SwcNode[]} */ (
      visit({ par: parent, parent: parent.arguments, app, config })
    )
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = (parent.stmts ?? []).map(stmt =>
      visit({ par: parent, parent: stmt, app, config }),
    )
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'ObjectPattern') {
    ;(parent.properties ?? []).map(prop => visit({ par: parent, parent: prop, app, config }))
  } else if (parent.type === 'AssignmentPattern') {
    parent.left = visit({ par: parent, parent: parent.left, app, config })
    parent.right = visit({ par: parent, parent: parent.right, app, config })
  } else if (parent.type === 'AssignmentPatternProperty') {
    parent.key = visit({ par: parent, parent: parent.key, app, config })
  } else if (parent.type === 'ConditionalExpression') {
    parent.test = visit({ par: parent, parent: parent.test, app, config })
    parent.consequent = visit({ par: parent, parent: parent.consequent, app, config })
    parent.alternate = visit({ par: parent, parent: parent.alternate, app, config })
  } else if (parent.type === 'BinaryExpression') {
    // the Logo pattern: CHECK_PROPS(...) && View().
    // visit() removes the CHECK_PROPS call (returns undefined),
    // so splice the right hand side into this node in place
    // and keep visiting it
    const bin = /** @type {{ operator?: string }} */ (parent)
    if (
      bin.operator === '&&' &&
      parent.left?.type === 'CallExpression' &&
      parent.left?.callee?.value === 'CHECK_PROPS'
    ) {
      const right = parent.right
      // drop the leftover BinaryExpression fields, so the spliced
      // node carries no stale properties
      const binRecord = /** @type {Record<string, unknown>} */ (parent)
      for (const key of Object.keys(binRecord)) {
        delete binRecord[key]
      }
      Object.assign(binRecord, right)
      return visit({ par: parent, parent, app, config })
    }

    parent.left = visit({ par: parent, parent: parent.left, app, config })
    parent.right = visit({ par: parent, parent: parent.right, app, config })
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit({ par: parent, parent: parent.callee, app, config })
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit({ par: parent, parent: parent.expression, app, config })
  } else if (parent.type === 'RestElement') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit({ par: parent, parent: parent.key, app, config })
    parent.value = visit({
      par: parent,
      parent: /** @type {SwcNode} */ (parent.value),
      app,
      config,
    })
  } else if (parent.type === 'TryStatement') {
    parent.block = visit({ par: parent, parent: parent.block, app, config })
    parent.handler = visit({ par: parent, parent: parent.handler, app, config })
  } else if (parent.type === 'CatchClause') {
    parent.param = visit({ par: parent, parent: parent.param, app, config })
    parent.body = visit({ par: parent, parent: parent.body, app, config })
  } else if (parent.type === 'Computed') {
    parent.expression = visit({ par: parent, parent: parent.expression, app, config })
  } else if (parent.type === 'OptionalChainingExpression') {
    parent.expr = visit({ par: parent, parent: parent.expr, app, config })
  } else if (parent.type === 'ForStatement') {
    parent.init = visit({ par: parent, parent: parent.init, app, config })
    parent.test = visit({ par: parent, parent: parent.test, app, config })
    parent.update = visit({ par: parent, parent: parent.update, app, config })
    parent.body = visit({ par: parent, parent: parent.body, app, config })
  } else if (parent.type === 'FunctionExpression') {
    parent.params = /** @type {SwcNode[]} */ (
      visit({ par: parent, parent: parent.params, app, config })
    )
    parent.body = visit({ par: parent, parent: parent.body, app, config })
    parent.decorators = visit({ par: parent, parent: parent.decorators, app, config })
  } else if (parent.type === 'FunctionBody') {
    parent.stmts = (parent.stmts ?? []).map(stmt =>
      visit({ par: parent, parent: stmt, app, config }),
    )
  } else if (parent.type === 'Parameter') {
    parent.pat = visit({ par: parent, parent: parent.pat, app, config })
  } else if (parent.type === 'ForInStatement') {
    parent.left = visit({ par: parent, parent: parent.left, app, config })
    parent.right = visit({ par: parent, parent: parent.right, app, config })
    parent.body = visit({ par: parent, parent: parent.body, app, config })
  } else if (parent.type === 'UpdateExpression') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'WhileStatement') {
    parent.test = visit({ par: parent, parent: parent.test, app, config })
    parent.body = visit({ par: parent, parent: parent.body, app, config })
  } else if (parent.type === 'BreakStatement') {
    parent.label = visit({ par: parent, parent: parent.label, app, config })
  } else if (parent.type === 'SequenceExpression') {
    parent.expressions = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ par: parent, parent: parent.expressions, app, config })
    )
  } else if (parent.type === 'ContinueStatement') {
    parent.label = visit({ par: parent, parent: parent.label, app, config })
  } else if (parent.type === 'ImportDeclaration') {
    parent.specifiers = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ par: parent, parent: parent.specifiers, app, config })
    )
  } else if (parent.type === 'ImportSpecifier') {
    parent.local = visit({ par: parent, parent: parent.local, app, config })
  } else if (parent.type === 'ExportNamedDeclaration') {
    parent.specifiers = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ par: parent, parent: parent.specifiers, app, config })
    )
  } else if (parent.type === 'ExportSpecifier') {
    parent.orig = visit({ par: parent, parent: parent.orig, app, config })
  } else if (parent.type === 'StringLiteral') {
    // console.log(parent, par)
  } else if (parent.type === 'AwaitExpression') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
    // noop
  } else if (parent.type === 'ForOfStatement') {
    parent.body = visit({ par: parent, parent: parent.body, app, config })
    parent.left = visit({ par: parent, parent: parent.left, app, config })
    parent.right = visit({ par: parent, parent: parent.right, app, config })
  } else if (parent.type && noopTypes.has(parent.type)) {
    // noop
  } else if (parent.type) {
    log.warn('unexpected parent type', parent.type, /** @type {string} */ (parent))
  }

  return /** @type {SwcNode} */ (parent)
}
