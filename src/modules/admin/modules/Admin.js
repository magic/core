module.exports = (state, actions) =>
  div({ class: `admin${state.isAdminActive ? ' active' : ''}` }, [
    button({ class: 'toggle', onclick: actions.toggleAdmin }, 'toggle'),
    state.isAdminActive && div({ class: 'ui' }, [
      AdminMenu({ menu: state.adminMenu, action: actions.goAdmin }),

      h4(`admin ${state.adminUrl}`),

      state.adminUrl === 'home' && div('admin home'),
      state.adminUrl === 'state' && pre(JSON.stringify(state, null, 2)),
      state.adminUrl === 'config' && pre(JSON.stringify(state.config, null, 2)),
    ]),
  ])