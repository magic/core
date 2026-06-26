import swc from '@swc/core'
import is from '@magic/types'

import { visit, used } from './visit.mjs'

// Core magic variables that are not modules - cached as Set for O(1) lookup
const CORE_VARS = new Set([
  'h',
  'app',
  'C',
  'initialState',
  'helpers',
  'actions',
  'effects',
  'pages',
  'lib',
  'subscriptions',
  'req',
  'res',
  'err',
  'val',
])

/**
 * Collect all module variable names that are actually used in pages/object values
 * These variables must be kept because they're referenced
 */
const collectUsedModuleVars = block => {
  const usedVars = new Set()

  const traverse = node => {
    if (!node || typeof node !== 'object') return

    if (node.type === 'ObjectExpression' && node.properties) {
      for (const prop of node.properties) {
        if (prop.value?.type === 'Identifier') {
          usedVars.add(prop.value.value)
        }
        traverse(prop.value)
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'span' || key === 'ctxt') continue
      const child = node[key]
      if (Array.isArray(child)) {
        child.forEach(traverse)
      } else if (child && typeof child === 'object') {
        traverse(child)
      }
    }
  }

  traverse(block)
  return usedVars
}

/**
 * Remove unused module declarations from a BlockStatement
 * Handles multi-declarator statements (const a = A, b = B)
 */
const removeUnusedFromBlock = (block, usedModules, usedModuleVars) => {
  if (!block || block.type !== 'BlockStatement' || !block.stmts) {
    return
  }

  block.stmts = block.stmts.filter(stmt => {
    // Only process variable declarations
    if (stmt.type !== 'VariableDeclaration') {
      return true
    }

    // Handle each declarator individually
    stmt.declarations = stmt.declarations.filter(decl => {
      if (decl.id?.type !== 'Identifier') {
        return true // Keep non-Identifier patterns (destructuring, etc.)
      }

      const varName = decl.id.value

      // Skip core magic variables
      if (CORE_VARS.has(varName)) {
        return true
      }

      // Skip if this variable is used elsewhere (e.g., in pages object)
      if (usedModuleVars.has(varName)) {
        return true
      }

      // Check if it's a lowercase variable - only remove if not in usedModules
      if (is.case.lower(varName[0])) {
        if (!usedModules.has(varName)) {
          return false // Remove this declaration
        }
        return true
      }

      // Check if this is an uppercase module variable
      if (is.case.upper(varName[0])) {
        if (!usedModules.has(varName)) {
          return false // Remove this declaration
        }
        return true
      }

      return true
    })

    // Remove statement entirely if all declarators were removed
    return stmt.declarations.length > 0
  })
}

/**
 * Find the __MAGIC__ arrow function and remove unused modules from its body
 */
const filterMagicFunction = (ast, usedModules) => {
  for (const item of ast.body) {
    if (item.type === 'VariableDeclaration') {
      for (const decl of item.declarations) {
        if (decl.id?.value === '__MAGIC__' && decl.init?.type === 'ArrowFunctionExpression') {
          const arrowFn = decl.init
          // The body is either a BlockStatement directly or an object
          if (arrowFn.body?.type === 'BlockStatement') {
            // First collect which module variables are actually used
            const usedModuleVars = collectUsedModuleVars(arrowFn.body)
            removeUnusedFromBlock(arrowFn.body, usedModules, usedModuleVars)
          }
        }
      }
    }
  }
}

/**
 * Transform the client code using SWC:
 * 1. Parse the code to AST
 * 2. Visit and transform the AST (tracks used modules)
 * 3. Remove unused module declarations from __MAGIC__ function
 * 4. Generate code from AST
 * 5. Minify the output
 */
export const transformClient = async (code, app, config) => {
  const fileName = `${config.CLIENT_LIB_NAME}.js`

  // Reset used modules tracking
  used.modules = new Set()
  // Cache modules as Set for O(1) lookups
  used.moduleNames = new Set(Object.keys(app.modules))

  // Parse the code to AST
  const ast = await swc.parse(code, {
    syntax: 'typescript',
    jsx: true,
    isModule: true,
    target: 'es2017',
  })

  // Transform the AST - this tracks used modules and removes CHECK_PROPS calls
  ast.body = ast.body.map(item => visit({ parent: item, app, config }))

  // Filter unused modules from app.modules
  app.modules = Object.fromEntries(
    Object.entries(app.modules).filter(([name]) => used.modules.has(name)),
  )

  // Remove unused module declarations from __MAGIC__ function body
  filterMagicFunction(ast, used.modules)

  // Generate code from AST
  const { code: generated } = await swc.print(ast, {
    filename: fileName,
    isModule: true,
  })

  // Minify the output
  const { code: minified } = await swc.minify(generated, {
    compress: {
      dead_code: true,
      drop_debugger: true,
      drop_console: config.IS_PROD,
      passes: 2,
      unused: true,
    },
    mangle: config.IS_PROD,
    format: {
      comments: false,
    },
  })

  return minified
}
