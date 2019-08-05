export const state = {
  title: '@magic-modules/propTypes',
  description: '@magic-modules/propTypes documentation.',
}

export const View = state => [
  h1(state.title),

  h2({ id: 'check-props' }, 'CHECK_PROPS'),
  p('@magic-modules can export a .propTypes object with an array of prop types.'),

  h4({ to: '#example' }, 'example'),
  Pre(`
export const View = (prop1, prop2, prop3) => [
  p(prop1),
  p(prop2),
  p(prop3),
]

export const propTypes = [
  { name: 'prop1', type: 'string' },
  { name: 'prop2', type: 'number' },
  { name: 'prop3', type: 'array', items: 'string' },
  {
    name: 'prop4',
    type: 'object',
    items: [
      { name: 'prop4prop1', type: 'string' },
      { name: 'prop4prop2', type: 'number' },
  ] },
]
`),

  LightSwitch(state),
]
