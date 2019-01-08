const Footer = {
  style: {
    'footer.main': {
      position: 'relative',
      textAlign: 'center',
      padding: '5em 0 .5em',
    },
  },
  View: () =>
    footer({ class: 'main' }, [
      div({ class: 'wrapper' }, [
        `made with a few bits of `,
        Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
      ]),
    ]),
}

module.exports = Footer
