import swc from '@swc/core'

import { visit, used } from './visit.mjs'

/**
 * Transform the client code using SWC:
 * 1. Parse the code to AST
 * 2. Visit and transform the AST
 * 3. Generate code from AST
 * 4. Minify the output
 */
export const transformClient = async (code, app, config) => {
  const fileName = `${config.CLIENT_LIB_NAME}.js`

  // Reset used modules tracking
  used.modules = new Set()

  // Parse the code to AST
  const ast = await swc.parse(code, {
    syntax: 'typescript',
    jsx: true,
    isModule: true,
    target: 'es2017',
  })

  // Transform the AST
  ast.body = ast.body.map(item => visit({ parent: item, app, config }))

  // Filter unused modules from app.modules
  app.modules = Object.fromEntries(
    Object.entries(app.modules).filter(([name]) => used.modules.has(name)),
  )

  // Generate code from AST
  const { code: generated } = await swc.print(ast, {
    filename: fileName,
    isModule: true,
  })

  // Minify the output
  const minify = config.IS_PROD
    ? {
        compress: true,
        mangle: true,
        format: {
          comments: false,
        },
      }
    : {
        compress: { unused: true },
        mangle: false,
      }

  const { code: minified } = await swc.minify(generated, minify)

  return minified
}
