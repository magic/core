export const View = state => {
  const years = Object.entries(state.blog)
  return years.map(([year]) => BlogYear({ ...state, year }))
}
