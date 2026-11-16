/**
 * @param {Record<string, unknown>} _state
 * @param {unknown[]} [children]
 */
export const View = (_state, children = []) =>
  footer({ class: 'Footer' }, [div({ class: 'Container' }, [Credits(), children])])

export const style = {
  position: 'relative',
  padding: '2em 0 .5em',

  '.Container': {
    textAlign: 'center',
  },
}
