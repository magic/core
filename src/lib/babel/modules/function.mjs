import { getObjItem, getArrItem, matches } from '../lib/index.mjs'

/**
 * Remove functions by argument
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 * @param {object} originalPath
 */
export const removeFunctionByArg = (t, opts = [], path) => {
  if (!path || path.removed || path.type !== 'CallExpression') {
    return
  }

  // It doesn't exist in the options
  const args = path.get('arguments')

  // Now maybe we have something to remove!
  let toRemove = args.length && getArrItem(opts, path, args)
  toRemove = toRemove || []
  toRemove = toRemove.filter(val => !!val && !val.removed)

  if (toRemove && toRemove.length) {
    for (let i = 0; i < toRemove.length; i += 1) {
      toRemove[i] && !toRemove[i].removed && toRemove[i].remove()
    }
  }
}

/**
 * Remove functions
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 * @param {object} originalPath
 */
export const removeFunction = (t, opts = [], path) => {
  if (!path || path.removed) {
    return
  }

  // It doesn't exist in the options
  const pathHasIds = path.type === 'CallExpression' ? path.get('callee') : path
  const ids = getObjItem(pathHasIds)

  if (!matches(opts, ids.join('.'))) {
    return
  }

  !path.removed && path.remove()
}
