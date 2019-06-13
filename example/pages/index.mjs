export const state = {
  title: '@magic/core docs',
  description: [
    '@magic/core documentation.',
    'tells you why, how and when to use @magic.',
    'also provides an overview of all @magic functionality this ecosystem provides.',
  ],
}

export const View = state => [
  h1(state.title),
  div([
    h2('welcome to the magic docs.'),
    p('the goal of this document is to give you a rough @magical overview.'),

    GitBadges('magic/core'),

    h2({ id: 'philosophy' }, 'philosophy'),

    p([
      '@magic aims to make it easy to stitch together any kind of webapp.',
      ' by providing simple, well documented and self contained modules,',
      ' @magic makes it possible to create stunningly fast',
      ' webpages with minimal cognitive overhead.',
    ]),

    h2({ id: 'privacy' }, 'privacy'),
    p('@magic does not spy.'),
    p([
      'not only do we try to be legally compliant by default,',
      ' but we also aim to be ethical',
      ' which means prioritizing your rights over our needs,',
      ' but also means we prioritize the rights of your users over your needs.',
      ' we believe that this is the best compromise.',
    ]),

    h2({ id: 'buzzwords' }, 'why should i use magic?'),

    h3('features'),
    ul([
      li('static html pages with opengraph seo.'),
      li('pages are hosted for free using gitlab, github or any other git-pages style hosting.'),
      li('static css output with selector and rule deduplication.'),
      li('no javascript required where possible.'),
      li('minimal client boilerplate.'),
      li('no spyware included.'),
      li('WIP: lambda faas and graphql api generator.'),
      li('WIP: server side rendering (if needed).'),
    ]),

    h3('@magic is tiny'),
    p([
      '~4 kb javascript boilerplate.',
      ' usually, all the javascript in your homepage will be 30-60kb big (after unpacking),',
      ' 10-30kb get transmitted from the server to the client.',
      ' this documentation page you are reading loads about 15kb of javascript,',
      ' which, when parsing, turns into 40kb of uncompressed javascript.',
    ]),

    h3('@magic works without javascript'),
    p([
      'most of the functionality works without javascript,',
      " some buttons and realtime user interactions obviously won't,",
      ' but @magic always tries to provide a non-javascript fallback via css.',
    ]),

    h3('@magic generates static pages'),
    p(['this makes free hosting (using github or gitlab pages) possible.', " and it's easy."]),

    p([
      '@magic publishes to ',
      Link({ to: 'https://github.com' }, 'github'),
      ', ',
      Link({ to: 'https://gitlab.com' }, 'gitlab'),
      ' and any other git-pages enabled hosting service.',
    ]),

    h3('serverless / faas'),
    p([
      'automagically generates ',
      ' serverless lambdas, derived from the ',
      Link({ to: 'https://github.com/magic-modules/' }, '@magic-modules'),
      ' you use in your pages.',
      ' this makes visitor statistics, user authentication and authorization,',
      ' chat, and all other server side services possible.',
    ]),
  ]),

  LightSwitch(state),
]
