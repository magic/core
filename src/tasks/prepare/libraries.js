const prepare = ({ pages }) => {
  const lib = {}

  app.pages.map(page => {
    if (!is.empty(page.state)) {
      if (!app.state.pages) {
        app.state.pages = {}
      }
      app.state.pages[page.name] = page.state
    }
    if (!is.empty(page.actions)) {
      if (!app.actions.pages) {
        app.actions.pages = {}
      }
      app.actions.pages[page.name] = page.actions
    }

    if (!is.empty(page.lib)) {
      app.lib = deep.merge(page.lib, app.lib)
    }

    return page
  })

}