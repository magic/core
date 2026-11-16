import path from 'path'

import is from '@magic/types'

import { prepareBlogPost } from './blogPost.mjs'

import { replaceSlashSlash } from '../../lib/index.mjs'

/** @import { AppObject, Config, PageObject, BlogData, BlogPostEntry, ModuleView } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<{ posts: PageObject[], index: BlogData }>}
 */
export const prepareBlog = async (app, config) => {
  // the caller (tasks/prepare/index.mjs) only runs this with a BLOG_DIR set
  const BLOG_DIR = /** @type {string} */ (config.BLOG_DIR)

  const relativeBlogDir = BLOG_DIR.replace(`${config.ROOT}${path.sep}`, '')

  const extensions = ['.markdown', '.js', '.htm', '.mjs', '.html', '.md']

  const root = replaceSlashSlash(`${config.WEB_ROOT}/${relativeBlogDir}`)

  /** @type {BlogData} */
  const index = {}

  const posts = await Promise.all(
    (app.blog ?? []).map(async file => {
      const preparePost = prepareBlogPost({
        root,
        pageDir: BLOG_DIR,
        state: app.state,
        config,
      })

      const post = await preparePost(file)
      const rootedBlogPath = file.replace(BLOG_DIR, '')
      const parts = rootedBlogPath.split(path.sep).filter(a => a)
      const [year] = parts
      /** @type {string | boolean | undefined} */
      let month = parts[1]
      /** @type {string | boolean | undefined} */
      let day = parts[2]
      /** @type {string | string[]} */
      let postPath = parts.slice(3)

      if (!year || year.startsWith('index')) {
        return post
      }

      if (!month || month.startsWith('index')) {
        return post
      }

      if (!is.string(day) || day.startsWith('index')) {
        return post
      }

      if (!postPath.length && day) {
        postPath = day
        day = false
      }

      if (!postPath.length && month) {
        postPath = month
        month = false
      }

      if (year && !index[year]) {
        index[year] = {}
      }

      if (month && !index[year][month]) {
        index[year][month] = {}
      }

      if (month && day) {
        if (!index[year][month]) {
          index[year][month] = {}
        }

        if (!index[year][month][day]) {
          index[year][month][day] = []
        }

        if (post) {
          index[year][month][day].push(/** @type {BlogPostEntry} */ (post))
        }
      }

      return post
    }),
  )

  const file = (app.blog ?? []).find(blogFile =>
    extensions.some(f => blogFile === relativeBlogDir + f),
  )
  if (!file) {
    const post = {
      View: /** @type {ModuleView} */ (state => BlogArchive(state)),
      name: `${root}/`.replace(/\\/gim, '/'),
      path: `${root}/index.html`.replace(/\\/gim, '/'),
    }

    posts.push(post)
  }

  // create yearly and monthly archives if they do not exist yet.
  Object.entries(index).forEach(([year, months]) => {
    const yearDir = path.join(BLOG_DIR, year, 'index')
    const file = (app.blog ?? []).find(blogFile => extensions.some(f => blogFile === yearDir + f))

    if (!file) {
      const post = {
        View: /** @type {ModuleView} */ (state => BlogYear(state)),
        name: `${root}/${year}/`.replace(/\\/gim, '/'),
        path: `${root}/${year}/index.html`.replace(/\\/gim, '/'),
        state: {
          year,
        },
      }

      posts.push(post)
    }

    Object.entries(months).forEach(([month]) => {
      const monthDir = path.join(BLOG_DIR, year, month, 'index')
      const file = (app.blog ?? []).find(blogFile =>
        extensions.some(f => blogFile === monthDir + f),
      )

      if (!file) {
        const post = {
          View: /** @type {ModuleView} */ (state => BlogMonth(state)),
          name: `${root}/${year}/${month}/`.replace(/\\/gim, '/'),
          path: `${root}/${year}/${month}/index.html`.replace(/\\/gim, '/'),
          state: {
            year,
            month,
          },
        }

        posts.push(post)
      }
    })
  })

  return { posts: posts.filter(post => post !== undefined), index }
}
