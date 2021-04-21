import { h } from '@magic/hyperapp'

export const component = name => (props = {}, children) => {
  const is = (ele, ...types) => types.some(type => type === typeof ele)

  if (is(children, 'undefined')) {
    // are there children that have been processed by h already?
    if (props.props) {
      return h(name, {}, [props])
    }

    if (is(props, 'string', 'number', 'function') || Array.isArray(props)) {
      children = props
      props = {}
    } else if (is(props.View, 'function')) {
      children = props.View
      props = {}
    }
  }

  return h(name, props, children)
}
