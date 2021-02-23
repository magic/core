export const isStaticUrl = (list, link, root) => {
  if (link.startsWith(root)) {
    link = link.replace(root, '/')
  }

  return list.includes(link)
}
