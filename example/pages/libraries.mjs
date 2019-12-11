export const state = {
  title: '@magic/core library docs',
  description: '@magic/core libraries allow you to include client side functionality in your app.',
}

export const View = state => [
  div([
    h1(state.title),
    p(state.description),

    h2({ id: 'abstract' }, 'libraries'),
    p([
      'what would javascript be without the millions of dependencies',
      ' that you can easily install and make the average webpage ',
      ' slow[ly] (pun intended) grow towards a footprint of 5 megabytes.',
    ]),
    p('we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.'),
    p([
      'magic has one external client side dependency, ',
      Link({ to: 'https://github.com/jorgebucharan/hyperapp' }, 'hyperapp'),
      ", [~400 lines that provide our ui state machine]. thats it. and it won't change.",
    ]),
    p([
      'we also have the tendency to write libraries specialized for our usecase, see ',
      Link({ href: 'https://github.com/magic/css' }, '@magic/css'),
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

    h3({ id: 'dir-or-file' }, 'lib dir or file'),
    p([
      'if you need libraries in multiple otherwise independent modules,',
      ' it might be easier to keep your library dependencies in a central place.',
      ' to achieve this, one can simply create /assets/lib.mjs and export an object from it.',
      ' this object will get merged into the globalThis.lib object making it available as "lib" throughout your app.',
    ]),
    p([
      'alternatively, you can create a /assets/modules directory and place UpperCaseNamed.mjs files in there.',
      ' their names will be deferred from the filename and they will be available in your app without importing them.',
      ' if you do not use one of the modules, dead code elimination will simply remove it in production.',
    ]),

    Pre('export default { name: () => {} }'),
    'will turn into',
    Pre('lib.name = () => {}'),

    h3({ id: 'npm' }, '@magic-libraries from npm'),
    p(
      'all @magic-libraries/* and all npm packages starting with magic-library-* will be loaded automatically. ',
    ),

    h4({ id: 'example' }, 'Example'),
    p('first, install a @magic-library'),
    Pre(`
npm install --save --save-exact @magic-libraries/is
`),
    p('then, in javascript'),
    Pre(`
export const View = props => div([
  'value is ',
  lib.is(props.value, 'string') ? '' : 'not',
  ' a string'
])
      `),

    LibraryList(),

    LightSwitch(state),
  ]),
]
