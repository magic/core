module.exports = {
  state: {
    title: '@magic/core docs',
    description: '@magic/core documentation directory.',
  },

  View: state => [
    h1(state.title),
    div([
      h2('Welcome to the magic docs.'),
      p('The goal of this document is to give you a rough @magical overview.'),

      h2('Features'),

      h3('client app'),
      p([
        'magic uses ',
        Link({ to: 'https://github.com/jorgebucaran/hyperapp/' }, 'hyperapp'),
        ' to generate a client side webapp.',
      ]),
      p([
        'since hyperapp is awesomely small, the minimal client bundle size hovers around 3-4kb (gzipped),',
        ' this includes all of magic and greatly dependes on the variety of html elements in use as well as the amount of pages.',
      ]),

      h3('static file hosting:'),
      p([
        'publishes to ',
        Link({ to: 'https://github.com' }, 'github'),
        ', ',
        Link({ to: 'https://gitlab.com' }, 'gitlab'),
        ' and any other git enabled hosting service.',
      ]),

      h3('serverless / faas'),
      p([
        'SOON: automagically generates ',
        Link({ to: 'https://now.sh' }, 'now.sh'),
        ' lambdas, derived from the ',
        Link({ to: 'https://github.com/magic-modules/' }, '@magic-modules'),
        ' you use in your pages.',
        ' this will make visitor statistics, user authentication and authorization, chat, and all other server side goodies possible.',
      ]),
    ]),
  ],
}
