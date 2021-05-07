export const View = state => [
  h2('Test page'),

  p('This page shows various features and tests of magic functionality'),

  h3('Link Tests:'),

  ul([
    li(Link({ to: '/modules/' })),
    li(Link({ to: '/modules/#gl-magic-modules' })),
    li(Link({ to: 'https://magic.github.io' })),
  ]),

  h3('Broken link tests:'),

  p("the following links are broken, and it's intentional for magic to warn us on every rebuild."),

  ul([
    li(Link({ text: 'redirect link', to: 'https://magic.github.io/core' })),

    li(Link({ text: 'broken link', to: 'https://expect-error' })),
    li(
      Link({
        text: '404 link',
        to: 'https://en.wikipedia.org/hMdYfVaKY4btraQcgD0me6RRBDnugbpJ4FLpgJgeB7',
      }),
    ),
    li(Img({ alt: 'Broken Image Link', src: 'https://broken-image-link' })),
  ]),

  h3('Image test'),

  p("while at it, let's test an image, 2 times with a working src:"),

  ul([
    li(Img({ alt: 'Magic Logo', src: '/logo.png' })),
    li(Img({ alt: 'Magic Logo', src: '/core/logo.png' })),
  ]),

  p('and once with a broken src:'),

  Img({ alt: 'Broken Magic Logo', src: '/logo23-broken.png' }),

  h3('Prepending and Appending css files'),

  div(
    { id: 'PrependCss' },
    'If this text is green, additional css files can be loaded BEFORE magic.css using the config.PREPEND_CSS array',
  ),

  div(
    { id: 'AppendCss' },
    'If this text is green, additional css files can be loaded AFTER magic.css using the config.APPEND_CSS array',
  ),

  Pre(`
// /magic.js

export default {
  // ...otherConfig,
  PREPEND_CSS: ['prependCss.css'], // points to src/assets/static/prependCss.css
  APPEND_CSS: ['appendCss.css'], // points to src/assets/static/appendCss.css
}
`),

  p(Link({ to: '/', text: 'Link in a paragraph' })),
]
