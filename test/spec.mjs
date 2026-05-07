import { version } from '@magic/test'

import * as lib from '../src/index.mjs'

const rawColorObject = {
  50: 'str',
  100: 'str',
  200: 'str',
  300: 'str',
  400: 'str',
  500: 'str',
  600: 'str',
  700: 'str',
  800: 'str',
  900: 'str',
}

const colorObject = ['obj', rawColorObject]

const colorObjectWithA = [
  'obj',
  {
    ...rawColorObject,
    A100: 'str',
    A200: 'str',
    A400: 'str',
    A700: 'str',
  },
]

const spec = {
  renderToString: 'fn',
  reset: 'fn',
  replaceSlashSlash: 'fn',
  colors: [
    'object',
    {
      red: colorObjectWithA,
      pink: colorObjectWithA,
      purple: colorObjectWithA,
      deeppurple: colorObjectWithA,
      indigo: colorObjectWithA,
      blue: colorObjectWithA,
      lightblue: colorObjectWithA,
      cyan: colorObjectWithA,
      teal: colorObjectWithA,
      green: colorObjectWithA,
      lightgreen: colorObjectWithA,
      lime: colorObjectWithA,
      yellow: colorObjectWithA,
      amber: colorObjectWithA,
      orange: colorObjectWithA,
      deeporange: colorObjectWithA,
      brown: colorObject,
      gray: colorObject,
      bluegray: colorObject,
      grey: colorObject,
      bluegrey: colorObject,

      black: 'str',
      white: 'str',
    },
  ],
}

export default version(lib, spec)
