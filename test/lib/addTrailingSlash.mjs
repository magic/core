import addTrailingSlash from '../../src/lib/addTrailingSlash.mjs'

export default [
  { fn: addTrailingSlash(''), expect: '/', info: 'empty string turns into /' },
  { fn: addTrailingSlash('/test'), expect: '/test/', info: '/ gets appended if missing' },
  { fn: addTrailingSlash('/test/'), expect: '/test/', info: '/ does not get added if exists' },
  { fn: addTrailingSlash('/'), expect: '/', info: '/ does not get added if argument is / already' },
]
