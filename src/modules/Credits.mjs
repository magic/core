export const View = () =>
  div({ class: 'Credits' }, [
    'made with a few bits of ',
    Link({ to: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
  ])

export const style = vars => ({
  clear: 'both',
  display: 'block',
  margin: '2em 0 1em',

  a: {
    color: vars.text && vars.text.dark || '#212121',
    textDecoration: 'underline',

    '&:hover': {
      color: vars.neutral || '#c4c4c4',
    },
  },
})
