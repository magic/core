export const View = state =>
  div([
    h4([
      state.day,
      '-',
      state.month,
      '-',
      state.year,
      ' - ',
      Link({ to: state.name }, state.title),
    ]),
    p(state.description),
  ])
