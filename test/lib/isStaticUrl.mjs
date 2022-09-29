import { is } from '@magic/test'

import { isStaticUrl } from '../../src/lib/index.mjs'

// export const isStaticUrl = (list, link, root) => {
//   if (link.startsWith(root)) {
//     link = link.replace(root, '/')
//   }

//   return list.includes(link)
// }

const root = '/root/'
const rootedLink = `${root}rooted/`
const matchingLink = `/local/`
const notMatchingLink = `/not-static/`

const list = [
  '/rooted/',
  '/local/',
]

export default [
  { fn: isStaticUrl(list, rootedLink, root), info: 'isStaticUrl: rooted links in list return true' },
  { fn: isStaticUrl(list, matchingLink, root), info: 'isStaticUrl: non-rooted links in list return true' },
  { fn: isStaticUrl(list, notMatchingLink, root), expect: false,info: 'isStaticUrl: links not in list return false' },
]