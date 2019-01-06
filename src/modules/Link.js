module.exports = {
  View: ({ to, text }) => (_, actions) => a({ href: to, onclick: actions.go }, text),
}
