/**
 * @param {Record<string, unknown> & { day: string, month: string, year: string, name: string, title: string, description: string }} state
 */
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
