export const View = state => {
  const { link, year, blog, url } = state

  let to
  if (link) {
    to = `${link}${year}/`
  } else if (url.endsWith(`${year}/`)) {
    to = url
  }

  return div([
    h2(link ? Link({ to }, year) : year),
    Object.entries(blog[year]).map(([month, days]) =>
      BlogMonth({ ...state, month, days, link: to }),
    ),
  ])
}
