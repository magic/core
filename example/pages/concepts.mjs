export const state = {
  title: '@magic/core concepts',
  description: '@magic/core conceptual information.',
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

  div([
    h2({ id: 'state' }, 'state'),
    div([
      p('state is a javascript object.'),
      p('state can be mutated by actions or effects.'),
      p('every rendering step, the state determines the output of the view'),
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
    p('alternatively, you can call any action from within any other action.'),
  ]),

  div([
    h2({ id: 'views' }, 'views'),
    p('views render the state to html'),
    p('whenever an action triggers a statechange, this statechange then triggers a view change.'),
  ]),

  div([
    h2({ id: 'styles' }, 'styles'),
    p('every module can have a style object attached to it.'),
    p('magic will automagically merge all styles into one global css file.'),
    p('in the future, it will also remove unused styles for you.'),

    p('style merge order from lowest to highest:'),
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
      'every key in the mod.global object that is set to true gets merged into the main app state/actions.',
    ),
  ]),

  div([
    h2({ id: 'lambdas' }, 'server lambdas'),
    p('this is the serverside magic.'),
    p('you can define functions that get transpiled into serverside lambdas.'),
    p('server side lambdas will be available for GET and POST requests.'),
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
      'as the sarcastic remark might demonstrate, we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.',
    ),
    p([
      'magic has one external client side dependency, ',
      Link({ to: 'https://github.com/jorgebucharan/hyperapp' }, 'hyperapp'),
      ", [~400 lines that provide our ui state machine]. thats it. and it won't change.",
    ]),
    p('anyways, rant over. if you really need to use external packages, there is a way.'),

    p([
      'once there is a lib key in at least one component,',
      ' window.LIB (browser) and global.LIB (nodejs) will be set,',
      ' aliasing LIB as a global variable in both environments',
    ]),

    h3({ id: 'libs-dir-or-file' }, 'lib dir or file'),
    p([
      'if you need libraries in internally developed modules,',
      ' it might be easier to keep your library dependencies in a central place.',
      ' to achieve this, one can simply create /assets/lib.js and export an object from it.',
      ' the keys of the object are the function name, the values are the paths to the lib.js file.',
      ' to make sure resolution works, require.resolve has to be used for local libs.',
    ]),
  ]),
]
