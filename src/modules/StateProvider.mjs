import { h } from 'hyperapp/src/index.js'

export const StateProvider = state => (fn, props = {}, children = []) => {
  props = {
    ...state,
    ...props,
  }

  if (typeof fn === 'function') {
    return fn(props, children)
  } else if (typeof fn === 'string') {
    return h(fn, props, children)
  }
}
