const deep = require('@magic/deep')

const merge = {
  state: (parent, component) => deep.merge(parent.state, component.state),
  actions: (parent, component) => deep.merge(parent.actions, component.actions),
  style: (parent, component) => deep.merge(parent.style, component.style),
}

module.exports = merge
