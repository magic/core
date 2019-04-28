module.exports = {
  state: {
    title: '@magic/core concepts',
    description: '@magic/core conceptual information.',
  },

  View: state => {
    const example = {
      state: `
// state variables can be anything you can JSON.stringify()
state: {
  variable: true,
  args: 'none',
}`,
      actions: `
// actions are an object containing functions.
// if an action returns an object, this object gets merged into the state
actions: {
  changeVariable: args => state => ({
    variable: !state.variable,
    args,
  }),
  callActionInAction: () => async (state, actions) => {
    // just await something inside an action to create an async action
    await new Promise(resolve => {
      setTimeout(resolve, 200)
    })

    // actions can call other actions
    actions.changeVariable('arg passed to function')
  },
}`,
      global: `
global: {
  state: {
    variable: true,
    args: true,
  },
  actions: {
    callActionInAction: true,
    changeVariable: true,
  },
}`,
      view: `
View: (state, actions) => (
  div({ onclick: actions.callActionInAction }, state.variable)
)`,
      style: `
style: {
  '.className': {
    color: 'green',

    // expands to .className:hover because of the &
    '&:hover': {
      color: 'orange',
    },

    // expands to .className .childClass
    '.childClass': {
      color: 'blue',
    },
  },
  // css ids
  '#id': {
    color: 'yellow',
  },
  // default html tag styles
  div: {
    color: 'black',
  },
}`,

      server: `
server: (req, res) => {
  const { name } = req.body
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end(\`hello, \${name}\`)
}`,

      complexServer: `
server: {
  index: (req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('index route')
  },
  route: (req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('api route')
  },
}`,
      lib: `
lib: {
  local: require.resolve('./lib/local.js'),
  npm: 'npm-lib',
}`,
    }

    const indent = str =>
      str
        .split('\n')
        .map(s => `  ${s}`)
        .join('\n')

    const combined = `
const exampleModule = {
  ${indent(example.state)},
  ${indent(example.actions)},
  ${indent(example.style)},
  ${indent(example.view)},
  ${indent(example.global)},
  ${indent(example.lib)},
  ${indent(example.server)},
}`

    return [
      h1(state.title),
      p('magic concepts. These are the building blocks of every module in a magic app'),

      div([h2({ id: 'philosophy' }, 'philosophy')]),

      div([
        h2({ id: 'modules' }, 'modules'),

        p('modules are the main building block of magic.'),
        p(
          'modules can include state, actions, style and multiple components (which we call Views).',
        ),
        p(
          'View names have to start with an uppercased character. Every module can export multiple components that share state, actions and styles.',
        ),
      ]),

      div([
        h2({ id: 'state' }, 'state'),
        div([
          p('state is a javascript object.'),
          p('state can be mutated by actions.'),
          p('every rendering step, the state determines the output of the view'),

          h3({ id: 'state-example' }, 'state example'),
          Pre.View(example.state),
        ]),
      ]),

      div([
        h2({ id: 'actions' }, 'actions'),
        p('actions are an object containing functions'),
        p('those functions get the state and actions and may return a new partial state.'),
        p('alternatively, you can call any action from within any other action.'),

        h3({ id: 'actions-example' }, 'actions example'),
        Pre.View(example.actions),
      ]),

      div([
        h2({ id: 'views' }, 'views'),
        p('views render the state to html'),
        p(
          'whenever an action triggers a statechange, this statechange then triggers a view change.',
        ),

        h3({ id: 'views-example' }, 'views example'),
        Pre.View(example.view),
      ]),

      div([
        h2({ id: 'styles' }, 'styles'),
        p('every module can have a style object attached to it.'),
        p('magic will automagically merge all styles into one global css file.'),
        p('in the future, it will also remove unused styles for you.'),

        p('style merge order from lowest to highest:'),
        p('module.style < page.style < app.style < theme.style'),

        h3({ id: 'styles-example' }, 'example styles'),
        Pre.View(example.style),

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

        h3({ id: 'globals-example' }, 'global example'),
        Pre.View(example.global),
      ]),

      div([
        h2({ id: 'lambdas' }, 'server lambdas'),
        p('this is the serverside magic.'),
        p('you can define functions that will turn into serverside lambdas.'),
        p('server side lambdas will be available for POST requests.'),
        p(
          'the server side function signature is (req, res) => {}, as in any nodejs http server, with the addition of req.body being set.',
        ),

        h3({ id: 'lambdas-example' }, 'single lambda'),
        Pre.View(example.server),

        h3({ id: 'lambdas-example-multi' }, 'multiple lambdas'),
        Pre.View(example.complexServer),
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
          ' to achieve this, one can simply create /assets/lib.js and export a object from it.',
          ' the keys of the object are the function name, the values are the paths to the lib.js file',
        ]),
        Pre.View(`
// /assets/lib.js or /assets/lib/index.js
module.exports = {
  local: require.resolve('./local.js'),
  npm: 'npm-lib',
}`),
        h3({ id: 'libs-example-file' }, 'example lib file'),
        Pre.View(`
// /assets/lib/local.js
module.exports = name => \`hello, \${name}\`
`),

        h3({ id: 'libs-app' }, 'app.lib'),
        Pre.View(`
// /assets/app.js
module.exports = {
  // ... other app props
  lib: {
    local: require.resolve('./lib'),
    npm: 'npm-lib',
  },
}
`),
        h3({ id: 'libs-module' }, 'module.lib'),
        p('any page or module can export a lib key'),

        Pre.View(`
// /pages/page.js
// /assets/Module.js

module.exports = {
  // ... other component / page properties and views\
  ${indent(example.lib)}
},
View: () => div(LIB.local('name')),
}

// renders
<div>hello, name</div>`),
      ]),

      div([
        h2({ id: 'full-example' }, 'Full example'),
        p('If we assemble those pieces, we get the following:'),
        Pre.View(combined),
      ]),
    ]
  },
}
