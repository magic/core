module.exports = {
  state: {
    title: '@magic/core dependencies',
    description: '@magic/core app dependency information.',
  },

  View: () => [
    DocHeader,

    h1('dependencies'),
    p('this is a list of all magic dependencies.'),

    h2('production (client)'),
    p('those dependencies get included into your magic app client bundle.'),
    ul([
      li([
        h4('hyperapp, ~1kb.'),
        Link({ to: 'https://github.com/jorgebucaran/hyperapp' }, 'hyperapp@1.2.9'),
      ]),
    ]),

    h2('production (server)'),
    p([
      'the production server has not been written yet. will generate a couple of ',
      Link({ to: 'https://en.wikipedia.org/wiki/Function_as_a_service' }, 'faas functions'),
      ', derived from the ',
      Link({ to: 'https://github.com/magic-modules' }, '@magic-modules'),
      ' you are using in your bundle, then host your app using ',
      Link({ to: 'https://now.sh' }, 'now.sh'),
    ]),

    h2('development'),
    p('these packages are used in the development server / build process'),
    ul([
      li('@babel/core'),
      li('@babel/plugin-transform-arrow-functions'),
      li('@babel/preset-env'),
      li('@magic/css'),
      li('@magic/deep'),
      li('@magic/log'),
      li('@magic/types'),
      li('babel-plugin-minify-dead-code-elimination'),
      li('babel-plugin-minify-mangle-names'),
      li('hyperapp-render'),
      li('imagemin'),
      li('imagemin-mozjpeg'),
      li('imagemin-pngquant'),
      li('imagemin-gifsicle'),
      li('imagemin-svgo'),
      li('node-zopfli-es'),
    ]),
  ],
}
