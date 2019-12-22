export const View = state =>
  div([
    h2(state.year),
    Object.entries(state.blog[state.year]).map(([month, days]) =>
      BlogMonth({ ...state, month, days }),
    ),
  ])
