const Footer = {
  View: () =>
    footer({ class: 'main' }, [
      div({ class: 'wrapper' }, [
        `&copy; ${new Date().getFullYear()} - made with ♥ and `,
        a({ href: 'https://github.com/magic/core', target: '_blank', rel: 'noopener' }, 'magic'),
      ]),
    ]),
}

module.exports = Footer
