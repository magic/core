const Wrapper = page => (_, actions) => div(
  {
    class: 'Wrapper',
    oncreate: () => {
      if (typeof window !== 'undefined' && actions.go) {
        window.addEventListener('popstate', actions.go)
      }
    },
  },
  Page(page)
)

module.exports = Wrapper