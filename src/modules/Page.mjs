export const Page = ({ page, state }) =>
  div(
    {
      class: 'Wrapper',
      // oncreate: [() => console.log('create')],
    },
    [
      Header({ state }),
      div({ class: 'Page' }, page ? page(state) : '404 - not found'),
      Footer({ state }),
    ],
  )
