const { Admin } = require('./modules/')

module.exports = {
  state: {
    isAdminActive: false,
    adminMenu: [
      { to: 'home', text: 'home' },
      { to: 'state', text: 'state' },
      { to: 'config', text: 'config' },
      { to: 'publish', text: 'publish' },
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
        color: '#000',
        backgroundColor: '#fff',
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

      a: {
        color: '#000',
        textShadow: 'none',
        boxShadow: 'none',
        textDecoration: 'underline',
        cursor: 'pointer',

        '&:hover': {
          color: '#444',
        },
      },
    },
  },

  View: page => (state, actions) =>
    div(
      { id: 'magic' },
      div(
        {
          class: 'wrapper',
          oncreate: () => {
            if (typeof window !== 'undefined' && actions.go) {
              window.addEventListener('popstate', actions.go)
            }
          },
        },
        [
          Admin,
          PageHead,
          page
            ? div({ class: 'page' }, page(state, actions))
            : div({ class: 'page' }, '404 - not found'),
          Footer.View,
        ],
      ),
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
