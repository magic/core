import { matches } from '../lib/index.mjs'
import { removeFunction, removeFunctionByArg } from './function.mjs'
import { removeVar } from './var.mjs'

/**
 * Removes target references
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 * @returns
 */
const removeTargetRefs = (t, opts = [], path) => {
  const specifiers = (path && path.specifiers) || (path && path.node && path.node.specifiers) || []

  specifiers.forEach(specifier => {
    const importedIdentifierName = specifier.local.name
    const { referencePaths } = path.scope.getBinding(importedIdentifierName)

    // Go per reference path
    referencePaths.forEach(referencePath => {
      removeFunction(t, [importedIdentifierName], referencePath.parentPath)
      removeFunctionByArg(t, [importedIdentifierName], referencePath.parentPath)
      removeVar(t, [importedIdentifierName], referencePath.parentPath)
    })
  })

  !path.removed && path.remove()
}

/**
 * Remove import
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 */
export const removeImport = (t, opts = [], path) => {
  if (!path || path.removed) {
    return
  }

  const source = path.source || path.node.source
  if (!source || !source.value) {
    return
  }

  // It doesn't exist in the options
  if (!matches(opts, source.value)) {
    return
  }
  removeTargetRefs(t, opts, path)

  !path.removed && path.remove()
}
