module.exports = {
  style: {
    '.admin-nav': {
      display: 'inline-block',
      width: '100%',

      li: {
        float: 'left',
        margin: '0 .2em 0 0',
      },
    },
  },

  View: ({ menu, action }) => () =>
    ul(
      { class: 'admin-nav' },
      menu.map(link => [li([a({ onclick: () => action(link.to) }, link.text)])]),
    ),
}
