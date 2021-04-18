import { h } from '@magic/hyperapp'

export const component = name => (props = {}, children) => {
  if (typeof children === 'undefined') {
    if (
      typeof props === 'string' ||
      typeof props === 'number' ||
      typeof props === 'function' ||
      Array.isArray(props)
    ) {
      children = props
      props = {}
    } else if (typeof props.View === 'function') {
      const { View, ...p } = props
      children = View
      props = p
    }
  }

  return h(name, props, children)
}
