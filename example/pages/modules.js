module.exports = {
  state: {
    title: '@magic-modules',
    description: '@magic-modules documentation.',
  },

  View: state => [
    h1(state.title),
    p('magic modules are predefined modules for webapps.'),

    h2({ id: 'definition' }, 'module definition:'),
    p('the minimal module is a function that returns some html.'),
    Pre(`
// /assets/ModuleName.js

// simplest module
module.exports = () => div('hello, world')

// complete signature
module.exports = (props, children) => (state, actions) => div('hello, world')
`),

    h2({ id: 'usage' }, 'usage'),
    p('to use a module in your app it has to be imported using /assets/index.js. '),
    Pre(`
// /assets/index.js
module.exports = {
  // ...otherModules

  // load module from /assets/Mod.js
  Mod: require('./Mod'),

  // load module from node_modules
  NpmModule: require('@magic-modules/npm-module'),
}`),
    p(
      'after this, the module will be a global in your app and can be used like any other component.',
    ),

    Pre(`
// any page or module
module.exports = () => div([
  'modules that do not need props can be used without calling them as a function ',
  Mod.View,
  'modules that need props: ',
  Mod.View(propObject),
`),

    h2({ id: 'custom-module' }, 'Mod.View and Mod.Component:'),

    Mod.View,

    Mod.Component({ title: 'Mod Component Title, passed via props' }),

    h3('Mod sourcecode:'),

    Pre(`const Mod = {
  View: state =>
    div({ class: 'Mod View' }, [
      h3('Mod.View'),
      p([
        'this is Mod.View. it gets loaded from ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/Mod.js' }, '/assets/Mod.js'),
      ]),
      p([
        'and imported in ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/index.js' }, '/assets/index.js'),
      ]),
      p(['the state of this module: ', JSON.stringify(state.module)]),
    ]),

  Component: () =>
    div({ class: 'Mod Component' }, [
      h3('Mod.Component'),
      p([
        'Mod.Component, a second component in ',
        Link({ to: 'https://github.com/magic/core/blob/master/example/assets/Mod.js' }, '/assets/Mod.js'),
      ]),
    ]),

  state: {
    module: {
      test: 'testing',
    },
  },

  style: {
    '.Mod': {
      margin: '0 0 1em',
      padding: '0.5em',
      border: '1px solid',

      h3: {
        margin: 0,
      },

      '&.View': {
        borderColor: 'green',
      },
      '&.Component': {
        borderColor: 'red',
      },
    },
  },

  global: {
    state: {
      module: true,
    },
  },
}

module.exports = Mod`),

    h2({ id: 'check-props' }, 'check props'),
    p('@magic-modules can export a .props key with an array of prop types.'),
    p('more docs coming soon'),

    h2({ id: 'preinstalled' }, 'preinstalled magic modules'),
    p('magic has some preinstalled modules that will be used in most pages.'),

    h2({ id: 'app' }, 'app'),
    p(
      'this is the main app module. it has magically inherited properties and all of it is customizable.',
    ),
    p([
      'to add actions/state/style to the app you can just create an /assets/app.js file.',
      'the contents of this file get ',
      Link({ to: 'https://github.com/magic/deep', text: 'deep .merged' }),
      ' into the app',
    ]),
    Pre(`
// /assets/app.js
module.exports = {
  state: {
    merge: 'gets merged into state',
  },
  actions: {
    mergedActions: () => ({ merge: 'merged action executed' }),
  },
  style: {
    body: {
      backgroundColor: 'white',
    },
  },
}
`),

    h2({ id: 'menu' }, 'menu'),
    p('the Menu module provides... menus.'),
    p([
      'just pass it a string which is the state key of the menu,',
      ' then add that menu to the /assets/app.js file.',
    ]),
    p([
      'by default, the menu will only show submenu items if their parent link is active.',
      ' to force submenu items to show at all times, just pass a collapse: false prop',
    ]),
    Pre(`
// assets/app.js
module.exports = {
  state: {
    // ...state
    menuName: [
      { to: '/example-page', text: 'example page' },
      { to: 'https://example.com', text: 'example.com' },
      { to: 'https://example.com', nofollow: true, noreferrer: true, target: 'utopia', text: 'nofollow and noref" },
    ],
  },
  // ... rest of app.js
}`),

    p('then, in a page or module'),
    Pre(`
module.exports = () => Menu.View({ name: 'menuName', collapse: false })

// output:
<nav class="Menu">
  <ul>
    <li>
      <a onclick="actions.go" href="{{ WEB_ROOT }}example-page">example page</a>
    </li>
    <li>
      <a href="https://example.com" target="_blank" rel="noopener">example.com</a>
    </li>
    <li>
      <a href="https://example.com" target="utopia" rel="noopener nofollow noreferrer">nofollow and noref</a>
    </li>
  </ul>
</nav>
}`),

    h3({ id: 'menu-props' }, 'Menu props'),
    p('the Menu module allows multiple props to be passed when instantiating the Menu'),

    Pre(`
Menu({
  collapse: false, // (default: true) menu will always show all submenu items
})`),

    h3({ id: 'menu-item-props' }, 'Menu.Item props'),
    p([
      'every MenuItem accepts props the same props as a link does.',
      ' additionally a MenuItem accepts a items prop with sub menu items.',
    ]),

    Pre(`
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [SubMenuItems],
  noreferrer: true, // set rel='noreferer'
  nofollow: true, // set rel='nofollow'
})`),

    h3({ id: 'menu-sub-menus' }, 'sub menus'),
    p('to define a submenu, simply define a .items array on the menu item'),
    Pre(`
// assets/app.js
module.exports = {
  state: {
    // ...state
    menuName: [
      {
        to: '/example-page',
        text: 'example page',
        items: [
          { to: '/example-page/#sub', text: 'example sub page' },
      ] },
    ],
  },
  // ... rest of app.js
}`),

    h2({ id: 'link' }, 'link'),
    p('the link module allows you to link to things.'),
    Pre(`
// in any page or module View
module.exports = () => [
  Link({ to: '/page', text: 'page' }),
  // output: <a href="/page" onclick="actions.go">page</a>
  Link({ to: 'https://example.com', text: 'page' }),
  // output: <a href="https://example.com" target="_blank" rel="noopener">page</a>
  Link({ to: '/page', text: 'page', nofollow: true, noreferrer: true }),
  // output: <a href="https://example.com" target="_blank" rel="nofollow noreferrer noopener">page</a>

  // you can also use children syntax instead of the text prop:
  Link({ to: '/' }, 'home'),

  // Link also supports # hash links
  Link({ to: '/#hash' }, 'home with hash'),
]`),

    h2({ id: 'img' }, 'img'),
    p('the img module adds some sane default values to your images.'),
    Pre(`
// in any page or module View
module.exports = () => [
  Img('/image.png'),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png }),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png', alt: 'image description' }),
  // output: <img src="/image.png alt="image description" />
  Img({ src: '/image.png', title: 'image title', }),
  // output: <img src="/image.png" title="image title" alt="image title"/>
  Img({ src: '/image.png', title: 'image title', alt: 'image alt' }),
  // output: <img src="/image.png" title="image title" alt="image alt"/>
]`),

    h2({ id: 'footer' }, 'footer'),
    p('the footer module contains a small info text and a link to the magic github repository.'),
    p(
      'to overwrite this behaviour, just place a Footer.js file in your assets and require it in /assets/index.js.',
    ),
    Pre(`
// /assets/Footer.js:
const Footer = {
  style: {
    'footer.main': {
      position: 'relative',
      textAlign: 'center',
      padding: '5em 0 .5em',
    },
  },
  View: () =>
    footer({ class: 'main' }, [
      div({ class: 'wrapper' }, [
        'made with a few bits of ',
        Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
      ]),
    ]),
}

// /assets/index.js
module.exports = {
  // ...other assets
  Footer: require('./Footer'),
}
`),

    ModuleList,
  ],
}
