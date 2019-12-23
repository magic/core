export const View = state =>
  Object.entries(state.blog).map(([year]) => BlogYear({ ...state, year, link: state.url }))
