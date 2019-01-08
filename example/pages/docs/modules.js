module.exports = {
  state: {
    title: '@magic-modules',
    description: '@magic-modules docs.',
  },

  Body: state => [
    DocHeader,

    h1(state.title),
    p('magic modules are predefined components for webapps.'),
    h3('preinstalled magic modules'),
    p('magic has some preinstalled modules that will be useful in most pages.'),
    h4('menu'),
    p('the Menu module provides... menus.'),
    p('just pass it a string which is the state key of the menu, add that menu to the /assets/app.js file.'),
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

    h3('link'),
    p('the link allows you to link to things.'),
    Pre.View(`
// in any page or component View
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


    h3('list of installable magic modules'),
    ul([li([Link({ to: 'https://github.com/magic-modules/pre' }, '@magic-modules/pre')])]),
  ],
}
