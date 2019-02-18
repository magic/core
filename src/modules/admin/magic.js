module.exports = {
  View: page => (state, actions) =>
    div(
      { id: 'magic' },
      div(
        {
          class: 'wrapper',
          oncreate: () => {
            if (typeof window !== 'undefined' && actions.go) {
              window.addEventListener('popstate', actions.go)
            }
          },
        },
        [
          PageHead,
          page
            ? div({ class: 'page' }, page(state, actions))
            : div({ class: 'page' }, '404 - not found'),
          Footer.View,
        ],
      ),
    ),
}
