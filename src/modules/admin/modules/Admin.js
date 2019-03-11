const Admin = (state, actions) => {
  const url = state.adminUrl.charAt(0).toUpperCase() + state.adminUrl.slice(1)

  return div({ class: `admin${state.isAdminActive ? ' active' : ''}` }, [
    button({ class: 'toggle', onclick: actions.toggleAdmin }, 'Admin'),
    state.isAdminActive &&
      div({ class: 'ui' }, [
        AdminMenu.View({ menu: state.adminMenu, action: actions.goAdmin }),

        h4(url),

        AdminPages[url] ? AdminPages[url](state, actions) : div('admin page not found'),
        // url === 'home' &&
        //   div([h3('admin home'), div('will enable you to edit pages, config, css etc.')]),
        // url === 'state' && pre(JSON.stringify(state, null, 2)),
        // url === 'config' && pre(JSON.stringify(state.config, null, 2)),
        // url === 'publish' && AdminPages.Publish,
      ]),
  ])
}

module.exports = Admin
