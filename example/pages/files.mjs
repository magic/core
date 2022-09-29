export const state = {
  title: '@magic/core files',
  description: '@magic/core directory docs.',
}

export const View = state => [
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

  h3({ id: 'pages-dir-structure' }, 'pages directory to url map'),

  p('for the domain mag.ic:'),

  Pre(`
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
`),

  h1({ id: 'pages-example' }, 'example page'),

  p('Pages can use javascript, html or markdown'),

  h2({ id: 'pages-example-js' }, 'javascript example'),

  p(
    'A magic javascript page is a @magic-module. The only difference is that pages get exposed via http',
  ),

  Pre(`
export const View = state =>
  div({ class: 'cl' }, [
    'this is the page content.',
    state.variable,
  ])

export const state = {
  variable: 'test',
}

export const actions = {
  changeVar: state => ({ ...state, variable: 'changed' }),
}

export const style = {
  '.cl': {
    color: 'green',
  },
}
`),

  h2({ id: 'pages-example-html' }, 'html example'),

  p('html pages can only export state and View.'),

  Pre(`
---
@state
{
  "title": "html file example",
    "description": "this module gets imported from a html file."
}
---

<h2>&#36;{ state.title }</h4>

<p>{{ state.description }}</p>
`),

  h2({ id: 'pages-example-markdown' }, 'markdown example'),

  p('markdown pages can only export state and View.'),

  Pre(`
---
@state {
  "title": "markdown file example",
  "description": "markdown file description"
}
---

## &#36;{state.title}

&#36;{state.description}
`),

  h2({ id: 'assets' }, 'assets'),

  p('the assets dir contains custom components of your app.'),

  p('you can import additional @magic-modules here'),

  h3({ id: 'assets-example' }, '/assets/index.mjs'),

  Pre(`
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}
`),

  h2({ id: 'static' }, '/assets/static'),

  p([
    'the static dir contains all of your static assets.',
    'every file in this directory gets copied to the public dir.',
    'image and svg files get minified using imagemin.',
  ]),

  p([
    'text and binary files get compressed using the optional ',
    Link({ to: 'https://github.com/jaeh/node-zopfli-es', text: 'node-zopfli-es' }),
    ' (if it is installed)',
  ]),

  h2({ id: 'themes' }, '/assets/themes'),

  p('the themes directory contains...themes.'),

  p([
    'a magic theme is an object of css rules, see ',
    Link({ text: '@magic/css', to: 'https://github.com/magic/css/' }),
    ' for more examples and documentation.',
  ]),

  h3({ id: 'themes-example' }, 'example theme'),

  Pre(`
export default {
  'body': {
    color: 'blue',
  },
}
`),

  h2({ id: 'app' }, '/app.mjs'),

  p('the /app.mjs file allows you to set global state, actions, and styles'),

  h3({ id: 'app-example' }, '/example/app.mjs'),

  Pre(`
export const state = {
  globalStateVar: 'globally available',
}

export const actions = {
  globalAction: () => ({ globalStateVar: 'overwritten.' }),
}

export const style = {
  'body': {
    color: 'green',
  },
}
`),
  h2({ id: 'config' }, '/config.mjs'),

  p('the /config.mjs file allows you to set various aspects of your app'),

  h3({ id: 'config-example' }, '/config.mjs example'),

  Pre(`
export default {
  // the local root directory of the magic app
  ROOT: 'example',

  // gets suffixed to the url. in this case domain.com/core/ will be the page root.
  WEB_ROOT: '/core/',

  // the theme in use, lives in {ROOT}/assets/themes/{name} or can be installed as either '@magic-themes/{name}' or 'magic-theme-{name}'
  THEME: 'docs',

  // the full url of the page.
  URL: 'magic.github.io/core/',

  // the public dir the bundles get written to
  PUBLIC: 'docs',

  // the directory in the pages directory that holds the blog posts
  // if this is not set, no blog is created.
  BLOG_DIR: 'news',

  // append these modules after the app loaded and only if javascript is enabled.
  // can be used to add features that won't do anything without js anyways.
  HOIST: ['LightSwitch', 'NoSpy'],

  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files
  CLIENT_LIB_NAME: 'magic',

  // show babel debug information
  BABEL: {
    BABEL_DEBUG: true,
  },

  // this is set to be able to test broken link behaviour.
  // DO NOT ENABLE IN YOUR APP (unless you need to because reasons...)
  NO_CHECK_LINKS_EXIT: true,

  // tags written to the html before the #magic container
  PREPEND_TAGS: [{ name: 'div', props: { id: 'PREPENDTag' } }],

  // tags written to the html after the #magic container
  APPEND_TAGS: [{ name: 'div', props: { id: 'APPENDTag' } }],

  // script files, embedded before the magic.js script
  PREPEND_SCRIPTS: ['/prependScript.js'],

  // script files, embedded after the magic.js script
  APPEND_SCRIPTS: ['/appendScript.js'],

  // js files that get written directly into the magic.js script, before the magic code.
  PREPEND_JS: ['/prependJs.js'],

  // js files that get written directly into the magic.js script, after the magic code.
  APPEND_JS: ['/appendJs.js'],

  // css written into the magic.css file, before the magic css
  // use this to set defaults that get overwritten by the generated app css
  PREPEND_CSS: ['/prependCss.css'],

  // css written into the magic.css file, after the magic css
  // use this to overwrite the generated app css
  APPEND_CSS: ['/appendCss.css'],

  // add additional static file directories that will get added to app.static[name]
  ADD_STATIC: ['node_modules/dir/name/'],

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,
}
`),

  p(
    Link({
      text: 'Menu.mjs on github',
      to: 'https://github.com/magic/core/blob/master/src/modules/Menu.mjs',
    }),
  ),
]
