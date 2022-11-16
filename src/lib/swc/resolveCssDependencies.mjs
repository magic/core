import log from '@magic/log'

import swc from '@swc/core'

import { isModuleName } from '../isModuleName.mjs'

const noopTypes = [
  'StringLiteral',
  'BooleanLiteral',
  'NullLiteral',
  'NumericLiteral',
  'RegExpLiteral',
  'ThisExpression',
  'EmptyStatement',
  'Identifier',
]

/*
 * which types of member accesses we want to track in the used object
 */
const validTypes = ['lib', 'actions', 'effects', 'subscriptions', 'helpers']

const visit = ({ parent, app, used }) => {
  if (!parent) {
    return parent
  }

  if (Array.isArray(parent)) {
    return parent.map(n => visit({ parent: n, app, used }))
  } else if (Array.isArray(parent?.body)) {
    return parent.body.map(n => visit({ parent: n, app, used }))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = parent.declarations.map(decl => visit({ parent: decl, app, used }))
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit({ parent: parent.expression, app, used })
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit({ parent: parent.right, app, used })
    parent.left = visit({ parent: parent.left, app, used })
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = visit({ parent: parent.params, app, used })
      parent.body = visit({ parent: parent.body, app, used })
    } else if (parent.body.callee) {
      parent.body.callee = visit({ parent: parent.body.callee, app, used })
      parent.params = visit({ parent: parent.params, app, used })
    } else if (parent.body.stmts) {
      parent.body.stmts = parent.body.stmts.map(stmt => visit({ parent: stmt, app, used }))
    } else {
      log.warn('unhandled ArrowFunctionExpression', parent)
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit({ parent: parent.test, app, used })
    parent.consequent = visit({ parent: parent.consequent, app, used })
    if (parent.alternate) {
      parent.alternate = visit({ parent: parent.alternate, app, used })
    }
  } else if (parent.type === 'CallExpression') {
    parent.arguments = parent.arguments.map(arg => {
      arg.expression = visit({ parent: arg.expression, app, used })
      return arg
    })

    parent.callee = visit({ parent: parent.callee, app, used })

    if (parent.callee.type === 'Identifier') {
      if (Object.keys(app.modules).includes(parent.callee.value)) {
        if (!used.modules.includes(parent.callee.value)) {
          used.modules.push(parent.callee.value)
        }
      }
    }
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit({ parent: parent.id, app, used })
    parent.init = visit({ parent: parent.init, app, used })
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = parent.properties.map(prop => visit({ parent: prop, app, used }))
  } else if (parent.type === 'KeyValueProperty') {
    parent.key = visit({ parent: parent.key, app, used })
    parent.value = visit({ parent: parent.value, app, used })
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit({ parent: parent.property, app, used })
    parent.object = visit({ parent: parent.object, app, used })

    const { value: type } = parent.object
    const { value: key } = parent.property

    if (used.hasOwnProperty(type) && !used[type].includes(key)) {
      used[type].push(key)
    }

    const typeKey = `${type}.${key}`
    if (Object.keys(app.modules).includes(type) && isModuleName(type) && !used.modules.includes(typeKey)) {
      used.modules.push(typeKey)
    }
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = parent.elements.map(ele => {
      ele.expression = visit({ parent: ele.expression, undefined, app, used })
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = parent.elements.map(ele => visit({ parent: ele, app, used }))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = parent.quasis.map(quasi => {
      quasi.raw = visit({ parent: quasi.raw, app, used })
      quasi.cooked = visit({ parent: quasi.cooked, app, used })
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = visit({ parent: parent.arguments, app, used })
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = parent.stmts.map(stmt => visit({ parent: stmt, app, used }))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit({ parent: parent.argument, app, used })
  } else if (parent.type === 'ObjectPattern') {
    parent.properties.map(prop => visit({ parent: prop, app, used }))
  } else if (parent.type === 'AssignmentPattern') {
    parent.left = visit({ parent: parent.left, app, used })
    parent.right = visit({ parent: parent.right, app, used })
  } else if (parent.type === 'AssignmentPatternProperty') {
    parent.key = visit({ parent: parent.key, app, used })
  } else if (parent.type === 'ConditionalExpression') {
    parent.test = visit({ parent: parent.test, app, used })
    parent.consequent = visit({ parent: parent.consequent, app, used })
    parent.alternate = visit({ parent: parent.alternate, app, used })
  } else if (parent.type === 'BinaryExpression') {
    parent.left = visit({ parent: parent.left, app, used })
    parent.right = visit({ parent: parent.right, app, used })
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit({ parent: parent.argument, app, used })
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit({ parent: parent.callee, app, used })
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit({ parent: parent.expression, app, used })
  } else if (parent.type === 'RestElement') {
    parent.argument = visit({ parent: parent.argument, undefined, app, used })
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit({ parent: parent.key, app, used })
    parent.value = visit({ parent: parent.value, app, used })
  } else if (parent.type === 'TryStatement') {
    parent.block = visit({ parent: parent.block, app, used })
    parent.handler = visit({ parent: parent.handler, app, used })
  } else if (parent.type === 'CatchClause') {
    parent.param = visit({ parent: parent.param, app, used })
    parent.body = visit({ parent: parent.body, app, used })
  } else if (parent.type === 'Computed') {
    parent.expression = visit({ parent: parent.expression, app, used })
  } else if (parent.type === 'OptionalChainingExpression') {
    parent.expr = visit({ parent: parent.expr, app, used })
  } else if (parent.type === 'ForStatement') {
    parent.init = visit({ parent: parent.init, app, used })
    parent.test = visit({ parent: parent.test, app, used })
    parent.update = visit({ parent: parent.update, app, used })
    parent.body = visit({ parent: parent.body, app, used })
  } else if (parent.type === 'FunctionExpression') {
    parent.params = visit({ parent: parent.params, app, used })
    parent.body = visit({ parent: parent.body, app, used })
    parent.decorators = visit({ parent: parent.decorators, app, used })
  } else if (parent.type === 'Parameter') {
    parent.pat = visit({ parent: parent.pat, app, used })
  } else if (parent.type === 'ForInStatement') {
    parent.left = visit({ parent: parent.left, app, used })
    parent.right = visit({ parent: parent.right, app, used })
    parent.body = visit({ parent: parent.body, app, used })
  } else if (parent.type === 'UpdateExpression') {
    parent.argument = visit({ parent: parent.argument, app, used })
  } else if (parent.type === 'WhileStatement') {
    parent.test = visit({ parent: parent.test, app, used })
    parent.body = visit({ parent: parent.body, app, used })
  } else if (parent.type === 'BreakStatement') {
    parent.label = visit({ parent: parent.label, app, used })
  } else if (parent.type === 'SequenceExpression') {
    parent.expressions = visit({ parent: parent.expressions, app, used })
  } else if (parent.type === 'ContinueStatement') {
    parent.label = visit({ parent: parent.label, app, used })
  } else if (parent.type === 'ImportDeclaration') {
    parent.specifiers = visit({ parent: parent.specifiers, app, used })
  } else if (parent.type === 'ImportSpecifier') {
    parent.local = visit({ parent: parent.local, app, used })
  } else if (parent.type === 'ExportNamedDeclaration') {
    parent.specifiers = visit({ parent: parent.specifiers, app, used })
  } else if (parent.type === 'ExportSpecifier') {
    parent.orig = visit({ parent: parent.orig, app, used })
  } else if (noopTypes.includes(parent.type)) {
    // noop
  } else if (parent.type) {
    log.warn('unexpected parent type', parent.type, parent)
  }

  return parent
}

export const resolveCssDependencies = async (app, config) => {
  const used = {
    classes: [],
    ids: [],
    tags: [],
  }

  const available = {
    classes: [],
    ids: [],
    tags: [],
  }

  app.style.forEach(style => {
    Object.keys(style).forEach(selector => {
      if (!available.classes.includes(selector)) {
        if (selector.startsWith('.')) {
          available.classes.push(selector)
        } else if (selector.startsWith('#')) {
          available.ids.push(selector)
        } else {
          available.tags.push(selector)
        }
      }
    })
  })

  // const parent = await swc.parse(app.client)

  // visit({ parent, app, used, available })

  return used
}
