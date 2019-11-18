export const state = {
  title: '@magic/core concepts',
  description: [
    '@magic/core conceptual information.',
    'explains the main concepts that make the @magic work.',
  ],
}

export const View = state => [
  h1(state.title),
  p('magic concepts. These are the building blocks of every module in a magic app'),

  div([
    h2({ id: 'modules' }, '@magic-modules'),

    p('modules are the main building block of magic.'),

    p([
      'a page is a module, a button is a module, a link is a module, an image is a module.',
      ' a @magic app contains modules containing modules that contain modules.',
      ' this can lead to inception.',
    ]),
  ]),

  h2('module building blocks'),

  div([
    h2({ id: 'state' }, 'state'),
    div([
      p('state is a javascript object.'),
      p('state can be mutated by actions or effects.'),
      p('every rendering step, the state determines the output of the views'),
    ]),
  ]),

  div([
    h2({ id: 'actions' }, 'actions'),
    p('actions are an object containing functions'),
    p(
      'those functions get the state and their props and may return a new full, but changed, state.',
    ),
  ]),

  div([
    h2({ id: 'effects' }, 'effects'),
    p('effects are an object containing functions, just like actions.'),
    p(
      'they behave like actions, get a state and props and may return a new full, but changed, state.',
    ),
    p([
      'the big difference? ',
      'effects may be impure and trigger sideeffects outside of hyperapp.',
    ]),
  ]),

  div([
    h2({ id: 'views' }, 'views'),
    p('views render the state to html'),
    p('whenever an action triggers a change in the state, this then triggers a view change.'),
  ]),

  div([
    h2({ id: 'styles' }, 'styles'),
    p('every module can have a style object attached to it.'),
    p('magic will automagically merge all styles into one global css file.'),
    p('in the future, it will also remove unused styles for you.'),

    p('style merge order from lowest to highest, last overwrites first:'),
    p('module.style < page.style < app.style < theme.style'),

    h3({ id: 'styles-magic-css' }, '@magic/css'),
    p("internally, magic uses it's own css-in-js library."),
    p('to find out more, click the following link:'),
    Link({ to: 'https://magic.github.io/css/' }, '@magic/css'),
  ]),

  div([
    h2({ id: 'globals' }, 'global'),
    p('every module can set a global object, containing state and action properties.'),
    p(
      'every state and/or action name in the global object with a value that equals true gets merged into the main app state/actions.',
    ),
  ]),

  div([
    h2({ id: 'lambdas' }, 'server lambdas'),
    p('this is the serverside magic.'),
    p('you can define functions that get transpiled into serverside lambdas.'),
    p('server side lambdas will be available for GET and/or POST requests.'),
    p([
      'the server side function signature is (req, res) => {},',
      ' as in any nodejs http server, with the addition of req.body being async => awaited before execution of the lambda.',
    ]),
  ]),

  div([
    h2({ id: 'libs' }, 'external libs'),
    p([
      'what would javascript be without the millions of dependencies',
      ' that you can easily install and make the average webpage ',
      ' slow[ly] (pun intended) grow towards a footprint of 5 megabytes.',
    ]),
    p(
      'we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.',
    ),
    p([
      'magic has one external client side dependency, ',
      Link({ to: 'https://github.com/jorgebucharan/hyperapp' }, 'hyperapp'),
      ", [~400 lines that provide our ui state machine]. thats it. and it won't change.",
    ]),
    p([
      'we also have the tendency to write libraries specialized for our usecase, see ',
      Link({ href:'https://github.com/magic/css' }, '@magic/css'), 
      ' ',
      Link({ href: 'https://github.com/magic/test' }, '@magic/test'), 
      ' ',
      Link({ href: 'https://github.com/magic/cli' }, '@magic/cli'),
      ' and others.',
    ]),

    p([
      'once there is a lib key in at least one component,',
      ' window.lib (browser) and global.lib (nodejs) will be set,',
      ' aliasing lib as a global variable in both environments',
    ]),

    h3({ id: 'libs-dir-or-file' }, 'lib dir or file'),
    p([
      'if you need libraries in multiple otherwise independent modules,',
      ' it might be easier to keep your library dependencies in a central place.',
      ' to achieve this, one can simply create /assets/lib.mjs and export an object from it.',
      ' this object will get merged into the globalThis.lib object that is available throughout your app.',
      Pre('export default { name: () => {} }'),
      'will turn into',
      Pre('lib.name = () => {}'),
    ]),
  ]),

  LightSwitch(state),
]
