export const View = () =>
  footer({ class: 'Footer' }, [
    div({ class: 'Container' }, [
      'made with a few bits of ',
      Link({ to: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
    ]),
  ])

export const style = {
  '.Footer': {
    position: 'relative',
    textAlign: 'center',
    padding: '5em 0 .5em',
  },
}
