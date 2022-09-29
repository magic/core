import { is } from '@magic/test'
import { moduleViewToString } from '../../../src/lib/swc/moduleViewToString.mjs'

const pkg = `moduleViewToString`

const arrowFnModule = a => a
const fnModule = function named() {}

const objectArrowFunctionModule = {
  View: () => {},
}

const objectFunctionModule = {
  View() {},
}

export default [
  { fn: moduleViewToString(arrowFnModule), expect: is.string, info: `${pkg} returns a string` },
  { fn: moduleViewToString(undefined), expect: undefined, info: `${pkg} returns a string` },
  {
    fn: moduleViewToString(arrowFnModule),
    expect: arrowFnModule.toString(),
    info: `${pkg} arrow function returns a correctly stringified function`,
  },
  {
    fn: moduleViewToString(fnModule),
    expect: fnModule.toString(),
    info: `${pkg} function returns a correctly stringified function`,
  },
  {
    fn: moduleViewToString(objectArrowFunctionModule),
    expect: objectArrowFunctionModule.View.toString(),
    info: `${pkg} object arrow function returns a correctly stringified function`,
  },
  {
    fn: moduleViewToString(objectFunctionModule),
    expect: objectFunctionModule.View.toString(),
    info: `${pkg} object function returns a correctly stringified function`,
  },
]
