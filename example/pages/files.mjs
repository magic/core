export const state = {
  title: '@magic/core files',
  description: '@magic/core directory docs.',
}

export const View = state => {
  const examples = {
    page: `
export default {
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
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}`,
    app: `
export default {
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
export default {
  ROOT: 'example',
  THEME: 'blue',
  WEB_ROOT: '/core/',

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,

  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files
  CLIENT_LIB_NAME: 'magic',
}`,
    theme: `
export default {
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
      li('/assets/lib.mjs - imports npm and local but external packages into your app'),
      li('/app.mjs - gets merged into the app, can set state, actions, style here'),
      li('/config.mjs - custom config for your app'),
      li('/assets/Menu.mjs - custom Menu for your app'),
    ]),

    h2({ id: 'pages' }, '/pages'),
    p('the pages dir contains the pages of your webapp.'),
    p([
      "each page has it's own state and actions, ",
      "but also inherits the global state and actions from the app and it's dependencies",
    ]),

    h3({ id: 'pages-dir-structure' }, 'pages directory to url map, for the domain mag.ic:'),
    Pre(`
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
`),

    h3({ id: 'pages-example' }, 'example page:'),
    Pre(examples.page),

    h2({ id: 'assets' }, '/assets'),
    p('the assets dir contains custom components of your app.'),
    p('you can additionally import @magic-modules here'),
    h3({ id: 'assets-example' }, 'example /assets/index.mjs'),
    Pre(examples.assets),

    h2({ id: 'static' }, '/assets/static'),
    p('the static dir contains all of your static assets.'),
    p('every file in this directory gets copied to the public dir.'),
    p('image and svg files get minified using imagemin'),
    p([
      'text and binary files get compressed using the optional ',
      Link({ to: 'https://github.com/jaeh/node-zopfli-es' }, 'node-zopfli-es'),
      ' (if it is installed)',
    ]),

    h2({ id: 'themes' }, '/assets/themes'),
    p('the themes directory contains... themes.'),
    p([
      'a magic theme is an object of css rules, see ',
      Link({ to: 'https://github.com/magic/css/' }, '@magic/css'),
      ' for more examples and documentation.',
    ]),

    h3({ id: 'themes-example' }, 'example theme'),
    Pre(examples.theme),

    h2({ id: 'app' }, '/assets/app.mjs'),
    p('the /app.mjs file allows you to set global state, actions, and styles'),

    h3({ id: 'app-example' }, 'example /app.mjs'),
    Pre(examples.app),

    h2({ id: 'config' }, '/config.mjs'),
    p('the /config.mjs file allows you to set various aspects of your app'),

    h3({ id: 'config-example' }, 'example /config.mjs'),
    Pre(examples.config),

    Link(
      { to: 'https://github.com/magic/core/blob/master/src/modules/Menu.mjs' },
      'Menu.mjs on github',
    ),
  ]
}
