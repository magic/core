const { Admin } = require('./modules/')

module.exports = {
  state: {
    isAdminActive: false,
    adminMenu: [
      { to: 'home', text: 'home' },
      { to: 'state', text: 'state' },
      { to: 'config', text: 'config' },
    ],
    adminUrl: 'home',
  },

  actions: {
    toggleAdmin: () => state => ({ isAdminActive: !state.isAdminActive }),
    goAdmin: adminUrl => ({ adminUrl }),
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
      },
      '.toggle': {
        float: 'right',
      },
    },
  },

  View: page => (state, actions) =>
    div(
      { id: 'magic' },
      div({ class: 'wrapper' }, [
        Admin,
        (state.logo || state.menu) && header({ class: 'main' }, [
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
      adminMenu: true,
      adminUrl: true,
    },
    actions: {
      toggleAdmin: true,
      goAdmin: true,
    },
  },
}
