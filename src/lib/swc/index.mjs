import log from '@magic/log'

import { replaceSlashSlash } from '../replaceSlashSlash.mjs'

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

const handleLink = (val, app) => {
  if (!val.startsWith(config.WEB_ROOT)) {
    if (val.startsWith('/') || val.startsWith('#') || val.startsWith('/#')) {
      val = replaceSlashSlash(`${config.WEB_ROOT}${val}`)
    }
  }

  app.links.push(val)
  return val
}

const visit = (parent, ancestor, app) => {
  if (!parent) {
    return parent
  }
  if (Array.isArray(parent)) {
    return parent.map(n => visit(n, parent, app))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = parent.declarations.map(decl => visit(decl, parent, app))
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit(parent.expression, parent, app)
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit(parent.right, parent, app)
    parent.left = visit(parent.left, parent, app)
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = visit(parent.params, undefined, app)
      parent.body = visit(parent.body, undefined, app)
    } else if (parent.body.callee) {
      parent.body.callee = visit(parent.body.callee, parent, app)
      parent.params = visit(parent.params, parent, app)
    } else if (parent.body.stmts) {
      parent.body.stmts = parent.body.stmts.map(stmt => visit(stmt, parent, app))
    } else {
      log.warn('unhandled ArrowFunctionExpression', parent)
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit(parent.test, parent, app)
    parent.consequent = visit(parent.consequent, parent, app)
    if (parent.alternate) {
      parent.alternate = visit(parent.alternate, parent, app)
    }
  } else if (parent.type === 'CallExpression') {
    parent.arguments = parent.arguments.map(arg => {
      arg.expression = visit(arg.expression, parent, app)
      if (arg.expression.type === 'ObjectExpression') {
        arg.expression.properties.forEach(prop => {
          if (prop.type === 'KeyValueProperty') {
            if (validKeys.includes(prop.key.value)) {
              if (prop.value.type === 'StringLiteral') {
                prop.value.value = handleLink(prop.value.value, app)
                // } else {
                // console.log('uncaught link', prop)
              }
            }
          }
        })
      }

      return arg
    })

    if (parent.callee.type === 'Identifier') {
      declarations.used[parent.callee.value] = true
    }
  } else if (parent.type === 'VariableDeclarator') {
    parent.id = visit(parent.id, parent, app)
    parent.init = visit(parent.init, parent, app)

    if (parent.id.type === 'Identifier') {
      declarations.declared[parent.id.value] = true
    } else if (parent.id.type === 'ArrayPattern') {
      parent.id = visit(parent.id, parent, app)
      parent.init = visit(parent.init, parent, app)
    } else if (parent.id.type === 'ObjectPattern') {
      parent.id = visit(parent.id, parent, app)
      parent.init = visit(parent.init, parent, app)
    } else {
      log.warn('unhandled VariableDeclarator', parent.id.type)
    }
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = parent.properties.map(prop => visit(prop, parent, app))
  } else if (parent.type === 'KeyValueProperty') {
    parent.key = visit(parent.key, parent, app)
    parent.value = visit(parent.value, parent, app)
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit(parent.property, parent, app)
    parent.object = visit(parent.object, parent, app)
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = parent.elements.map(ele => {
      ele.expression = visit(ele.expression, undefined, app)
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = parent.elements.map(ele => visit(ele, parent, app))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = parent.quasis.map(quasi => {
      quasi.raw = visit(quasi.raw, parent, app)
      quasi.cooked = visit(quasi.cooked, parent, app)
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = visit(parent.arguments, parent, app)
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = parent.stmts.map(stmt => visit(stmt, parent, app))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit(parent.argument, parent, app)
  } else if (parent.type === 'ObjectPattern') {
    parent.properties.map(prop => visit(prop, parent, app))
  } else if (parent.type === 'AssignmentPattern') {
    parent.left = visit(parent.left, parent, app)
    parent.right = visit(parent.right, parent, app)
  } else if (parent.type === 'AssignmentPatternProperty') {
    parent.key = visit(parent.key, parent, app)
  } else if (parent.type === 'ConditionalExpression') {
    parent.test = visit(parent.test, parent, app)
    parent.consequent = visit(parent.consequent, parent, app)
    parent.alternate = visit(parent.alternate, parent, app)
  } else if (parent.type === 'BinaryExpression') {
    parent.left = visit(parent.left, parent, app)
    parent.right = visit(parent.right, parent, app)
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit(parent.argument, parent, app)
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit(parent.callee, parent, app)
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit(parent.expression, parent, app)
  } else if (parent.type === 'RestElement') {
    parent.argument = visit(parent.argument, undefined, app)
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit(parent.key, parent, app)
    parent.value = visit(parent.value, parent, app)
  } else if (parent.type === 'Identifier') {
    // do nothing with Identifiers
    // console.log({ parent, ancestor })
  } else if (ignoredLiterals.includes(parent.type)) {
    // do nothing with literals
    // console.log(parent)
  } else {
    log.warn('unhandled parent type', parent.type)
  }

  return parent
}

const plugin = app => m => {
  const n = m

  n.body = m.body.map(item => visit(item, undefined, app))

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
    plugin: plugin(app),
  }
}
