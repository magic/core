export const Page = ({ page, state }) =>
  div(
    {
      class: 'Wrapper',
      oncreate: () => {
        if (typeof window !== 'undefined' && actions && actions.go) {
          window.addEventListener('popstate', actions.go)
        }
      },
    },
    [
      Header({ state }),
      div({ class: 'Page' }, page ? page({ state }) : '404 - not found'),
      Footer({ state }),
    ],
  )
