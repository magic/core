import { h } from '@magic/hyperapp'

export const component = name => (props = {}, children = false) => {
  const is = (ele, ...types) => types.some(type => type === typeof ele)

  if (!children) {
    if (is(props, 'string', 'number', 'function') || Array.isArray(props)) {
      children = props
      props = {}
    } else if (is(props.View, 'function')) {
      children = props.View
      props = {}
    } else if (props.props || props.children) {
      return h(name, {}, props)
    }
  }

  return h(name, props, children)
}
