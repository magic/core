export const View = state =>
  div([
    h4(
      Link({ to: state.name }, [
        state.day,
        '-',
        state.month,
        '-',
        state.year,
        ' - ',
        state.state.title,
      ]),
    ),
    p(state.state.description),
  ])
