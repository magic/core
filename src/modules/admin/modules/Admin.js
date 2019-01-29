module.exports = (state, actions) =>
  div({ class: `admin${state.isAdminActive ? ' active' : ''}` }, [
    button({ class: 'toggle', onclick: actions.toggleAdmin }, 'toggle'),
    state.isAdminActive &&
      div({ class: 'ui' }, [
        AdminMenu.View({ menu: state.adminMenu, action: actions.goAdmin }),

        h4(state.adminUrl),

        state.adminUrl === 'home' && div([
          h3('admin home'),
          div('will enable you to edit pages, config, css etc.'),
        ]),
        state.adminUrl === 'state' && pre(JSON.stringify(state, null, 2)),
        state.adminUrl === 'config' && pre(JSON.stringify(state.config, null, 2)),
      ]),
  ])
