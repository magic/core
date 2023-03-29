import path from 'path'

import { prepareBlogPost } from './blogPost.mjs'

import { replaceSlashSlash } from '../../lib/index.mjs'

export const prepareBlog = async (app, config) => {
  const relativeBlogDir = config.BLOG_DIR.replace(`${config.ROOT}${path.sep}`, '')

  const extensions = ['.markdown', '.js', '.htm', '.mjs', '.html', '.md']

  const root = replaceSlashSlash(`${config.WEB_ROOT}/${relativeBlogDir}`)

  const index = {}

  const posts = await Promise.all(
    app.blog.map(async file => {
      const preparePost = prepareBlogPost({
        root,
        pageDir: config.BLOG_DIR,
        state: app.state,
        config,
      })

      const post = await preparePost(file)
      const rootedBlogPath = file.replace(config.BLOG_DIR, '')
      let [year, month, day, ...postPath] = rootedBlogPath.split(path.sep).filter(a => a)

      if (year.startsWith('index')) {
        return post
      }

      if (month.startsWith('index')) {
        return post
      }

      if (day.startsWith('index')) {
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

      if (day) {
        if (!index[year][month][day]) {
          index[year][month][day] = []
        }

        index[year][month][day].push(post)
      }

      return post
    }),
  )

  const file = app.blog.find(file => extensions.some(f => file === relativeBlogDir + f))
  if (!file) {
    const post = {
      View: state => BlogArchive(state),
      name: `${root}/`.replace(/\\/gim, '/'),
      path: `${root}/index.html`.replace(/\\/gim, '/'),
    }

    posts.push(post)
  }

  // create yearly and monthly archives if they do not exist yet.
  Object.entries(index).forEach(([year, months]) => {
    const yearDir = path.join(config.BLOG_DIR, year, 'index')
    const file = app.blog.find(file => extensions.some(f => file === yearDir + f))

    if (!file) {
      const post = {
        View: state => BlogYear(state),
        name: `${root}/${year}/`.replace(/\\/gim, '/'),
        path: `${root}/${year}/index.html`.replace(/\\/gim, '/'),
        state: {
          year,
        },
      }

      posts.push(post)
    }

    Object.entries(months).forEach(([month, days]) => {
      const monthDir = path.join(config.BLOG_DIR, year, 'index')
      const file = app.blog.find(file => extensions.some(f => file === monthDir + f))

      if (!file) {
        const post = {
          View: state => BlogMonth(state),
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

  return { posts, index }
}
