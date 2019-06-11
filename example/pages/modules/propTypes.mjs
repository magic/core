export const state = {
  title: '@magic-modules/propTypes',
  description: '@magic-modules/propTypes documentation.',
}

export const View = state => [
  h1(state.title),

  h2({ id: 'check-props' }, 'CHECK_PROPS'),
  p('@magic-modules can export a .propTypes object with an array of prop types.'),
  p('more docs coming soon'),

  LightSwitch(state),
]
