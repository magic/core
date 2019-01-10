module.exports = {
  state: {
    title: '@magic-modules',
    description: '@magic-modules documentation.',
  },

  View: state => [
    DocHeader,

    h1(state.title),
    p('magic modules are predefined modules for webapps.'),

    h2('preinstalled magic modules'),
    p('magic has some preinstalled modules that will be used in most pages.'),

    h2('app'),
    p(
      'this is the main app module. it has magically inherited properties and all of it is customizable.',
    ),
    p(
      'to add actions/state/style to the app you can just create an /asset/app.js file. The contents of this file get deep.merged into the app',
    ),
    Pre.View(`
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

    h2('menu'),
    p('the Menu module provides... menus.'),
    p(
      'just pass it a string which is the state key of the menu, add that menu to the /assets/app.js file.',
    ),
    Pre.View(`
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
    Pre.View(`
module.exports = () => Menu.View({ name: 'menuName' })

// outputs:
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

    h2('link'),
    p('the link allows you to link to things.'),
    Pre.View(`
// in any page or module View
module.exports = () => [
  Link({ to: '/page', text: 'page' }),
  // outputs <a href="/page" onclick="actions.go">page</a>
  Link({ to: 'https://example.com', text: 'page' }),
  // outputs <a href="https://example.com" target="_blank" rel="noopener">page</a>
  Link({ to: '/page', text: 'page', nofollow: true, noreferrer: true }),
  // outputs <a href="https://example.com" target="_blank" rel="nofollow noreferrer noopener">page</a>

  // you can also use children instead of the text prop:
  Link({ to: '/' }, 'home')
`),

    h2('footer'),
    p('the footer module contains an info message about using magic.'),
    p(
      'to overwrite this behaviour, just place a Footer.js file in your assets and require it in /assets/index.js',
    ),
    Pre.View(`
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
        Link({ href: 'https://github.com/magic/core0', target: '_blank', rel: 'noopener' }, 'magic'),
      ]),
    ]),
}

// /assets/indexjs
module.exports = {
  // ...other assets
  Footer: require('./Footer'),
}
`),

    h2('list of installable magic modules'),
    ul([li([Link({ to: 'https://github.com/magic-modules/pre' }, '@magic-modules/pre')])]),
  ],
}
