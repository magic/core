export const View = state => {
  const { blog, month, year } = state
  const months = Object.entries(blog[year][month])

  return [
    h3([month, ' - ', year]),
    months.map(([day, posts]) =>
      posts.map(post => BlogTeaser({ ...state, day, ...post })),
    )
  ]
}
