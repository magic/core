export const View = (state, children) => {
  const { url, title, description } = state
  const [_, root, prefix, year, month, day, name] = url.split('/')

  return [
    h2(title),
    p(description),
    children,
    h4('Blog Archives:'),
    p(Link({ to: `/${root}/${prefix}/${year}/` }, `year: ${year}`)),
    p(Link({ to: `/${root}/${prefix}/${year}/${month}/` }, `month: ${month} ${year}`)),
  ]
}
