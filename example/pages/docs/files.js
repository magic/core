module.exports = {
  state: {
    title: '@magic/core files',
    description: '@magic/core directory docs.',
  },

  Body: state => {
    const examples = {
      page: `
module.exports = {
  state: {
    variable: 'test',
  },
  actions: {
    changeVar: () => ({ variable: 'changed' }),
  },
  style: {
    '.cl': {
      color: 'green',
    },
  },
  Body: state => div({ class: 'cl' }, ['this is the page content.', state.variable]),
}`,
      assets: `
module.exports = {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}`,
      app: `
module.exports = {
  state: {
    globalStateVar: 'globally available',
  },
  actions: {
    globalAction: () => ({ globalStateVar: 'overwritten.' }),
  },
  style: {
    'body': {
      color: 'green',
    },
  },
}`,
      config: `
module.exports = {
  // theme dir must exist in /themes and must include /themes/index.js
  THEME: 'blue',
  // set if your page root starts with a path, eg yourname.github.io/repository-name/
  WEB_ROOT: '/repository-name/',
  // the root directory of your magic dir.
  // usually this can be omitted.
  ROOT: 'example',
}`,
      theme: `
module.exports = {
  'body': {
    color: 'blue',
  },
}`,
      menu: `
module.exports = {
  View: ${Menu.View.toString()},
}`,
    }

    return [
      h1(state.title),
      p('There are multiple magic files and directories.'),
      ul([
        li([a({ href: '#pages' }, '/pages'), ' - directory maps to urls in your app']),
        li([a({ href: '#static' }, '/static'), ' - static files']),
        li([
          a({ href: '#assets' }, '/assets'),
          ' - custom components, @magic-modules get imported here',
        ]),
        li([
          a({ href: '#themes' }, '/themes'),
          '- theme directory, @magic-themes get imported here',
        ]),
        li([
          a({ href: '#appinfo' }, '/app.js'),
          '- gets merged into the app, can set state, actions, style here',
        ]),
        li([a({ href: '#config' }, '/config.js'), '- custom config for your app']),
        li([a({ href: '#menu' }, '/assets/Menu.js'), '- custom Menu for your app']),
      ]),

      div({ id: 'pages' }, [
        h2('/pages'),
        p('the pages dir contains the pages of your webapp.'),
        p([
          "each page has it's own state and actions, ",
          "but also inherits the global state and actions from the app and it's dependencies",
        ]),
        h5('example page:'),
        Pre.View(examples.page),
      ]),
      div({ id: 'static' }, [
        h2('/static'),
        p('the static dir contains all of your static assets.'),
        p('every file in this directory gets copied to the app'),
      ]),
      div({ id: 'assets' }, [
        h2('/assets'),
        p('the assets dir contains custom components of your app.'),
        p('you can additionally import @magic-modules here'),
        h5('example /assets/index.js'),
        Pre.View(examples.assets),
      ]),
      div({ id: 'themes' }, [
        h2('/themes'),
        p('the themes directory contains... themes.'),
        p(
          'at the moment this is file based, which means you have to manually import themes there.',
        ),
        p('TODO: handle themes as we handle assets. maybe move them into assets.'),
        h5('example /themes/blue/index.js'),
        Pre.View(examples.theme),
      ]),
      div({ id: 'appinfo' }, [
        h2('/app.js'),
        p('the /app.js file allows you to set global state, actions, and styles'),
        h5('example /app.js'),
        Pre.View(examples.app),
      ]),
      div({ id: 'config' }, [
        h2('/config.js'),
        p('the /config.js file allows you to set the theme, root and web_root of your app'),
        h5('example /config.js'),
        Pre.View(examples.config),
      ]),
      div({ id: 'menu' }, [
        h2('/assets/Menu.js'),
        p('the /assets/Menu.js file allows you to replace the default Menu component'),
        h5('example /assets/Menu.js'),
        p('which changes nothing'),
        Pre.View(examples.menu),
      ]),
    ]
  },
}
