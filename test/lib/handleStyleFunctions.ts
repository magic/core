import { handleStyleFunctions } from '../../src/lib/handleStyleFunctions.mjs'

export default [
  {
    fn: handleStyleFunctions({ color: 'red' }),
    expect: { color: 'red' },
    info: 'handleStyleFunctions returns objects unchanged',
  },
  {
    fn: handleStyleFunctions('string'),
    expect: 'string',
    info: 'handleStyleFunctions returns strings unchanged',
  },
  {
    fn: handleStyleFunctions(undefined),
    expect: undefined,
    info: 'handleStyleFunctions returns undefined unchanged',
  },
  {
    fn: handleStyleFunctions(() => ({ color: 'red' })),
    expect: { color: 'red' },
    info: 'handleStyleFunctions calls function with empty vars',
  },
  {
    fn: handleStyleFunctions((vars: { [key: string]: unknown }) => vars.color, {
      THEME_VARS: { color: 'blue' },
    }),
    expect: 'blue',
    info: 'handleStyleFunctions calls function with THEME_VARS',
  },
  {
    fn: handleStyleFunctions((vars: { [key: string]: unknown }) => vars, {
      THEME_VARS: { key: 'value' },
    }),
    expect: { key: 'value' },
    info: 'handleStyleFunctions passes THEME_VARS to function',
  },
]
