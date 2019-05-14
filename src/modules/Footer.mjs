const Footer = () =>
  footer({ class: 'Footer' }, [
    div({ class: 'wrapper' }, [
      'made with a few bits of ',
      Link({ to: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
    ]),
  ])

Footer.style = {
  'footer.main': {
    position: 'relative',
    textAlign: 'center',
    padding: '5em 0 .5em',
  },
}

export default Footer
