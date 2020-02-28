---
@state {
  "title": "@magic-modules",
  "description": "@magic-modules documentation."
}
---

# ${state.title}

<h2 id='preinstalled'>preinstalled</h2>

magic has some preinstalled modules that will be used in most pages.

<h2 id='app'>app</h2>

this is the main app module.
it has magically inherited properties and all of it is customizable.

to add actions/state/style to the app you can just create an /assets/app.mjs file.
the contents of this file get
[deep .merged](https://github.com/magic/deep)
into the app

<Pre>
// /assets/app.mjs
export const state = {
  merge: 'gets merged into state',
}
export const actions = {
  mergedActions: state => ({ ...state, merge: 'merged action executed' }),
}
</Pre>

<h2 id='menu'>menu</h2>

the Menu module provides... menus.

<Pre>
export const View = state => {
  const items = [
    { to: '/example-page', text: 'example page' },
    { to: 'https://example.com', text: 'example.com' },
    { to: 'https://example.com', nofollow: true, noreferrer: true, target: 'utopia', text: 'nofollow and noref" },
  ]

  return Menu({ items, collapse: false })
}

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
}
</Pre>

<h3 id='menu-props'>Menu props</h3>

the Menu module allows multiple props to be passed when instantiating the Menu

<h3 id='menu-props-collapse'>props.collapse</h3>

by default, the menu will only show submenu items if their parent link is active.
to force submenu items to show at all times, just pass a collapse: false prop

<Pre>
Menu({
  // if false, menu will always show all submenu items
  collapse: false, // (default: true)
})
</Pre>

<h3 id='menu-item-props'>Menu.Item props</h3>

every MenuItem accepts props the same props as a link does.
additionally a MenuItem accepts a items prop with sub menu items.

<Pre>
const menuItem = ({
  to: '/url',
  text: 'link text',
  items: [MenuItems],
  noreferrer: true, // set rel='noreferrer'
  nofollow: true, // set rel='nofollow'
})
</Pre>

<h3 id='menu-sub-menus'>sub menus</h3>

to define a submenu, simply define a .items array on the menu item

<Pre>
// assets/app.mjs
export default {
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
  // ... rest of app.mjs
}
</Pre>

<h2 id='link'>link</h2>

the link module allows you to link to things.

<Pre>
// in any page or module View
export default () => [
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
]
</Pre>

<h2 id='img'>img</h2>

the img module adds some sane default values to your images.

<Pre>
// in any page or module View
export default () => [
  Img('/image.png'),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png }),
  // output: <img src="/image.png" alt="" role="presentation"/>
  Img({ src: '/image.png', alt: 'image description' }),
  // output: <img src="/image.png" alt="image description" />
  Img({ src: '/image.png', title: 'image title', }),
  // output: <img src="/image.png" title="image title" alt="image title"/>
  Img({ src: '/image.png', title: 'image title', alt: 'image alt' }),
  // output: <img src="/image.png" title="image title" alt="image alt"/>
]
</Pre>

<h2 id='footer'>footer</h2>

the footer module contains a small info text and a link to the magic github repository.

to overwrite this behaviour, just place a Footer.mjs file in your assets and require it in /assets/index.mjs.

<Pre>
// /assets/Footer.mjs:
const Footer = () =>
footer({ class: 'main' }, [
  div({ class: 'wrapper' }, [
    'made with a few bits of ',
    Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
  ]),
])

Footer.style: {
  'footer.main': {
    position: 'relative',
    textAlign: 'center',
    padding: '5em 0 .5em',
  },
}

export default Footer
</Pre>
