export const state = {
  title: '@magic/core docs',
  description: '@magic/core documentation directory.',
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
    p([
      "@magic does not spy on it's users.",
      ' we not only try to be legally compliant,',
      ' but to be ethical and do the right thing for all users of the web.',
    ]),

    h2({ id: 'buzzwords' }, 'why should i use magic?'),

    h3('@magic is tiny'),
    p([
      '~4 kb javascript boilerplate.',
      ' usually, all the javascript in your homepage will be 30-60kb big (after unpacking),',
      ' 10-30kb get transmitted from the server to the client.',
      ' this complete documentation page you are reading with all sub pages loads about 40kb of unpacked,',
      ' 15kb of gzipped javascript.',
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
