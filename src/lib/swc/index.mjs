import log from '@magic/log'

import { handleLink } from '../handleLink.mjs'

const validKeys = ['src', 'logo', 'href', 'to']

const declarations = {
  assigned: [],
  declared: {},
  used: {},
}

const ignoredLiterals = [
  'StringLiteral',
  'BooleanLiteral',
  'NullLiteral',
  'NumericLiteral',
  'RegExpLiteral',
]

const visit = ({ app, config, parent }) => {
  if (!parent) {
    return parent
  }
  if (Array.isArray(parent)) {
    return parent.map(n => visit({ parent: n, app, config }))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = parent.declarations.map(decl => visit({ parent: decl, app, config }))
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit({ parent: parent.expression, app, config })
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit({ parent: parent.right, app, config })
    parent.left = visit({ parent: parent.left, app, config })
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = visit({ parent: parent.params, app, config })
      parent.body = visit({ parent: parent.body, app, config })
    } else if (parent.body.callee) {
      parent.body.callee = visit({ parent: parent.body.callee, app, config })
      parent.params = visit({ parent: parent.params, app, config })
    } else if (parent.body.stmts) {
      parent.body.stmts = parent.body.stmts.map(stmt => visit({ parent: stmt, app, config }))
    } else {
      log.warn('unhandled ArrowFunctionExpression', parent)
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit({ parent: parent.test, app, config })
    parent.consequent = visit({ parent: parent.consequent, app, config })
    if (parent.alternate) {
      parent.alternate = visit({ parent: parent.alternate, app, config })
    }
  } else if (parent.type === 'CallExpression') {
    parent.arguments = parent.arguments.map(arg => {
      arg.expression = visit({ parent: arg.expression, app, config })
      return arg
    })

    if (parent.callee.type === 'Identifier') {
      declarations.used[parent.callee.value] = true
    }
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit({ parent: parent.id, app, config })
    parent.init = visit({ parent: parent.init, app, config })

    if (parent.id.type === 'Identifier') {
      declarations.declared[parent.id.value] = true
    } else if (parent.id.type === 'ArrayPattern') {
      parent.id = visit({ parent: parent.id, app, config })
      parent.init = visit({ parent: parent.init, app, config })
    } else if (parent.id.type === 'ObjectPattern') {
      parent.id = visit({ parent: parent.id, app, config })
      parent.init = visit({ parent: parent.init, app, config })
    } else {
      log.warn('unhandled VariableDeclarator', parent.id.type)
    }
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = parent.properties.map(prop => visit({ parent: prop, app, config }))
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

    parent.key = visit({ parent: parent.key, app, config })
    parent.value = visit({ parent: parent.value, app, config })
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit({ parent: parent.property, app, config })
    parent.object = visit({ parent: parent.object, app, config })
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = parent.elements.map(ele => {
      ele.expression = visit({ parent: ele.expression, undefined, app, config })
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = parent.elements.map(ele => visit({ parent: ele, app, config }))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = parent.quasis.map(quasi => {
      quasi.raw = visit({ parent: quasi.raw, app, config })
      quasi.cooked = visit({ parent: quasi.cooked, app, config })
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = visit({ parent: parent.arguments, app, config })
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = parent.stmts.map(stmt => visit({ parent: stmt, app, config }))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit({ parent: parent.argument, app, config })
  } else if (parent.type === 'ObjectPattern') {
    parent.properties.map(prop => visit({ parent: prop, app, config }))
  } else if (parent.type === 'AssignmentPattern') {
    parent.left = visit({ parent: parent.left, app, config })
    parent.right = visit({ parent: parent.right, app, config })
  } else if (parent.type === 'AssignmentPatternProperty') {
    parent.key = visit({ parent: parent.key, app, config })
  } else if (parent.type === 'ConditionalExpression') {
    parent.test = visit({ parent: parent.test, app, config })
    parent.consequent = visit({ parent: parent.consequent, app, config })
    parent.alternate = visit({ parent: parent.alternate, app, config })
  } else if (parent.type === 'BinaryExpression') {
    parent.left = visit({ parent: parent.left, app, config })
    parent.right = visit({ parent: parent.right, app, config })
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit({ parent: parent.argument, app, config })
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit({ parent: parent.callee, app, config })
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit({ parent: parent.expression, app, config })
  } else if (parent.type === 'RestElement') {
    parent.argument = visit({ parent: parent.argument, undefined, app, config })
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit({ parent: parent.key, app, config })
    parent.value = visit({ parent: parent.value, app, config })
  } else if (parent.type === 'TryStatement') {
    parent.block = visit({ parent: parent.block, app, config })
    parent.handler = visit({ parent: parent.handler, app, config })
  } else if (parent.type === 'CatchClause') {
    parent.param = visit({ parent: parent.param, app, config })
    parent.body = visit({ parent: parent.body, app, config })
  } else if (parent.type === 'Identifier') {
    // do nothing with Identifiers
    // console.log({ ancestor })
  } else if (ignoredLiterals.includes(parent.type)) {
    // do nothing with literals
    // console.log(parent)
  } else if (parent.type === 'Computed') {
    parent.expression = visit({ parent: parent.expression, app, config })
  } else if (parent.type === 'OptionalChainingExpression') {
    parent.expr = visit({ parent: parent.expr, app, config })
  } else {
    log.warn('unhandled parent type', parent.type)
  }

  return parent
}

const plugin = (app, config) => m => {
  const n = m

  n.body = m.body.map(item => visit({ parent: item, app, config }))

  const unusedTopLevel = []
  Object.keys(declarations.declared).map(key => {
    if (!declarations.used[key]) {
      unusedTopLevel.push(key)
    }
  })

  // console.log(unusedTopLevel, declarations.used)
  return n
}

export const getSwcConf = (app, config) => {
  const fileName = `${config.BABEL.CLIENT_LIB_NAME}.js`

  return {
    // Some options cannot be specified in .swcrc
    filename: fileName,

    sourceMaps: true,
    // Input files are treated as module.
    isModule: true,

    // All options below can be configured via .swcrc
    jsc: {
      parser: {
        syntax: 'ecmascript',
      },
      transform: {},
    },
    plugin: plugin(app, config),
  }
}
