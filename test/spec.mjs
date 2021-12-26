import { version } from '@magic/test'

import * as lib from '../src/index.mjs'

const colorObject = [
  'obj',
  {
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
    A100: 'str',
    A200: 'str',
    A400: 'str',
    A700: 'str',
  },
]

const spec = {
  renderToString: 'fn',
  reset: 'fn',
  colors: [
    'object',
    {
      red: colorObject,
      pink: colorObject,
      purple: colorObject,
      deeppurple: colorObject,
      indigo: colorObject,
      blue: colorObject,
      lightblue: colorObject,
      cyan: colorObject,
      teal: colorObject,
      green: colorObject,
      lightgreen: colorObject,
      lime: colorObject,
      yellow: colorObject,
      amber: colorObject,
      orange: colorObject,
      deeporange: colorObject,
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
