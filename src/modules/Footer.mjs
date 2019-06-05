export const View = (_, children = []) =>
  footer({ class: 'Footer' }, [
    div({ class: 'Container' }, [
      children,
      'made with a few bits of ',
      Link({ to: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
    ]),
  ])

export const style = {
  '.Footer': {
    position: 'relative',
    textAlign: 'center',
    padding: '2em 0 .5em',
  },
}
