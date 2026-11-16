/** @import { BlogData } from '../types.mjs' */

/**
 * @param {Record<string, unknown> & { blog: BlogData, url: string, year: string, link?: string }} state
 */
export const View = state => {
  const { link, year, blog, url } = state

  /** @type {string | undefined} */
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
