module.exports = {
  state: {
    isAdminActive: false,
  },

  actions: {
    toggleAdmin: () => state => ({ isAdminActive: !state.isAdminActive }),
  },

  style: {
    '.admin': {
      position: 'fixed',
      top: 0,
      right: 0,

      '&.active': {
        backgroundColor: 'white',
        zIndex: 1000,
        borderLeft: '3px solid grey',
        overflowY: 'auto',
        height: '100vh',
        width: '50%',
        minWidth: '500px',
      }
    },
  },

  View: page => (state, actions) =>
    div(
      { id: 'magic' },
      div({ class: 'wrapper' }, [
        div({ class: `admin ${state.isAdminActive ? ' active' : ''}` }, [
          button({ onclick: actions.toggleAdmin }, 'toggle'),
          state.isAdminActive && div({ class: 'ui' }, [
            h4('admin'),
            pre(JSON.stringify(state, null, 2)),
          ]),
        ]),

        header({ class: 'main' }, [
          state.logo &&
            img({ class: 'logo', src: state.logo, height: 100, width: 200, role: 'presentation' }),
          state.menu && Menu.View,
        ]),
        page
          ? div({ class: 'page' }, page(state, actions))
          : div({ class: 'page' }, '404 - not found'),
        Footer.View,
      ]),
    ),

  global: {
    state: {
      isAdminActive: true,
    },
    actions: {
      toggleAdmin: true,
    },
  },
}
