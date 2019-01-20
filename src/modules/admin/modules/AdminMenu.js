module.exports = ({ menu, action }) =>
  ul(menu.map(link => [
    li([
      a({ onclick: () => action(link.to) }, link.text),
    ]),
  ]))