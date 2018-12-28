const { h } = require('hyperapp')

const component = name => (attributes = {}, children = false) => {
  if (!children) {
    if (typeof attributes !== 'object' || Array.isArray(attributes)) {
      children = attributes
      attributes = {}
    }
  }
  return h(name, attributes, children)
}

module.exports = component
