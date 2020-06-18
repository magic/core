import { removeDebugger } from './modules/debugger.mjs'
import { removeFunction, removeFunctionByArg } from './modules/function.mjs'
import { removeVar } from './modules/var.mjs'

/**
 * Proceed with the function
 *
 * @param {object} t
 * @param {array} opts
 * @param {object} path
 * @param {function} fn
 */
const proceed = (t, opts = [], path, fn) => {
  const checkedOpts = opts.filter(val => !!val)
  if(checkedOpts.length) {
    fn(t, checkedOpts, path)
  }
}

export default opts => ({ types: t }) => ({
  visitor: {
    // TODO: What about empty vars? Or unset vars?
    // Vars
    VariableDeclarator(path) {
      proceed(t, opts.var, path, removeVar)
    },
    AssignmentExpression(path) {
      proceed(t, opts.var, path, removeVar)
    },
    LogicalExpression(path) {
      proceed(t, opts.var, path, removeVar)
    },
    BinaryExpression(path) {
      proceed(t, opts.var, path, removeVar)
    },
    // Debugger
    DebuggerStatement(path) {
      const opts = opts.debugger
      opts && removeDebugger(t, opts, path)
    },
    // Functions
    CallExpression(path) {
      proceed(t, opts.function, path, removeFunction)
      proceed(t, opts.var, path, removeFunctionByArg)
    },
    FunctionDeclaration(path) {
      proceed(t, opts.function, path, removeFunction)
    },
    FunctionExpression(path) {
      proceed(t, opts.function, path, removeFunction)
    },
  },
})
