const { renderToString } = require('hyperapp-render')

const deep = require('@magic/deep')

const { applyWebRoot } = require('../../lib')

module.exports = app => page => {
  const state = deep.merge(page.state, app.state, { url: page.name })
  const actions = deep.merge(page.actions, app.actions)

  const rendered = applyWebRoot(config, renderToString(app.View(page), state, actions))

  return {
    ...page,
    rendered,
  }
}
