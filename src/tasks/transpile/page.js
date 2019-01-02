const deep = require('@magic/deep')
const { renderToString } = require('hyperapp-render')
const { applyWebRoot } = require('../../lib')

module.exports = app => page => {
  const state = deep.merge(page.state, app.state)
  const actions = deep.merge(page.actions, app.actions)
  const rendered = applyWebRoot(renderToString(app.View(page), state, actions))

  return {
    ...page,
    rendered,
  }
}
