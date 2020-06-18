/**
 * Remove debugger
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 */
export const removeDebugger = (t, opts, path) => opts && path && !path.removed && path.remove()
