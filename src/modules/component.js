const { h } = require('hyperapp')

const component = name => (attributes = {}, children = false) => {
  const is = (ele, ...types) => types.some(type => type === typeof ele)

  if (!children) {
    if (
      is(attributes, 'string', 'number') ||
      Array.isArray(attributes) ||
      is(attributes, 'function')
    ) {
      children = attributes
      attributes = {}
    } else if (is(attributes.View, 'function')) {
      children = attributes.View
      attributes = {}
    }
  }
  return h(name, attributes, children)
}

module.exports = component
