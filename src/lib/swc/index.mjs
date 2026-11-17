import is from '@magic/types'

import swc from '@swc/core'
/** @import { AppObject, Config, SwcNode } from '../../types.mjs' */
/** @import { Module, ParseOptions } from '@swc/core' */
/**
 * A loose SWC BlockStatement-like node, for the dead-code removal helpers.
 *
 * @typedef {{ type: string, stmts: { type: string, declarations: { id?: { type: string, value: string }, [key: string]: unknown }[], [key: string]: unknown }[] }} SwcBlock
 */
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
/**
 * @param {unknown} block
 * @returns {Set<string>}
 */
const collectUsedModuleVars = block => {
  /** @type {Set<string>} */
  const usedVars = new Set()

  /**
   * @param {unknown} node
   */
  const traverse = node => {
    if (!is.objectNative(node)) {
      return
    }

    if (node.type === 'ObjectExpression' && is.array(node.properties)) {
      for (const prop of node.properties) {
        const propNode = /** @type {{ value?: { type?: string, value?: string } }} */ (prop)
        if (propNode.value?.type === 'Identifier' && is.string(propNode.value.value)) {
          usedVars.add(propNode.value.value)
        }
        traverse(propNode.value)
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'span' || key === 'ctxt') {
        continue
      }
      const child = node[key]
      if (is.array(child)) {
        child.forEach(traverse)
      } else if (is.objectNative(child)) {
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
/**
 * @param {unknown} block
 * @param {Set<string>} usedModules
 * @param {Set<string>} usedModuleVars
 * @returns {void}
 */
const removeUnusedFromBlock = (block, usedModules, usedModuleVars) => {
  if (!is.objectNative(block) || block.type !== 'BlockStatement' || !block.stmts) {
    return
  }

  const blockNode = /** @type {SwcBlock} */ (/** @type {unknown} */ (block))
  blockNode.stmts = blockNode.stmts.filter(stmt => {
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
/**
 * @param {Module} ast
 * @param {Set<string>} usedModules
 * @returns {void}
 */
const filterMagicFunction = (ast, usedModules) => {
  for (const item of ast.body) {
    if (item.type === 'VariableDeclaration') {
      for (const decl of item.declarations) {
        if (
          decl.id?.type === 'Identifier' &&
          decl.id.value === '__MAGIC__' &&
          decl.init?.type === 'ArrowFunctionExpression'
        ) {
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
/**
 * @param {string | undefined} code
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<string>}
 */
export const transformClient = async (code, app, config) => {
  const fileName = `${config.CLIENT_LIB_NAME}.js`

  // Reset used modules tracking
  used.modules = new Set()
  // Cache modules as Set for O(1) lookups
  // Guard against app.modules being undefined/null in some build contexts
  used.moduleNames = new Set(is.objectNative(app.modules) ? Object.keys(app.modules) : [])

  // Ensure code is a string for SWC parsing
  // If code is not a string (e.g., undefined), return a minimal valid magic client
  if (!is.string(code)) {
    return 'const __MAGIC__ = () => {};\n__MAGIC__();\n'
  }

  const ast = await swc.parse(
    code,
    /** @type {ParseOptions} */ (
      /** @type {unknown} */ ({
        syntax: 'typescript',
        jsx: true,
        isModule: true,
        target: 'es2017',
      })
    ),
  )
  // Transform the AST - this tracks used modules and removes CHECK_PROPS calls
  // par is unused by visit, but part of its expected shape
  ast.body = /** @type {typeof ast.body} */ (
    ast.body.map(item =>
      visit({
        par: /** @type {SwcNode} */ (item),
        parent: /** @type {SwcNode} */ (item),
        app,
        config,
      }),
    )
  )
  // Filter unused modules from app.modules
  if (is.objectNative(app.modules)) {
    app.modules = Object.fromEntries(
      Object.entries(app.modules).filter(([name]) => used.modules.has(name)),
    )
  }

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
