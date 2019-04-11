module.exports = {
  state: {
    title: '@magic/core files',
    description: '@magic/core directory docs.',
  },

  View: state => {
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
  View: state => div({ class: 'cl' }, [
    'this is the page content.',
    state.variable,
  ]),
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
  ROOT: 'example',
  THEME: 'blue',
  WEB_ROOT: '/core/',

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,
}`,
      theme: `
module.exports = {
  'body': {
    color: 'blue',
  },
}`,
    }

    return [
      h1(state.title),
      p('There are multiple magic files and directories.'),
      ul([
        li('/pages - files in the page directory map to urls in your app.'),
        li('/assets - custom components, @magic-modules get imported here'),
        li('/assets/static - static files'),
        li('/assets/themes - theme directory, @magic-themes get imported here'),
        li('/app.js - gets merged into the app, can set state, actions, style here'),
        li('/config.js - custom config for your app'),
        li('/assets/Menu.js - custom Menu for your app'),
      ]),

      div({ id: 'pages' }, [
        h2('/pages'),
        p('the pages dir contains the pages of your webapp.'),
        p([
          "each page has it's own state and actions, ",
          "but also inherits the global state and actions from the app and it's dependencies",
        ]),

        h4('page to url map, for the domain mag.ic:'),
        ul([
          li('/pages/index.js === http://mag.ic/'),
          li('/pages/pageName.js === http://mag.ic/pageName/'),
          li('/pages/page-name.js === http://mag.ic/page-name/'),
          li('/pages/page_name.js === http://mag.ic/page_name/'),
          li('/pages/dir/index.js === http://mag.ic/dir/'),
          li('/pages/dir/name.js === http://mag.ic/dir/name/'),
        ]),

        h3('example page:'),
        Pre.View(examples.page),
      ]),

      div({ id: 'assets' }, [
        h2('/assets'),
        p('the assets dir contains custom components of your app.'),
        p('you can additionally import @magic-modules here'),
        h3('example /assets/index.js'),
        Pre.View(examples.assets),
      ]),

      div({ id: 'static' }, [
        h2('/assets/static'),
        p('the static dir contains all of your static assets.'),
        p('every file in this directory gets copied to the app'),
        p('image and svg files get minified using imagemin'),
        p('text and binary files get compressed using zopfli'),
      ]),

      div({ id: 'themes' }, [
        h2('/assets/themes'),
        p('the themes directory contains... themes.'),
        p(
          'at the moment this is file based, which means you have to manually import themes there.',
        ),
        p('TODO: handle themes as we handle assets. maybe move them into assets.'),
        h3('example /themes/blue/index.js'),
        Pre.View(examples.theme),
      ]),

      div({ id: 'appinfo' }, [
        h2('/app.js'),
        p('the /app.js file allows you to set global state, actions, and styles'),
        h3('example /app.js'),
        Pre.View(examples.app),
      ]),

      div({ id: 'config' }, [
        h2('/config.js'),
        p('the /config.js file allows you to set the theme, root and web_root of your app'),
        h3('example /config.js'),
        Pre.View(examples.config),
      ]),

      div({ id: 'menu' }, [
        h2('/assets/Menu.js'),
        p('the /assets/Menu.js file allows you to replace the default Menu component'),
        h3('example /assets/Menu.js'),
        Link(
          { to: 'https://github.com/magic/core/blob/master/src/modules/Menu.js' },
          'Menu.js on github',
        ),
      ]),
    ]
  },
}
