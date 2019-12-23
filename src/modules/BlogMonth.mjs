export const View = state => {
  const { blog, link, month, url, year } = state
  const months = Object.entries(blog[year][month])

  let to
  const title = [month]
  if (link) {
    to = `${link}${month}/`
  } else {
    title.push(' - ', year)
  }

  return [
    h3(to ? Link({ to }, title) : title),
    months.map(([day, posts]) =>
      posts.map(post => BlogTeaser({ ...state, ...post.state, name: post.name, link: to, day })),
    ),
  ]
}
