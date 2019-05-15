export const View = page => (state, actions) =>
  div(
    {
      class: 'Wrapper',
      oncreate: () => {
        if (typeof window !== 'undefined' && actions.go) {
          window.addEventListener('popstate', actions.go)
        }
      },
    },
    [Header, div({ class: 'Page' }, page ? page(state, actions) : '404 - not found'), Footer],
  )
