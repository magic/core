import { handlePageDependencyStyles } from '../../src/lib/handlePageDependencyStyles.mjs'

export default [
  {
    fn: handlePageDependencyStyles({}),
    expect: {},
    info: 'handlePageDependencyStyles returns empty object for empty input',
  },
  {
    fn: handlePageDependencyStyles([]),
    expect: [],
    info: 'handlePageDependencyStyles returns empty array for empty array input',
  },
  {
    fn: handlePageDependencyStyles([{ Module: { style: { color: 'red' } } }]),
    expect: [{ '.Module': { color: 'red' } }],
    info: 'handlePageDependencyStyles wraps style in class selector for array input',
  },
  {
    fn: handlePageDependencyStyles({ Module: { style: { color: 'red' } } }),
    expect: { '.Module': { color: 'red' } },
    info: 'handlePageDependencyStyles wraps object style in class selector',
  },
  {
    fn: handlePageDependencyStyles({ Module: { style: { '.Module': { color: 'red' } } } }),
    expect: { '.Module': { color: 'red' } },
    info: 'handlePageDependencyStyles keeps existing class selector',
  },
  {
    fn: handlePageDependencyStyles({
      Module: {
        style: { color: 'red' },
        dependencies: { SubModule: { style: { color: 'blue' } } },
      },
    }),
    expect: { '.Module': { color: 'red' }, '.SubModule': { color: 'blue' } },
    info: 'handlePageDependencyStyles merges dependency styles',
  },
]
