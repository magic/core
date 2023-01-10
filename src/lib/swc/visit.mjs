import is from '@magic/types'
import log from '@magic/log'

import { handleLink } from '../handleLink.mjs'
import { replaceSlashSlash } from '../replaceSlashSlash.mjs'

const validKeys = ['src', 'srcset', 'logo', 'href', 'to']

const noopTypes = [
  'BooleanLiteral',
  'NullLiteral',
  'NumericLiteral',
  'RegExpLiteral',
  'ThisExpression',
  'EmptyStatement',
  'Identifier',
]

export const visit = ({ app, config, parent, par }) => {
  if (!parent) {
    return parent
  }

  if (Array.isArray(parent)) {
    return parent.map(n => visit({ par: parent, parent: n, app, config }))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = parent.declarations.map(decl =>
      visit({ par: parent, parent: decl, app, config }),
    )
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit({ par: parent, parent: parent.expression, app, config })
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit({ par: parent, parent: parent.right, app, config })
    parent.left = visit({ par: parent, parent: parent.left, app, config })
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = visit({ par: parent, parent: parent.params, app, config })
      parent.body = visit({ par: parent, parent: parent.body, app, config })
    } else if (parent.body.callee) {
      parent.body.callee = visit({ par: parent, parent: parent.body.callee, app, config })
      parent.params = visit({ par: parent, parent: parent.params, app, config })
    } else if (parent.body.stmts) {
      parent.body.stmts = parent.body.stmts.map(stmt =>
        visit({ par: parent, parent: stmt, app, config }),
      )
    } else {
      log.warn('unhandled ArrowFunctionExpression', parent)
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit({ par: parent, parent: parent.test, app, config })
    parent.consequent = visit({ par: parent, parent: parent.consequent, app, config })
    if (parent.alternate) {
      parent.alternate = visit({ par: parent, parent: parent.alternate, app, config })
    }
  } else if (parent.type === 'CallExpression') {
    if (parent.callee.value === 'source' || parent.callee.value === 'img') {
      parent.arguments.map(arg => {
        arg.expression?.properties?.map(prop => {
          if (prop.type === 'KeyValueProperty') {
            if (validKeys.includes(prop.key?.value)) {
              let url
              if (prop.value.type === 'StringLiteral') {
                url = prop.value.value
              } else if (prop.value?.quasis) {
                url = prop.value.quasis[0].cooked
              } else {
                log.warn('W_UNKNOWN_URL_TYPE', `could not find valid ast url type for ${prop}`)
                url = config.WEB_ROOT
              }

              const isInternal = !url.includes('://')
              const isRooted = url.startsWith(config.WEB_ROOT)

              if (isInternal && !isRooted) {
                if (!url) {
                  url = config.WEB_ROOT
                } else {
                  url = handleLink({
                    app,
                    href: url.substr(0, url.length - 1),
                    WEB_ROOT: config.WEB_ROOT,
                  })
                }

                if (prop.value.type === 'StringLiteral') {
                  prop.value.value = url
                  prop.value.raw = `'${url}'`
                } else if (prop.value?.quasis) {
                  prop.value.quasis[0].cooked = url
                  prop.value.quasis[0].raw = `'${url}'`
                }
              }
            }
          }
        })
      })
    }
    parent.arguments = parent.arguments.map(arg => {
      arg.expression = visit({ par: parent, parent: arg.expression, app, config })

      if (arg.expression.type === 'StringLiteral') {
        if (Object.keys(app.modules).includes(parent.callee.value)) {
          const expr = {
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
                    value: arg.expression.value,
                    raw: arg.expression.raw,
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
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit({ par: parent, parent: parent.id, app, config })
    parent.init = visit({ par: parent, parent: parent.init, app, config })
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = parent.properties.map(prop =>
      visit({ par: parent, parent: prop, app, config }),
    )
  } else if (parent.type === 'KeyValueProperty') {
    if (parent.value.type === 'StringLiteral') {
      if (validKeys.includes(parent.key.value)) {
        parent.value.value = handleLink({
          app,
          href: parent.value.value,
          WEB_ROOT: config.WEB_ROOT,
        })
      }
    }

    parent.key = visit({ par: parent, parent: parent.key, app, config })
    parent.value = visit({ par: parent, parent: parent.value, app, config })
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit({ par: parent, parent: parent.property, app, config })
    parent.object = visit({ par: parent, parent: parent.object, app, config })
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = parent.elements.map(ele => {
      ele.expression = visit({ par: parent, parent: ele.expression, undefined, app, config })
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = parent.elements.map(ele => visit({ par: parent, parent: ele, app, config }))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = parent.quasis.map(quasi => {
      quasi.raw = visit({ par: parent, parent: quasi.raw, app, config })
      quasi.cooked = visit({ par: parent, parent: quasi.cooked, app, config })
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = visit({ par: parent, parent: parent.arguments, app, config })
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = parent.stmts.map(stmt => visit({ par: parent, parent: stmt, app, config }))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'ObjectPattern') {
    parent.properties.map(prop => visit({ par: parent, parent: prop, app, config }))
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
    parent.left = visit({ par: parent, parent: parent.left, app, config })
    parent.right = visit({ par: parent, parent: parent.right, app, config })
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit({ par: parent, parent: parent.argument, app, config })
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit({ par: parent, parent: parent.callee, app, config })
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit({ par: parent, parent: parent.expression, app, config })
  } else if (parent.type === 'RestElement') {
    parent.argument = visit({ par: parent, parent: parent.argument, undefined, app, config })
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit({ par: parent, parent: parent.key, app, config })
    parent.value = visit({ par: parent, parent: parent.value, app, config })
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
    parent.params = visit({ par: parent, parent: parent.params, app, config })
    parent.body = visit({ par: parent, parent: parent.body, app, config })
    parent.decorators = visit({ par: parent, parent: parent.decorators, app, config })
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
    parent.expressions = visit({ par: parent, parent: parent.expressions, app, config })
  } else if (parent.type === 'ContinueStatement') {
    parent.label = visit({ par: parent, parent: parent.label, app, config })
  } else if (parent.type === 'ImportDeclaration') {
    parent.specifiers = visit({ par: parent, parent: parent.specifiers, app, config })
  } else if (parent.type === 'ImportSpecifier') {
    parent.local = visit({ par: parent, parent: parent.local, app, config })
  } else if (parent.type === 'ExportNamedDeclaration') {
    parent.specifiers = visit({ par: parent, parent: parent.specifiers, app, config })
  } else if (parent.type === 'ExportSpecifier') {
    parent.orig = visit({ par: parent, parent: parent.orig, app, config })
  } else if (parent.type === 'StringLiteral') {
    // console.log(parent, par)
  } else if (noopTypes.includes(parent.type)) {
    // noop
  } else if (parent.type) {
    log.warn('unexpected parent type', parent.type, parent)
  }

  return parent
}
