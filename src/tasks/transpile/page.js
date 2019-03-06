const { renderToString } = require('hyperapp-render')

const deep = require('@magic/deep')

const { applyWebRoot } = require('../../lib')

module.exports = app => page => {
  const state = deep.merge(page.state, app.state)
  const actions = deep.merge(page.actions, app.actions)

  // page url must overwrite app url to get .active class assigned correctly on menu items
  state.url = page.name

  const rendered = applyWebRoot(config, renderToString(app.View(page), state, actions))

  return {
    ...page,
    rendered,
  }
}
