const Footer = {
  style: {
    'footer.main': {
      position: 'relative',
      bottom: 0,
      top: 'auto',
      textAlign: 'center',
      padding: '0 0 .5em',
    },
  },
  View: () =>
    footer({ class: 'main' }, [
      div({ class: 'wrapper' }, [
        `© ${new Date().getFullYear()} - made with a few bits of `,
        Link({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
      ]),
    ]),
}

module.exports = Footer
