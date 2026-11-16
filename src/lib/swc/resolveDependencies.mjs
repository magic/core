import log from '@magic/log'
import is from '@magic/types'

/** @import { AppObject, SwcNode, UsedObject } from '../../types.mjs' */

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
// const validTypes = ['lib', 'actions', 'effects', 'subscriptions', 'helpers']

/**
 * Visit an SWC AST node (or list of nodes) in place,
 * tracking which modules and object members are used.
 *
 * @param {{ parent: SwcNode | (SwcNode | undefined)[] | undefined, app: AppObject, used: UsedObject }} params
 * @returns {SwcNode | undefined}
 */
const visit = ({ parent, app, used }) => {
  if (!parent) {
    return undefined
  }

  if (is.array(parent)) {
    const list = parent.map(n => visit({ parent: n, app, used }))
    return /** @type {SwcNode} */ (/** @type {unknown} */ (list))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = (parent.declarations ?? []).map(decl =>
      visit({ parent: decl, app, used }),
    )
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit({ parent: parent.expression, app, used })
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit({ parent: parent.right, app, used })
    parent.left = visit({ parent: parent.left, app, used })
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = /** @type {SwcNode[]} */ (visit({ parent: parent.params, app, used }))
      parent.body = visit({ parent: parent.body, app, used })
    } else {
      const body = parent.body ?? {}
      if (body.callee) {
        body.callee = visit({ parent: body.callee, app, used })
        parent.params = /** @type {SwcNode[]} */ (visit({ parent: parent.params, app, used }))
      } else if (body.stmts) {
        body.stmts = (body.stmts ?? []).map(stmt => visit({ parent: stmt, app, used }))
      } else {
        log.warn('unhandled ArrowFunctionExpression', /** @type {string} */ (parent))
      }
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit({ parent: parent.test, app, used })
    parent.consequent = visit({ parent: parent.consequent, app, used })
    if (parent.alternate) {
      parent.alternate = visit({ parent: parent.alternate, app, used })
    }
  } else if (parent.type === 'CallExpression') {
    parent.arguments = (parent.arguments ?? []).map(arg => {
      if (!arg) {
        return arg
      }
      arg.expression = visit({ parent: arg.expression, app, used })
      return arg
    })

    parent.callee = visit({ parent: parent.callee, app, used })

    const callee = parent.callee

    if (callee && callee.type === 'Identifier') {
      const calleeValue = String(callee.value)

      if (Object.keys(app.modules ?? {}).includes(calleeValue)) {
        if (!used.modules.includes(calleeValue)) {
          used.modules.push(calleeValue)
        }
      }
    }
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit({ parent: parent.id, app, used })
    parent.init = visit({ parent: parent.init, app, used })
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = (parent.properties ?? []).map(prop => visit({ parent: prop, app, used }))
  } else if (parent.type === 'KeyValueProperty') {
    parent.key = visit({ parent: parent.key, app, used })
    parent.value = visit({ parent: /** @type {SwcNode} */ (parent.value), app, used })
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit({ parent: parent.property, app, used })
    parent.object = visit({ parent: parent.object, app, used })

    const { value: typeRaw } = parent.object ?? {}
    const { value: keyRaw } = parent.property ?? {}
    const type = String(typeRaw)
    const key = String(keyRaw)

    if (Object.prototype.hasOwnProperty.call(used, type) && !used[type].includes(key)) {
      used[type].push(key)
    }

    if (Object.keys(app.modules ?? {}).includes(type) && type[0]?.toUpperCase() === type[0]) {
      used.modules.push(`${type}.${key}`)
    }
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = (parent.elements ?? []).map(ele => {
      if (!ele) {
        return ele
      }
      ele.expression = visit({ parent: ele.expression, app, used })
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = (parent.elements ?? []).map(ele => visit({ parent: ele, app, used }))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = (parent.quasis ?? []).map(quasi => {
      if (!quasi) {
        return quasi
      }
      quasi.raw = visit({ parent: /** @type {SwcNode} */ (quasi.raw), app, used })
      quasi.cooked = visit({ parent: /** @type {SwcNode} */ (quasi.cooked), app, used })
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = /** @type {SwcNode[]} */ (visit({ parent: parent.arguments, app, used }))
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = (parent.stmts ?? []).map(stmt => visit({ parent: stmt, app, used }))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit({ parent: parent.argument, app, used })
  } else if (parent.type === 'ObjectPattern') {
    ;(parent.properties ?? []).map(prop => visit({ parent: prop, app, used }))
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
    parent.argument = visit({ parent: parent.argument, app, used })
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit({ parent: parent.key, app, used })
    parent.value = visit({ parent: /** @type {SwcNode} */ (parent.value), app, used })
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
    parent.params = /** @type {SwcNode[]} */ (visit({ parent: parent.params, app, used }))
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
    parent.expressions = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ parent: parent.expressions, app, used })
    )
  } else if (parent.type === 'ContinueStatement') {
    parent.label = visit({ parent: parent.label, app, used })
  } else if (parent.type === 'ImportDeclaration') {
    parent.specifiers = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ parent: parent.specifiers, app, used })
    )
  } else if (parent.type === 'ImportSpecifier') {
    parent.local = visit({ parent: parent.local, app, used })
  } else if (parent.type === 'ExportNamedDeclaration') {
    parent.specifiers = /** @type {(SwcNode | undefined)[] | undefined} */ (
      visit({ parent: parent.specifiers, app, used })
    )
  } else if (parent.type === 'ExportSpecifier') {
    parent.orig = visit({ parent: parent.orig, app, used })
  } else if (parent.type && noopTypes.includes(parent.type)) {
    // noop
  } else if (parent.type) {
    log.warn('unexpected parent type', parent.type, /** @type {string} */ (parent))
  }

  return /** @type {SwcNode} */ (parent)
}

/**
 * Resolve which modules and object members are used by a piece of code.
 *
 * @param {{ parent: SwcNode, app: AppObject }} params
 * @returns {UsedObject}
 */
export const resolveDependencies = ({ parent: m, app }) => {
  /** @type {UsedObject} */
  const used = {
    modules: [],
    lib: [],
    actions: [],
    effects: [],
    subscriptions: [],
    helpers: [],
  }

  const bodyList = /** @type {SwcNode[]} */ (m.body ?? [])
  bodyList.map(item => visit({ parent: item, app, used }))

  return used
}
