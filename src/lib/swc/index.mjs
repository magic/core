
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

const handleLinks = props =>
  props.map(prop => {
    if (prop.key.value === 'menu') {
      prop.value.elements = prop.value.elements.map(ele => {
        ele.expression.properties = ele.expression.properties.map(p => {
          if (p.key.value === 'to') {
            // p.value.value = handleLink(p.value.value)
          } else if (p.key.value === 'items') {
            // p.value.elements = handleLinks(p.value.elements)
          }

          return p
        })

        return ele
      })
      // } else if (prop.key.value === 'items') {
      //   console.log('items')
    }

    return prop
  })

const handleLink = val => {
  if (val.startsWith('/') || val.startsWith('#')) {
    if (!val.startsWith(config.WEB_ROOT)) {
      val = `${config.WEB_ROOT}${val}`.replace(/\/\//g, '/')
    }
  }

  return val
}

const visit = (parent, ancestor) => {
  if (!parent) {
    return parent
  }
  if (Array.isArray(parent)) {
    return parent.map(n => visit(n, parent))
  }

  if (parent.type === 'VariableDeclaration') {
    parent.declarations = parent.declarations.map(decl => visit(decl, parent))
    const [initialState] = parent.declarations
    if (initialState.id.value === 'initialState') {
      initialState.init.properties = handleLinks(initialState.init.properties)
    }
  } else if (parent.type === 'ExpressionStatement') {
    parent.expression = visit(parent.expression, parent)
  } else if (parent.type === 'AssignmentExpression') {
    parent.right = visit(parent.right, parent)
    parent.left = visit(parent.left, parent)
  } else if (parent.type === 'ArrowFunctionExpression') {
    if (parent.params) {
      parent.params = visit(parent.params)
      parent.body = visit(parent.body)
    } else if (parent.body.callee) {
      parent.body.callee = visit(parent.body.callee, parent)
      parent.params = visit(parent.params, parent)
    } else if (parent.body.stmts) {
      parent.body.stmts = parent.body.stmts.map(stmt => visit(stmt, parent))
    } else {
      // console.log('unhandled ArrowFunctionExpression', parent)
    }
  } else if (parent.type === 'IfStatement') {
    parent.test = visit(parent.test, parent)
    parent.consequent = visit(parent.consequent, parent)
    if (parent.alternate) {
      parent.alternate = visit(parent.alternate, parent)
    }
  } else if (parent.type === 'CallExpression') {
    parent.arguments = parent.arguments.map(arg => {
      arg.expression = visit(arg.expression, parent)
      if (arg.expression.type === 'ObjectExpression') {
        arg.expression.properties.forEach(prop => {
          if (prop.type === 'KeyValueProperty') {
            if (prop.key.value === 'to' || prop.key.value === 'href') {
              if (prop.value.type === 'StringLiteral') {
                prop.value.value = handleLink(prop.value.value)
              } else {
                // console.log(prop)
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
    parent.id = visit(parent.id, parent)
    parent.init = visit(parent.init, parent)

    if (parent.id.type === 'Identifier') {
      declarations.declared[parent.id.value] = true
    } else if (parent.id.type === 'ArrayPattern') {
      parent.id = visit(parent.id, parent)
      parent.init = visit(parent.init, parent)
    } else if (parent.id.type === 'ObjectPattern') {
      parent.id = visit(parent.id, parent)
      parent.init = visit(parent.init, parent)
    } else {
      console.log('unhandled VariableDeclarator', parent.id.type)
    }
  } else if (parent.type === 'ObjectExpression') {
    parent.properties = parent.properties.map(prop => visit(prop, parent))
  } else if (parent.type === 'KeyValueProperty') {
    parent.key = visit(parent.key, parent)
    parent.value = visit(parent.value, parent)
  } else if (parent.type === 'MemberExpression') {
    parent.property = visit(parent.property, parent)
    parent.object = visit(parent.object, parent)
  } else if (parent.type === 'ArrayExpression') {
    parent.elements = parent.elements.map(ele => {
      ele.expression = visit(ele.expression)
      return ele
    })
  } else if (parent.type === 'ArrayPattern') {
    parent.elements = parent.elements.map(ele => visit(ele, parent))
  } else if (parent.type === 'TemplateLiteral') {
    parent.quasis = parent.quasis.map(quasi => {
      quasi.raw = visit(quasi.raw, parent)
      quasi.cooked = visit(quasi.cooked, parent)
      return quasi
    })
  } else if (parent.type === 'SpreadElement') {
    parent.arguments = visit(parent.arguments, parent)
  } else if (parent.type === 'BlockStatement') {
    parent.stmts = parent.stmts.map(stmt => visit(stmt, parent))
  } else if (parent.type === 'ReturnStatement') {
    parent.argument = visit(parent.argument, parent)
  } else if (parent.type === 'ObjectPattern') {
    parent.properties.map(prop => visit(prop, parent))
  } else if (parent.type === 'AssignmentPattern') {
    parent.left = visit(parent.left, parent)
    parent.right = visit(parent.right, parent)
  } else if (parent.type === 'AssignmentPatternProperty') {
    parent.key = visit(parent.key, parent)
  } else if (parent.type === 'ConditionalExpression') {
    parent.test = visit(parent.test, parent)
    parent.consequent = visit(parent.consequent, parent)
    parent.alternate = visit(parent.alternate, parent)
  } else if (parent.type === 'BinaryExpression') {
    parent.left = visit(parent.left, parent)
    parent.right = visit(parent.right, parent)
  } else if (parent.type === 'UnaryExpression') {
    parent.argument = visit(parent.argument, parent)
  } else if (parent.type === 'NewExpression') {
    parent.callee = visit(parent.callee, parent)
  } else if (parent.type === 'ParenthesisExpression') {
    parent.expression = visit(parent.expression, parent)
  } else if (parent.type === 'RestElement') {
    parent.argument = visit(parent.argument)
  } else if (parent.type === 'KeyValuePatternProperty') {
    parent.key = visit(parent.key, parent)
    parent.value = visit(parent.value, parent)
  } else if (parent.type === 'Identifier') {
    // do nothing with Identifiers
    // console.log({ parent, ancestor })
  } else if (ignoredLiterals.includes(parent.type)) {
    // do nothing with literals
    // console.log(parent)
  } else {
    console.log('unhandled parent type', parent.type)
  }

  return parent
}

const plugin = m => {
  const n = m

  n.body = m.body.map(visit)

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
    plugin,
  }
}
