import { addEmbeddedCss } from '../../src/lib/addEmbeddedCss.mjs'

const file = 'styles.css'

export default [
  {
    fn: () => {
      globalThis.app = { static: { [file]: { toString: () => 'body {}' } } }
      return addEmbeddedCss(file)
    },
    expect: 'body {}',
    info: 'addEmbeddedCss returns css content',
  },
  {
    fn: () => {
      globalThis.app = { static: { [file]: '' } }
      try {
        addEmbeddedCss(file)
        return false
      } catch (e) {
        return e instanceof Error
      }
    },
    expect: true,
    info: 'addEmbeddedCss throws for empty content',
  },
]
