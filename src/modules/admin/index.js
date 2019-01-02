module.exports = {
  state: {
    isActive: false,
  },

  actions: {
    toggle: () => state => ({ isActive: !state.isActive }),
  },

  View: (state, actions) =>
    div({ class: 'admin' }, [
      button({ onclick: actions.toggle }, 'toggle'),
      state.isActive && div({ class: 'ui' }, h4('admin')),
    ]),
}
